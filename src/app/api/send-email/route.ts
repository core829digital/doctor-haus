import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin/api-auth";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, leadId, adminToken } = await req.json();

    if (adminToken !== "internal" && (!adminToken || !(await verifyAdminToken(adminToken)))) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });
    }

    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY non configurata" }, { status: 500 });
    }

    const textBody = body.replace(/<[^>]*>/g, "");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Doctor Haus <noreply@doctor-haus.com>",
        to: [to],
        subject,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Errore nell'invio dell'email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
