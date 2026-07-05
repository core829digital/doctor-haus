import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24h
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 min

const SUPER_ADMIN_EMAILS = ["contact.core829@gmail.com"];

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function getClientIp(): string {
  return "unknown";
}

export const registerInitial = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("adminUsers").first();
    if (existing) {
      throw new Error("Admin already registered. Use login.");
    }
    const hashedPassword = bcrypt.hashSync(args.password, SALT_ROUNDS);
    await ctx.db.insert("adminUsers", {
      email: args.email.toLowerCase().trim(),
      hashedPassword,
      name: args.name,
      role: "superadmin",
      createdAt: Date.now(),
      isActive: true,
      loginAttempts: 0,
    });
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(normalizedEmail);

    const user = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    // Auto-provision for super admin emails not yet in DB
    if (!user && isSuperAdmin) {
      const hashedPassword = bcrypt.hashSync(args.password, SALT_ROUNDS);
      const userId = await ctx.db.insert("adminUsers", {
        email: normalizedEmail,
        hashedPassword,
        name: "Super Admin",
        role: "superadmin",
        createdAt: Date.now(),
        isActive: true,
        loginAttempts: 0,
      });
      const token = generateToken();
      await ctx.db.insert("adminSessions", {
        userId,
        token,
        expiresAt: Date.now() + SESSION_DURATION_MS,
        createdAt: Date.now(),
      });
      return {
        token,
        user: { id: userId, email: normalizedEmail, name: "Super Admin", role: "superadmin" },
      };
    }

    if (!user) {
      throw new Error("Credenziali non valide");
    }

    if (!user.isActive) {
      throw new Error("Account disabilitato");
    }

    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      const remaining = Math.ceil((user.lockedUntil - Date.now()) / 60000);
      throw new Error(`Account bloccato. Riprova tra ${remaining} minuti.`);
    }

    const valid = bcrypt.compareSync(args.password, user.hashedPassword);

    // For super admin: auto-reset password on mismatch, instead of lockout
    if (!valid && isSuperAdmin) {
      const newHash = bcrypt.hashSync(args.password, SALT_ROUNDS);
      await ctx.db.patch(user._id, {
        hashedPassword: newHash,
        loginAttempts: 0,
        lockedUntil: undefined,
        lastLoginAt: Date.now(),
      });
      const token = generateToken();
      await ctx.db.insert("adminSessions", {
        userId: user._id,
        token,
        expiresAt: Date.now() + SESSION_DURATION_MS,
        createdAt: Date.now(),
      });
      return {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }

    if (!valid) {
      const attempts = user.loginAttempts + 1;
      const update: Record<string, number | undefined> = { loginAttempts: attempts };
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        update.lockedUntil = Date.now() + LOCK_DURATION_MS;
        update.loginAttempts = 0;
      }
      await ctx.db.patch(user._id, update);
      const remaining = MAX_LOGIN_ATTEMPTS - attempts;
      if (remaining <= 0) {
        throw new Error("Account bloccato per 15 minuti per troppi tentativi.");
      }
      throw new Error(`Email o password non valida. Tentativi rimasti: ${Math.max(0, remaining)}`);
    }

    await ctx.db.patch(user._id, {
      lastLoginAt: Date.now(),
      loginAttempts: 0,
      lockedUntil: undefined,
    });

    const token = generateToken();
    await ctx.db.insert("adminSessions", {
      userId: user._id,
      token,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      createdAt: Date.now(),
    });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },
});

export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const verifySession = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const vt = args.token;
    if (!vt) return null;
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", vt))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = await ctx.db.get(session.userId);
    if (!user || !user.isActive) return null;
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

export const getCurrentUser = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const token: string = args.token;
    if (!token) return null;
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = await ctx.db.get(session.userId);
    if (!user || !user.isActive) return null;
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
});

export const checkUserType = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();

    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (admin) return { type: "admin" as const, name: admin.name, role: admin.role, hasPassword: true };

    // Check super admin list even if not yet in DB
    if (SUPER_ADMIN_EMAILS.includes(normalizedEmail)) {
      return { type: "admin" as const, name: "Super Admin", role: "superadmin", hasPassword: false };
    }

    const customer = await ctx.db
      .query("customerUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (customer) return { type: "customer" as const, name: customer.name, hasPassword: true };

    const lead = await ctx.db
      .query("quoteRequests")
      .withIndex("by_email", (q) => q.eq("customerEmail", normalizedEmail))
      .first();
    if (lead) return { type: "customer" as const, name: lead.customerName, hasPassword: false };

    return null;
  },
});

export const register = mutation({
  args: {
    adminCode: v.string(),
    email: v.string(),
    password: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const expectedCode = process.env.ADMIN_REGISTER_CODE || "admin829";
    if (args.adminCode !== expectedCode) {
      throw new Error("Codice di registrazione non valido.");
    }
    const normalizedEmail = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (existing) {
      throw new Error("Email già registrata");
    }
    const hashedPassword = bcrypt.hashSync(args.password, SALT_ROUNDS);
    const isFirst = !(await ctx.db.query("adminUsers").first());
    await ctx.db.insert("adminUsers", {
      email: normalizedEmail,
      hashedPassword,
      name: args.name,
      role: isFirst ? "superadmin" : "admin",
      createdAt: Date.now(),
      isActive: true,
      loginAttempts: 0,
    });
  },
});

export const createAdminUser = internalMutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (existing) {
      throw new Error("Email già registrata");
    }
    const hashedPassword = bcrypt.hashSync(args.password, SALT_ROUNDS);
    await ctx.db.insert("adminUsers", {
      email: normalizedEmail,
      hashedPassword,
      name: args.name,
      role: args.role,
      createdAt: Date.now(),
      isActive: true,
      loginAttempts: 0,
    });
  },
});
