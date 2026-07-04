import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const upsert = mutation({
  args: {
    sessionId: v.string(),
    productId: v.optional(v.id("products")),
    layoutId: v.optional(v.id("productLayouts")),
    selectedOptions: v.array(
      v.object({
        categoryId: v.id("optionCategories"),
        choiceId: v.id("optionChoices"),
      })
    ),
    currentStep: v.optional(v.number()),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("configurationDrafts")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const data = {
      sessionId: args.sessionId,
      productId: args.productId,
      layoutId: args.layoutId,
      selectedOptions: args.selectedOptions,
      currentStep: args.currentStep,
      lastUpdatedAt: Date.now(),
      completed: args.completed,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("configurationDrafts", data);
    }
  },
});
