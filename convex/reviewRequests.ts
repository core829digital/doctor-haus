import { v } from "convex/values";
import { query, internalMutation, internalQuery, internalAction } from "./_generated/server";

// ── Public queries (admin dashboard) ─────────────

export const getReviewStats = query({
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviewRequests").collect();
    const pending = reviews.filter((r) => r.status === "pending").length;
    const sent = reviews.filter((r) => r.status === "sent").length;
    const completed = reviews.filter((r) => r.status === "completed").length;
    const skipped = reviews.filter((r) => r.status === "skipped").length;
    const ratings = reviews
      .filter((r) => r.rating != null)
      .map((r) => r.rating!);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null;

    return { pending, sent, completed, skipped, total: reviews.length, avgRating };
  },
});

export const getReviews = query({
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviewRequests").order("desc").collect();
    return reviews.map((r) => ({
      _id: r._id,
      quoteId: r.quoteId,
      customerName: r.customerName,
      customerEmail: r.customerEmail,
      status: r.status,
      sentAt: r.sentAt,
      completedAt: r.completedAt,
      rating: r.rating,
      review: r.review,
      createdAt: r.createdAt,
    }));
  },
});

// ── Internal functions (used by cron jobs) ─────────────

export const createPendingReviewsIfNeeded = internalMutation({
  handler: async (ctx) => {
    const leads = await ctx.db
      .query("quoteRequests")
      .withIndex("by_status", (q) => q.eq("status", "evaso"))
      .collect();

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const existing = await ctx.db.query("reviewRequests").collect();
    const existingQuoteIds = new Set(existing.map((r) => r.quoteId));

    let created = 0;
    for (const lead of leads) {
      if (lead.createdAt > sevenDaysAgo) continue;
      if (existingQuoteIds.has(lead._id)) continue;

      await ctx.db.insert("reviewRequests", {
        quoteId: lead._id,
        customerEmail: lead.customerEmail,
        customerName: lead.customerName,
        status: "pending",
        createdAt: Date.now(),
      });
      created++;
    }
    return { created };
  },
});

export const getPendingReviews = internalQuery({
  handler: async (ctx) => {
    return await ctx.db
      .query("reviewRequests")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

export const getPendingReviewById = internalQuery({
  args: { reviewId: v.id("reviewRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.reviewId);
  },
});

export const markReviewSent = internalMutation({
  args: { reviewId: v.id("reviewRequests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reviewId, {
      status: "sent",
      sentAt: Date.now(),
    });
  },
});

// ── Actions ──────────────────────────────────────
// String-based function refs avoid circular dep via _generated/api

export const checkAndSendReviewRequests = internalAction({
  args: {},
  handler: async (ctx) => {
    const c = ctx as any;
    const { created } = await c.runMutation("reviewRequests:createPendingReviewsIfNeeded", {});
    if (created === 0) return { processed: 0 };
    const reviews = await c.runQuery("reviewRequests:getPendingReviews", {});
    let sent = 0;
    for (const review of reviews) {
      const result = await sendReviewRequestCore(c, review._id);
      if (result.sent) sent++;
    }
    return { processed: created, sent };
  },
});

export const sendReviewRequestAct = internalAction({
  args: { reviewId: v.id("reviewRequests") },
  handler: async (ctx, args) => {
    return await sendReviewRequestCore(ctx as any, args.reviewId);
  },
});

async function sendReviewRequestCore(ctx: any, reviewId: string) {
  const review = await ctx.runQuery("reviewRequests:getPendingReviewById", { reviewId });
  if (!review || review.status !== "pending") return { sent: false, reason: "not_pending" };

  const lang = review.customerEmail.includes(".en") ? "en" : "it";
  const subject = lang === "it"
    ? "Ci farebbe piacere conoscere la tua opinione!"
    : "We'd love to hear your feedback!";

  try {
    const res = await fetch(`${process.env.CONVEX_SITE_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: review.customerEmail,
        subject,
        body: lang === "it"
          ? `Ciao ${review.customerName},\n\nsiamo felici che tu abbia scelto Doctor Haus. Ci piacerebbe conoscere la tua esperienza.\n\nGrazie!\nTeam Doctor Haus`
          : `Hi ${review.customerName},\n\nwe're glad you chose Doctor Haus. We'd love to hear about your experience.\n\nThanks!\nTeam Doctor Haus`,
        adminToken: "internal",
      }),
    });

    if (!res.ok) {
      return { sent: false, reason: `http_${res.status}` };
    }

    await ctx.runMutation("reviewRequests:markReviewSent", { reviewId });
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: String(err) };
  }
}
