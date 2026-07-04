import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    preferredLanguage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("customerUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (existing) {
      throw new Error("Email già registrata");
    }
    if (args.password.length < 8) {
      throw new Error("La password deve essere di almeno 8 caratteri");
    }
    const hashedPassword = bcrypt.hashSync(args.password, SALT_ROUNDS);
    const userId = await ctx.db.insert("customerUsers", {
      email: normalizedEmail,
      hashedPassword,
      name: args.name,
      createdAt: Date.now(),
    });
    const token = generateToken();
    await ctx.db.insert("customerSessions", {
      userId,
      token,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      createdAt: Date.now(),
    });
    return {
      token,
      user: { id: userId, email: normalizedEmail, name: args.name },
    };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const user = await ctx.db
      .query("customerUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (!user) {
      throw new Error("Email o password non valida");
    }
    const valid = bcrypt.compareSync(args.password, user.hashedPassword);
    if (!valid) {
      throw new Error("Email o password non valida");
    }
    await ctx.db.patch(user._id, { lastLoginAt: Date.now() });
    const token = generateToken();
    await ctx.db.insert("customerSessions", {
      userId: user._id,
      token,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      createdAt: Date.now(),
    });
    return {
      token,
      user: { id: user._id, email: user.email, name: user.name },
    };
  },
});

export const loginWithoutPassword = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    let user = await ctx.db
      .query("customerUsers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();
    if (!user) {
      const lead = await ctx.db
        .query("quoteRequests")
        .withIndex("by_email", (q) => q.eq("customerEmail", normalizedEmail))
        .first();
      if (!lead) {
        throw new Error("Nessun account trovato con questa email");
      }
      const hashedPassword = bcrypt.hashSync("temporary", SALT_ROUNDS);
      const userId = await ctx.db.insert("customerUsers", {
        email: normalizedEmail,
        hashedPassword,
        name: lead.customerName,
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
      if (!user) throw new Error("Errore durante la creazione dell'account");
    }
    const token = generateToken();
    await ctx.db.insert("customerSessions", {
      userId: user._id,
      token,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      createdAt: Date.now(),
    });
    await ctx.db.patch(user._id, { lastLoginAt: Date.now() });
    return {
      token,
      user: { id: user._id, email: user.email, name: user.name },
    };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("customerSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});

export const verifySession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token) return null;
    const session = await ctx.db
      .query("customerSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = await ctx.db.get(session.userId);
    if (!user) return null;
    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  },
});

export const getCurrentUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token) return null;
    const session = await ctx.db
      .query("customerSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session || session.expiresAt < Date.now()) return null;
    const user = await ctx.db.get(session.userId);
    if (!user) return null;
    return {
      id: user._id,
      email: user.email,
      name: user.name,
    };
  },
});

export const checkEmailExists = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("customerUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase().trim()))
      .first();
    return !!user;
  },
});
