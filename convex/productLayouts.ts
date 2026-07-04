import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("productLayouts")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});
