import { mutation, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal, api } from "./_generated/api";

export const create = mutation({
  args: {
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
    gdprConsent: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.gdprConsent) {
      throw new Error("GDPR consent is required");
    }

    const quoteId = await ctx.db.insert("quoteRequests", {
      productId: args.productId,
      layoutId: args.layoutId,
      selectedOptions: args.selectedOptions,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      customerMessage: args.customerMessage,
      preferredLanguage: args.preferredLanguage,
      status: "nuovo",
      createdAt: Date.now(),
      gdprConsent: args.gdprConsent,
    });

    await ctx.scheduler.runAfter(0, internal.quoteRequests.sendEmails, {
      quoteId,
      preferredLanguage: args.preferredLanguage,
    });

    await ctx.scheduler.runAfter(0, internal.notifications.internalCreate, {
      type: "new_lead",
      title: `Nuovo lead: ${args.customerName}`,
      description: `Richiesta preventivo${args.customerMessage ? ` — ${args.customerMessage.substring(0, 100)}` : ""}`,
      link: `/admin/leads/${quoteId}`,
    });

    await ctx.scheduler.runAfter(0, internal.email.sendNewLeadNotification, {
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      productName: args.productId,
      message: args.customerMessage,
      leadId: quoteId,
    });

    return quoteId;
  },
});

export const sendEmails = internalAction({
  args: {
    quoteId: v.id("quoteRequests"),
    preferredLanguage: v.string(),
  },
  handler: async (ctx, args) => {
    const quote = await ctx.runQuery(internal.quoteRequests.getQuote, {
      id: args.quoteId,
    });
    if (!quote) return;

    const product = await ctx.runQuery(api.products.getById, {
      id: quote.productId,
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not set");
      return;
    }

    const optionsText = quote.selectedOptions
      .map((o: { categoryLabel: string; choiceLabel: string }) => `  • ${o.categoryLabel}: ${o.choiceLabel}`)
      .join("\n");

    const isItalian = args.preferredLanguage === "it";

    const adminEmail = {
      from: "Doctor Haus <noreply@doctor-haus.com>",
      to: ["andrea@montaggisrl.it", "filippo@montaggisrl.it"],
      subject: isItalian
        ? `Nuova richiesta di preventivo: ${product?.name ?? "Prodotto"}`
        : `New quote request: ${product?.name ?? "Product"}`,
      text: isItalian
        ? `Nuova richiesta di preventivo\n\nProdotto: ${product?.name}\nCliente: ${quote.customerName}\nEmail: ${quote.customerEmail}\nTelefono: ${quote.customerPhone}\n\nOpzioni selezionate:\n${optionsText}\n\nMessaggio: ${quote.customerMessage ?? "—"}\n\nData: ${new Date(quote.createdAt).toLocaleString("it-IT")}`
        : `New quote request\n\nProduct: ${product?.name}\nCustomer: ${quote.customerName}\nEmail: ${quote.customerEmail}\nPhone: ${quote.customerPhone}\n\nSelected options:\n${optionsText}\n\nMessage: ${quote.customerMessage ?? "—"}\n\nDate: ${new Date(quote.createdAt).toLocaleString("en-GB")}`,
    };

    const customerSubject = isItalian
      ? "Abbiamo ricevuto la tua richiesta — Doctor Haus"
      : "We've received your request — Doctor Haus";
    const customerText = isItalian
      ? `Ciao ${quote.customerName},\n\nabbiamo ricevuto la tua richiesta di preventivo per ${product?.name}. Ti ricontatteremo entro 24-48 ore lavorative con un preventivo personalizzato.\n\nEcco un riepilogo della tua configurazione:\n${optionsText}\n\nA presto,\nIl team Doctor Haus`
      : `Hi ${quote.customerName},\n\nwe've received your quote request for ${product?.name}. We'll get back to you within 24-48 business hours with a personalized quote.\n\nHere's a summary of your configuration:\n${optionsText}\n\nBest regards,\nThe Doctor Haus team`;

    const customerEmail = {
      from: "Doctor Haus <noreply@doctor-haus.com>",
      to: [quote.customerEmail],
      subject: customerSubject,
      text: customerText,
    };

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminEmail),
      });

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerEmail),
      });
    } catch (err) {
      console.error("Failed to send emails:", err);
    }
  },
});

export const getQuote = internalQuery({
  args: { id: v.id("quoteRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
