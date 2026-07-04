import { query } from "./_generated/server";
import { v } from "convex/values";

export const listByCategory = query({
  args: { categoryId: v.id("optionCategories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("optionChoices")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();
  },
});
