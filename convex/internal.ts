import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getProductById = internalQuery({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
