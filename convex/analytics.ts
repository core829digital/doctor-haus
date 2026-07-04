import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackEvent = mutation({
  args: {
    type: v.string(),
    page: v.optional(v.string()),
    locale: v.optional(v.string()),
    sessionId: v.string(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("analyticsEvents", {
      type: args.type,
      page: args.page,
      locale: args.locale,
      sessionId: args.sessionId,
      metadata: args.metadata,
      timestamp: Date.now(),
    });
  },
});

export const getPageviews = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const start = args.startDate ?? Date.now() - 30 * 24 * 60 * 60 * 1000;
    const end = args.endDate ?? Date.now();
    const events = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_type", (q) => q.eq("type", "pageview"))
      .collect();
    return events.filter((e) => e.timestamp >= start && e.timestamp <= end).length;
  },
});

export const getStats = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const start = args.startDate ?? Date.now() - 30 * 24 * 60 * 60 * 1000;
    const end = args.endDate ?? Date.now();

    const events = await ctx.db.query("analyticsEvents").collect();
    const filtered = events.filter((e) => e.timestamp >= start && e.timestamp <= end);

    const pageviews = filtered.filter((e) => e.type === "pageview").length;
    const clicks = filtered.filter((e) => e.type === "click").length;
    const uniqueSessions = new Set(filtered.map((e) => e.sessionId)).size;
    const formSubmits = filtered.filter((e) => e.type === "form_submit").length;

    const leads = await ctx.db.query("quoteRequests").collect();
    const newLeads = leads.filter((q) => {
      return q.createdAt >= start && q.createdAt <= end;
    });

    const leadsByStatus = {
      nuovo: newLeads.filter((q) => q.status === "nuovo").length,
      in_lavorazione: newLeads.filter((q) => q.status === "in_lavorazione").length,
      evaso: newLeads.filter((q) => q.status === "evaso").length,
    };

    return {
      pageviews,
      clicks,
      uniqueSessions,
      formSubmits,
      leads: newLeads.length,
      leadsByStatus,
      period: { start, end },
    };
  },
});

export const getLeads = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    let leads;
    if (args.status) {
      leads = await ctx.db
        .query("quoteRequests")
        .withIndex("by_status", (q) => q.eq("status", args.status as "nuovo" | "in_lavorazione" | "evaso"))
        .collect();
    } else {
      leads = await ctx.db.query("quoteRequests").collect();
    }
    return leads
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
      .map((q) => ({
        _id: q._id,
        customerName: q.customerName,
        customerEmail: q.customerEmail,
        customerPhone: q.customerPhone,
        customerMessage: q.customerMessage,
        status: q.status,
        createdAt: q.createdAt,
        preferredLanguage: q.preferredLanguage,
      }));
  },
});

export const getLeadsByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const leads = await ctx.db
      .query("quoteRequests")
      .withIndex("by_email", (q) => q.eq("customerEmail", args.email.toLowerCase().trim()))
      .collect();
    const enriched = await Promise.all(
      leads.map(async (lead) => {
        const product = await ctx.db.get(lead.productId);
        const layout = lead.layoutId ? await ctx.db.get(lead.layoutId) : null;
        return {
          _id: lead._id,
          customerName: lead.customerName,
          customerEmail: lead.customerEmail,
          customerPhone: lead.customerPhone,
          customerMessage: lead.customerMessage,
          status: lead.status,
          adminNote: lead.adminNote,
          createdAt: lead.createdAt,
          productName: product?.name ?? "Sconosciuto",
          layoutName: layout?.name ?? null,
          selectedOptions: lead.selectedOptions,
        };
      })
    );
    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const updateLeadAdminNote = mutation({
  args: {
    leadId: v.id("quoteRequests"),
    adminNote: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, { adminNote: args.adminNote });
  },
});

export const updateLeadStatus = mutation({
  args: {
    leadId: v.id("quoteRequests"),
    status: v.union(
      v.literal("nuovo"),
      v.literal("in_lavorazione"),
      v.literal("evaso")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.leadId, { status: args.status });
  },
});

export const getLeadDetail = query({
  args: { leadId: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return null;
    const product = await ctx.db.get(lead.productId);
    const layout = lead.layoutId ? await ctx.db.get(lead.layoutId) : null;
    return {
      ...lead,
      productName: product?.name ?? "Sconosciuto",
      layoutName: layout?.name ?? null,
    };
  },
});

export const getTopPages = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const start = args.startDate ?? Date.now() - 30 * 24 * 60 * 60 * 1000;
    const end = args.endDate ?? Date.now();
    const limit = args.limit ?? 10;
    const events = await ctx.db.query("analyticsEvents").collect();
    const filtered = events.filter(
      (e) => e.type === "pageview" && e.timestamp >= start && e.timestamp <= end && e.page
    );
    const pageCounts: Record<string, number> = {};
    for (const e of filtered) {
      const page = e.page!;
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    }
    return Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([page, count]) => ({ page, count }));
  },
});

export const getDailyPageviews = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 30;
    const now = Date.now();
    const start = now - days * 24 * 60 * 60 * 1000;
    const events = await ctx.db.query("analyticsEvents").collect();
    const filtered = events.filter((e) => e.type === "pageview" && e.timestamp >= start);

    const daily: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      daily[key] = 0;
    }
    for (const e of filtered) {
      const key = new Date(e.timestamp).toISOString().split("T")[0];
      if (daily[key] !== undefined) daily[key]++;
    }
    return Object.entries(daily)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  },
});
