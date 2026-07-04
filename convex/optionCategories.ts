import { query } from "./_generated/server";
import { v } from "convex/values";

export const listForProduct = query({
  args: { family: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("optionCategories")
      .withIndex("by_sort")
      .collect();
    return all.filter((cat) => cat.applicableToFamilies.includes(args.family));
  },
});

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("optionCategories")
      .withIndex("by_sort")
      .collect();
  },
});
