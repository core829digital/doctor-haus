import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { verifyAdminToken } from "@/lib/admin/api-auth";

export async function POST(req: NextRequest) {
  try {
    const { type, periodDays, data, adminToken } = await req.json();

    if (!adminToken || !(await verifyAdminToken(adminToken))) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // ── Header ──
    doc.setFontSize(22);
    doc.setTextColor(28, 28, 26);
    doc.text("Doctor Haus", 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(92, 91, 86);
    doc.text("Report " + new Date().toLocaleDateString("it-IT"), 20, 33);

    doc.setDrawColor(107, 143, 78);
    doc.setLineWidth(0.5);
    doc.line(20, 38, pageWidth - 20, 38);

    let y = 50;

    // ── Summary section ──
    doc.setFontSize(14);
    doc.setTextColor(28, 28, 26);
    doc.text("Riepilogo", 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(92, 91, 86);

    if (data?.stats) {
      const rows: [string, string][] = [
        ["Visualizzazioni", String(data.stats.pageviews ?? "—")],
        ["Sessioni uniche", String(data.stats.uniqueSessions ?? "—")],
        ["Click", String(data.stats.clicks ?? "—")],
        ["Lead totali", String(data.stats.leads ?? "—")],
        ["Lead nuovi", String(data.stats.leadsByStatus?.nuovo ?? "—")],
        ["Lead in lavorazione", String(data.stats.leadsByStatus?.in_lavorazione ?? "—")],
        ["Lead evasi", String(data.stats.leadsByStatus?.evaso ?? "—")],
        ["Periodo", `${periodDays} giorni`],
      ];

      for (const [label, value] of rows) {
        doc.text(`${label}:  ${value}`, 20, y);
        y += 7;
      }
    }

    // ── Leads table ──
    if (data?.leads && data.leads.length > 0) {
      y += 10;
      doc.setFontSize(14);
      doc.setTextColor(28, 28, 26);
      doc.text("Lead", 20, y);
      y += 8;

      const tableData = data.leads.slice(0, 50).map((l: any) => [
        l.customerName,
        l.customerEmail,
        l.customerPhone,
        new Date(l.createdAt).toLocaleDateString("it-IT"),
        l.status === "nuovo" ? "Nuovo" : l.status === "in_lavorazione" ? "In lavorazione" : "Evaso",
      ]);

      (doc as any).autoTable({
        startY: y,
        head: [["Nome", "Email", "Telefono", "Data", "Stato"]],
        body: tableData,
        theme: "plain",
        styles: { fontSize: 8, textColor: [28, 28, 26] },
        headStyles: {
          fontSize: 8,
          textColor: [92, 91, 86],
          fontStyle: "bold",
          fillColor: [241, 245, 238],
        },
        alternateRowStyles: { fillColor: [249, 250, 247] },
        margin: { left: 20, right: 20 },
      });
    }

    // ── Footer ──
    const pageCount: number = (doc.internal as any).pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text(
        `Doctor Haus — Report generato il ${new Date().toLocaleString("it-IT")} — Pagina ${i}/${pageCount}`,
        20,
        doc.internal.pageSize.getHeight() - 15
      );
    }

    const buffer = Buffer.from(doc.output("arraybuffer"));
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-doctor-haus-${new Date().toISOString().split("T")[0]}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Report error:", err);
    return NextResponse.json({ error: "Errore generazione report" }, { status: 500 });
  }
}
