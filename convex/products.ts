import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_active_sort", (q) => q.eq("active", true))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
