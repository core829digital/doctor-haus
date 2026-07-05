import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";

export const list = query({
  args: { limit: v.optional(v.number()), offset: v.optional(v.number()), productId: v.optional(v.id("products")) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const offset = args.offset ?? 0;
    if (args.productId) {
      return await ctx.db
        .query("mediaFiles")
        .withIndex("by_product", (q) => q.eq("productId", args.productId!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db
      .query("mediaFiles")
      .withIndex("by_uploadedAt")
      .order("desc")
      .take(limit + offset)
      .then((rows) => rows.slice(offset, offset + limit));
  },
});

export const getCount = query({
  args: {},
  handler: async (ctx) => {
    return (await ctx.db.query("mediaFiles").collect()).length;
  },
});

export const getDetail = query({
  args: { mediaId: v.id("mediaFiles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.mediaId);
  },
});

export const create = mutation({
  args: {
    filename: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    uploadedBy: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mediaFiles", {
      ...args,
      alt: args.alt ?? "",
      uploadedAt: Date.now(),
    });
  },
});

export const internalCreate = internalMutation({
  args: {
    filename: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    uploadedBy: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mediaFiles", {
      ...args,
      alt: args.alt ?? "",
      uploadedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    mediaId: v.id("mediaFiles"),
    alt: v.optional(v.string()),
    productId: v.optional(v.id("products")),
  },
  handler: async (ctx, args) => {
    const { mediaId, ...fields } = args;
    await ctx.db.patch(mediaId, fields);
  },
});

export const remove = mutation({
  args: { mediaId: v.id("mediaFiles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.mediaId);
  },
});
