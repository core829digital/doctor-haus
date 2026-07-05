import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery, query } from "./_generated/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InternalCtx = { runQuery(name: string, args: Record<string, unknown>): Promise<any>; runMutation(name: string, args: Record<string, unknown>): Promise<any> };

function buildHtml(opts: { preheader: string; title: string; body: string; cta?: { text: string; url: string } }): string {
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
  .container{max-width:560px;margin:0 auto;padding:24px 16px}
  .card{background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
  .logo{font-size:22px;font-weight:700;color:#1C1C1A;margin-bottom:24px}
  .logo span{color:#6B8F4E}
  h1{font-size:18px;color:#1C1C1A;margin:0 0 8px 0}
  .preheader{font-size:13px;color:#6B7280;margin-bottom:24px}
  .body-text{font-size:14px;color:#374151;line-height:1.6;margin-bottom:24px}
  .body-text p{margin:0 0 12px 0}
  .btn{display:inline-block;background:#6B8F4E;color:#fff!important;text-decoration:none;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:500}
  .footer{font-size:11px;color:#9CA3AF;text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #E5E7EB}
  .footer a{color:#6B8F4E;text-decoration:none}
</style></head>
<body>
<div class="container">
  <div class="card">
    <div class="logo">Doctor <span>Haus</span></div>
    <h1>${opts.title}</h1>
    ${opts.preheader ? `<p class="preheader">${opts.preheader}</p>` : ""}
    <div class="body-text">${opts.body}</div>
    ${opts.cta ? `<p style="text-align:center"><a href="${opts.cta.url}" class="btn">${opts.cta.text}</a></p>` : ""}
  </div>
  <div class="footer">
    <p>Doctor Haus &copy; ${new Date().getFullYear()}</p>
    <p><a href="https://doctor-haus.com">doctor-haus.com</a></p>
  </div>
</div>
</body>
</html>`;
}

async function sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return false;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Doctor Haus <noreply@doctor-haus.com>", to: [to], subject, html }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return false;
  }
  return true;
}

export const logEmail = internalMutation({
  args: {
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    type: v.string(),
    quoteId: v.optional(v.id("quoteRequests")),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db.query("adminUsers").first();
    if (!admin) return;
    await ctx.db.insert("emailLogs", {
      to: args.to,
      subject: args.subject,
      body: args.body,
      type: args.type,
      sentAt: Date.now(),
      sentBy: admin._id,
      quoteId: args.quoteId,
    });
  },
});

export const getEmailLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db.query("emailLogs").order("desc").take(limit);
  },
});

export const listAdminEmails = internalQuery({
  handler: async (ctx) => {
    const admins = await ctx.db.query("adminUsers").collect();
    return admins.map((a) => a.email).filter(Boolean);
  },
});

// ── Per-type send actions ─────────────────────────

export const sendNewLeadNotification = internalAction({
  args: {
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    productName: v.optional(v.string()),
    message: v.optional(v.string()),
    leadId: v.optional(v.id("quoteRequests")),
  },
  handler: async (ctx, args) => {
    const c = ctx as unknown as InternalCtx;
    const adminEmails = await c.runQuery("email:listAdminEmails", {});
    if (adminEmails.length === 0) return { sent: false };

    const body = `<p><strong>Nome:</strong> ${args.customerName}</p>
<p><strong>Email:</strong> ${args.customerEmail}</p>
<p><strong>Telefono:</strong> ${args.customerPhone}</p>
${args.productName ? `<p><strong>Prodotto:</strong> ${args.productName}</p>` : ""}
${args.message ? `<p><strong>Messaggio:</strong><br>${args.message}</p>` : ""}`;

    const html = buildHtml({
      preheader: "Un cliente ha richiesto un preventivo.",
      title: `Nuovo preventivo: ${args.customerName}`,
      body,
      cta: { text: "Visualizza lead", url: "https://doctor-haus.com/admin/leads" },
    });

    let sentCount = 0;
    for (const email of adminEmails) {
      const ok = await sendViaResend(email, `[Doctor Haus] Nuovo preventivo da ${args.customerName}`, html);
      if (ok) {
        sentCount++;
        await c.runMutation("email:logEmail", { to: email, subject: `Nuovo preventivo: ${args.customerName}`, body: html, type: "new_lead" });
      }
    }
    return { sent: sentCount > 0, count: sentCount };
  },
});

export const sendContactFormNotification = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const c = ctx as unknown as InternalCtx;
    const adminEmails = await c.runQuery("email:listAdminEmails", {});
    if (adminEmails.length === 0) return { sent: false };

    const body = `<p><strong>Nome:</strong> ${args.name}</p>
<p><strong>Email:</strong> ${args.email}</p>
${args.message ? `<p><strong>Messaggio:</strong><br>${args.message}</p>` : ""}`;

    const html = buildHtml({
      preheader: "Qualcuno ha compilato il form contatti.",
      title: `Richiesta contatto: ${args.name}`,
      body,
      cta: { text: "Vedi richieste", url: "https://doctor-haus.com/admin" },
    });

    let sentCount = 0;
    for (const email of adminEmails) {
      const ok = await sendViaResend(email, `[Doctor Haus] Richiesta contatto da ${args.name}`, html);
      if (ok) {
        sentCount++;
        await c.runMutation("email:logEmail", { to: email, subject: `Richiesta contatto: ${args.name}`, body: html, type: "contact_form" });
      }
    }
    return { sent: sentCount > 0, count: sentCount };
  },
});

export const sendRegistrationNotification = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const c = ctx as unknown as InternalCtx;
    const adminEmails = await c.runQuery("email:listAdminEmails", {});
    if (adminEmails.length === 0) return { sent: false };

    const body = `<p><strong>Nome:</strong> ${args.name}</p>
<p><strong>Email:</strong> ${args.email}</p>`;

    const html = buildHtml({
      preheader: "Un nuovo utente ha creato un account.",
      title: `Nuovo utente: ${args.name}`,
      body,
      cta: { text: "Vedi utenti", url: "https://doctor-haus.com/admin/users" },
    });

    let sentCount = 0;
    for (const email of adminEmails) {
      const ok = await sendViaResend(email, `[Doctor Haus] Nuovo utente: ${args.name}`, html);
      if (ok) {
        sentCount++;
        await c.runMutation("email:logEmail", { to: email, subject: `Nuovo utente: ${args.name}`, body: html, type: "registration" });
      }
    }
    return { sent: sentCount > 0, count: sentCount };
  },
});

export const sendWelcomeEmail = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const c = ctx as unknown as InternalCtx;
    const body = `<p>Ciao ${args.name},</p>
<p>benvenuto su Doctor Haus. Il tuo account è stato creato con successo.</p>
<p>Ora puoi accedere per gestire le tue preferenze e richiedere preventivi personalizzati.</p>`;

    const html = buildHtml({
      preheader: "Il tuo account è stato creato con successo.",
      title: "Benvenuto su Doctor Haus!",
      body,
      cta: { text: "Accedi al tuo account", url: "https://doctor-haus.com/accedi" },
    });

    const ok = await sendViaResend(args.email, "Benvenuto su Doctor Haus!", html);
    if (ok) {
      await c.runMutation("email:logEmail", { to: args.email, subject: "Benvenuto su Doctor Haus!", body: html, type: "welcome" });
    }
    return { sent: ok };
  },
});
