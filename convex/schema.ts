import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    slug: v.string(),
    family: v.string(),
    name: v.string(),
    description: v.string(),
    heroImage: v.optional(v.string()),
    gallery: v.optional(v.array(v.string())),
    dimensions: v.object({
      lengthMm: v.number(),
      widthMm: v.number(),
      heightMm: v.number(),
    }),
    dimensionsExpandedMm: v.optional(
      v.object({ lengthMm: v.number(), widthMm: v.number(), heightMm: v.number() })
    ),
    areaSqm: v.number(),
    weightTons: v.optional(v.number()),
    capacityPersons: v.optional(v.string()),
    isFeatured: v.boolean(),
    basePrice: v.optional(v.number()),
    sortOrder: v.number(),
    active: v.boolean(),
  }).index("by_slug", ["slug"])
    .index("by_active_sort", ["active", "sortOrder"]),

  productLayouts: defineTable({
    productId: v.id("products"),
    name: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    bedrooms: v.optional(v.number()),
    sortOrder: v.number(),
  }).index("by_product", ["productId", "sortOrder"]),

  optionCategories: defineTable({
    slug: v.string(),
    label: v.string(),
    description: v.optional(v.string()),
    applicableToFamilies: v.array(v.string()),
    sortOrder: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_sort", ["sortOrder"]),

  optionChoices: defineTable({
    categoryId: v.id("optionCategories"),
    label: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    technicalSpecs: v.optional(v.array(v.string())),
    subOptions: v.optional(
      v.array(v.object({ label: v.string(), description: v.optional(v.string()) }))
    ),
    priceModifier: v.optional(v.number()),
    sortOrder: v.number(),
  }).index("by_category", ["categoryId", "sortOrder"]),

  quoteRequests: defineTable({
    productId: v.id("products"),
    layoutId: v.optional(v.id("productLayouts")),
    selectedOptions: v.array(
      v.object({
        categoryId: v.id("optionCategories"),
        choiceId: v.id("optionChoices"),
        categoryLabel: v.string(),
        choiceLabel: v.string(),
      })
    ),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    customerMessage: v.optional(v.string()),
    preferredLanguage: v.string(),
    status: v.union(
      v.literal("nuovo"),
      v.literal("in_lavorazione"),
      v.literal("evaso")
    ),
    adminNote: v.optional(v.string()),
    createdAt: v.number(),
    gdprConsent: v.boolean(),
  }).index("by_status", ["status", "createdAt"])
    .index("by_email", ["customerEmail"]),

  configurationDrafts: defineTable({
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
    lastUpdatedAt: v.number(),
    completed: v.boolean(),
  }).index("by_session", ["sessionId"]),

  // ── Customer accounts (separate from quote requests) ──
  customerUsers: defineTable({
    email: v.string(),
    hashedPassword: v.string(),
    name: v.string(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  }).index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"]),

  customerSessions: defineTable({
    userId: v.id("customerUsers"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"])
    .index("by_user", ["userId"]),

  // ── Admin system ──────────────────────────────────────
  adminUsers: defineTable({
    email: v.string(),
    hashedPassword: v.string(),
    name: v.string(),
    role: v.string(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    isActive: v.boolean(),
    loginAttempts: v.number(),
    lockedUntil: v.optional(v.number()),
  }).index("by_email", ["email"]),

  adminSessions: defineTable({
    userId: v.id("adminUsers"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_token", ["token"])
    .index("by_user", ["userId"]),

  analyticsEvents: defineTable({
    type: v.string(),
    page: v.optional(v.string()),
    locale: v.optional(v.string()),
    sessionId: v.string(),
    metadata: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_type", ["type", "timestamp"])
    .index("by_session", ["sessionId", "timestamp"])
    .index("by_page", ["page", "timestamp"])
    .index("by_timestamp", ["timestamp"]),

  mediaFiles: defineTable({
    filename: v.string(),
    originalName: v.string(),
    mimeType: v.string(),
    size: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    alt: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    uploadedAt: v.number(),
    uploadedBy: v.id("adminUsers"),
  }).index("by_product", ["productId"])
    .index("by_uploadedAt", ["uploadedAt"]),

  financialRecords: defineTable({
    quoteId: v.id("quoteRequests"),
    customerId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    notes: v.optional(v.string()),
  }).index("by_status", ["status", "createdAt"])
    .index("by_quote", ["quoteId"]),

  emailLogs: defineTable({
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    type: v.string(),
    sentAt: v.number(),
    sentBy: v.id("adminUsers"),
    quoteId: v.optional(v.id("quoteRequests")),
  }).index("by_quote", ["quoteId"])
    .index("by_type", ["type", "sentAt"]),

  reviewRequests: defineTable({
    quoteId: v.id("quoteRequests"),
    customerEmail: v.string(),
    customerName: v.string(),
    status: v.string(),
    sentAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_status", ["status", "createdAt"]),

  notifications: defineTable({
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_read", ["read", "createdAt"]),
});
