"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { FileText, Download, Loader2, BarChart3, Users, MousePointer, Mail, Activity, Smartphone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DEVICE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#6b7280"];

export default function AdminReports() {
  const { token } = useAdminAuth();
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState("leads");
  const [periodDays, setPeriodDays] = useState(30);
  const leads = useQuery(api.analytics.getLeads, { status: undefined, limit: 500 });
  const statsArgs = useMemo(
    () => ({ startDate: Date.now() - periodDays * 24 * 60 * 60 * 1000, endDate: Date.now() }),
    [periodDays],
  );
  const stats = useQuery(api.analytics.getStats, statsArgs);
  const dailyViews = useQuery(api.analytics.getDailyPageviews, { days: periodDays });
  const deviceBreakdown = useQuery(api.analytics.getDeviceBreakdown, statsArgs);
  const funnel = useQuery(api.analytics.getConversionFunnel, statsArgs);
  const topPages = useQuery(api.analytics.getTopPages, { ...statsArgs, limit: 10 });
  const registrations = useQuery(api.analytics.getRegistrationCount, statsArgs);
  const totalRegistrations = useQuery(api.analytics.getTotalRegistrations);

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
            dailyViews,
            deviceBreakdown,
            funnel,
            topPages,
            registrations,
            totalRegistrations,
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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold">Report</h1>
        <p className="text-white/40 text-sm mt-1">Genera report PDF e visualizza dati analytics</p>
      </div>

      {/* Controls */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-end gap-6">
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
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-all flex items-center gap-2"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {generating ? "Generazione..." : "Scarica PDF"}
          </button>
        </div>
      </div>

      {/* Preview analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary cards */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
            <BarChart3 size={16} /> Riepilogo
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/40 text-sm">Visualizzazioni</span>
              <span className="text-white font-medium">{stats?.pageviews ?? "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/40 text-sm">Sessioni uniche</span>
              <span className="text-white font-medium">{stats?.uniqueSessions ?? "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/40 text-sm">Click</span>
              <span className="text-white font-medium">{stats?.clicks ?? "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/40 text-sm">Lead</span>
              <span className="text-white font-medium">{stats?.leads ?? "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/40 text-sm">Registrazioni</span>
              <span className="text-white font-medium">{registrations ?? "—"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-white/40 text-sm">Utenti totali</span>
              <span className="text-white font-medium">{totalRegistrations ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* Device breakdown */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
            <Smartphone size={16} /> Dispositivi
          </h2>
          {deviceBreakdown && deviceBreakdown.length > 0 ? (
            <div className="space-y-3">
              {deviceBreakdown.map((d, i) => {
                const total = deviceBreakdown.reduce((s, x) => s + x.count, 0);
                const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                return (
                  <div key={d.device}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i] }} />
                        <span className="text-white/60 capitalize">{d.device}</span>
                      </span>
                      <span className="text-white font-medium">{d.count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: DEVICE_COLORS[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-white/20 text-sm">
              {stats === undefined ? "Caricamento..." : "Nessun dato"}
            </div>
          )}
        </div>
      </div>

      {/* Chart preview */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
          <Activity size={16} /> Trend visualizzazioni
        </h2>
        {dailyViews && dailyViews.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="count" fill="#22c55e" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[220px] text-white/20 text-sm">
            {stats === undefined ? "Caricamento..." : "Nessun dato"}
          </div>
        )}
      </div>

      {/* Funnel */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
          <Users size={16} /> Imbuto di conversione
        </h2>
        {funnel ? (
          <div className="space-y-3">
            {funnel.steps.map((step, i) => {
              const prev = i > 0 ? funnel.steps[i - 1].count : step.count;
              const pct = prev > 0 ? Math.round((step.count / prev) * 100) : 0;
              return (
                <div key={step.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-white/60">{step.label}</span>
                    <span className="text-white font-medium">{step.count}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: i === 0 ? "100%" : `${pct}%` }} />
                  </div>
                  {i > 0 && <p className="text-xs text-white/20 mt-0.5">{pct}% vs step prec.</p>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-white/20 text-sm">
            {stats === undefined ? "Caricamento..." : "Nessun dato"}
          </div>
        )}
      </div>
    </div>
  );
}
