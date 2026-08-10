import type { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Verifies an admin session token server-side and returns the admin user.
 * Every admin-only query/mutation must call this before touching admin data —
 * the admin panel's client-side auth gate is UI-only and does not protect
 * the underlying Convex functions, which are reachable directly by anyone
 * holding the public Convex deployment URL.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx, token: string) {
  if (!token) throw new Error("Non autorizzato");
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();
  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Sessione scaduta o non valida");
  }
  const user = await ctx.db.get(session.userId);
  if (!user || !user.isActive) {
    throw new Error("Non autorizzato");
  }
  return user;
}
