"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { FileText, Download, Loader2 } from "lucide-react";

export default function AdminReports() {
  const { token } = useAdminAuth();
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState("leads");
  const [periodDays, setPeriodDays] = useState(30);
  const leads = useQuery(api.analytics.getLeads, { status: undefined, limit: 500 });
  const statsArgs = useMemo(
    () => ({
      startDate: Date.now() - periodDays * 24 * 60 * 60 * 1000,
      endDate: Date.now(),
    }),
    [periodDays],
  );
  const stats = useQuery(api.analytics.getStats, statsArgs);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: reportType,
          periodDays,
          adminToken: token,
          data: {
            leads: reportType === "leads" ? (leads ?? []) : undefined,
            stats,
          },
        }),
      });

      if (!res.ok) throw new Error("Errore generazione report");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-doctor-haus-${reportType}-${new Date().toISOString().split("T")[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Report error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold">Report</h1>
        <p className="text-white/40 text-sm mt-1">Genera report PDF personalizzati</p>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm text-white/60 mb-2">Tipo di report</label>
          <div className="flex gap-2">
            {[
              { key: "leads", label: "Lead" },
              { key: "analytics", label: "Analytics" },
              { key: "complete", label: "Completo" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setReportType(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  reportType === t.key
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/5 text-white/40 border border-white/10 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Periodo (giorni)</label>
          <div className="flex gap-2">
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setPeriodDays(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  periodDays === d
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white/5 text-white/40 border border-white/10 hover:text-white"
                }`}
              >
                {d === 7 ? "7 giorni" : d === 14 ? "14 giorni" : d === 30 ? "30 giorni" : "90 giorni"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generatePDF}
          disabled={generating}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg px-6 py-3 text-sm font-medium transition-all flex items-center gap-2"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {generating ? "Generazione in corso..." : "Scarica PDF"}
        </button>
      </div>

      {/* Preview */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
        <h2 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
          <FileText size={16} /> Anteprima dati
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-white/40">Visualizzazioni</span>
            <span className="text-white font-medium">{stats?.pageviews ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-white/40">Sessioni uniche</span>
            <span className="text-white font-medium">{stats?.uniqueSessions ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5">
            <span className="text-white/40">Lead</span>
            <span className="text-white font-medium">{stats?.leads ?? "—"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-white/40">Lead convertiti</span>
            <span className="text-white font-medium">{stats?.leadsByStatus.evaso ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
