import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { requireAdmin } from "./lib/requireAdmin";

export const create = mutation({
  args: {
    adminToken: v.string(),
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    await ctx.db.insert("notifications", {
      type: args.type,
      title: args.title,
      description: args.description,
      link: args.link,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const internalCreate = internalMutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      type: args.type,
      title: args.title,
      description: args.description,
      link: args.link,
      read: false,
      createdAt: Date.now(),
    });
  },
});

export const list = query({
  args: { adminToken: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    const limit = args.limit ?? 50;
    const items = await ctx.db.query("notifications").collect();
    return items
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
      .map((n) => ({
        _id: n._id,
        type: n.type,
        title: n.title,
        description: n.description,
        link: n.link,
        read: n.read,
        createdAt: n.createdAt,
      }));
  },
});

export const getUnreadCount = query({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    const items = await ctx.db.query("notifications").collect();
    return items.filter((n) => !n.read).length;
  },
});

export const markRead = mutation({
  args: { adminToken: v.string(), id: v.id("notifications") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    await ctx.db.patch(args.id, { read: true });
  },
});

export const markAllRead = mutation({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.adminToken);
    const items = await ctx.db.query("notifications").collect();
    const unread = items.filter((n) => !n.read);
    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { read: true })));
  },
});
