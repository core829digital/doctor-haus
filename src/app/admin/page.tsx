"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const ACTIVITY_LABELS: Record<string, string> = {
  pageview: "Pagina visitata",
  click: "Click",
  form_submit: "Form inviato",
  contact_form_submit: "Richiesta contatto",
  registration: "Registrazione",
  login: "Accesso",
  configurator_action: "Az. configuratore",
};

const ACTIVITY_COLORS: Record<string, string> = {
  pageview: "text-blue-400",
  click: "text-purple-400",
  form_submit: "text-orange-400",
  contact_form_submit: "text-green-400",
  registration: "text-emerald-400",
  login: "text-cyan-400",
  configurator_action: "text-pink-400",
};

const DEVICE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#6b7280"];

function MetricCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || "text-white"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-white/20 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [days] = useState(30);
  const [now] = useState(() => Date.now());
  const startDate = useMemo(() => now - days * 24 * 60 * 60 * 1000, [now, days]);

  const stats = useQuery(api.analytics.getStats, { startDate, endDate: now });
  const dailyViews = useQuery(api.analytics.getDailyPageviews, { days });
  const topPages = useQuery(api.analytics.getTopPages, { startDate, endDate: now, limit: 5 });
  const recentLeads = useQuery(api.analytics.getLeads, { limit: 5 });
  const registrations = useQuery(api.analytics.getRegistrationCount, { startDate, endDate: now });
  const totalRegistrations = useQuery(api.analytics.getTotalRegistrations);
  const recentActivity = useQuery(api.analytics.getRecentActivity, { limit: 10 });
  const deviceBreakdown = useQuery(api.analytics.getDeviceBreakdown, { startDate, endDate: now });
  const funnel = useQuery(api.analytics.getConversionFunnel, { startDate, endDate: now });
  const contactSubmissions = useQuery(api.analytics.getContactFormSubmissions, { limit: 5 });

  const activityItems = useMemo(() => {
    if (!recentActivity) return [];
    return recentActivity.map((a) => ({
      ...a,
      label: ACTIVITY_LABELS[a.type] || a.type,
      color: ACTIVITY_COLORS[a.type] || "text-white/40",
    }));
  }, [recentActivity]);

  const loading = stats === undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">Panoramica degli ultimi {days} giorni</p>
        </div>
        <Link href="/admin/leads" className="text-sm text-green-400 hover:text-green-300 transition-colors">
          Vedi tutti i lead →
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Visualizzazioni" value={stats?.pageviews ?? "—"} color="text-green-400" />
        <MetricCard label="Sessioni uniche" value={stats?.uniqueSessions ?? "—"} />
        <MetricCard label="Click" value={stats?.clicks ?? "—"} />
        <MetricCard
          label="Lead"
          value={stats?.leads ?? "—"}
          color="text-orange-400"
          sub={stats ? `${stats.leadsByStatus.nuovo} nuovi, ${stats.leadsByStatus.in_lavorazione} in lavorazione` : undefined}
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Registrazioni (periodo)" value={registrations ?? "—"} color="text-emerald-400" />
        <MetricCard label="Utenti totali" value={totalRegistrations ?? "—"} color="text-blue-400" />
        <MetricCard label="Form inviati" value={stats?.formSubmits ?? "—"} color="text-purple-400" />
        <MetricCard label="Contatti ricevuti" value={contactSubmissions?.length ?? "—"} color="text-cyan-400" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily pageviews */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Visualizzazioni giornaliere</h2>
          {dailyViews && dailyViews.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyViews}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
                <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} labelStyle={{ color: "rgba(255,255,255,0.6)" }} />
                <Area type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} fill="url(#colorViews)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-white/20 text-sm">
              {loading ? "Caricamento..." : "Nessun dato disponibile"}
            </div>
          )}
        </div>

        {/* Device breakdown */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Dispositivi</h2>
          {deviceBreakdown && deviceBreakdown.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={deviceBreakdown} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {deviceBreakdown.map((_, i) => (
                      <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {deviceBreakdown.map((d, i) => (
                  <div key={d.device} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                      <span className="text-white/60 capitalize">{d.device}</span>
                    </span>
                    <span className="text-white font-medium">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[180px] text-white/20 text-sm">
              {loading ? "Caricamento..." : "Nessun dato"}
            </div>
          )}
        </div>
      </div>

      {/* Conversion funnel + Top pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Imbuto di conversione</h2>
          {funnel ? (
            <div className="space-y-3">
              {funnel.steps.map((step, i) => {
                const prev = i > 0 ? funnel.steps[i - 1].count : step.count;
                const pct = prev > 0 ? Math.round((step.count / prev) * 100) : 0;
                return (
                  <div key={step.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white/60">{step.label}</span>
                      <span className="text-white font-medium">{step.count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: i === 0 ? "100%" : `${pct}%` }}
                      />
                    </div>
                    {i > 0 && (
                      <p className="text-xs text-white/20 mt-0.5">{pct}% rispetto allo step precedente</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-white/20 text-sm">
              {loading ? "Caricamento..." : "Nessun dato"}
            </div>
          )}
        </div>

        {/* Top pages */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Pagine più visitate</h2>
          {topPages && topPages.length > 0 ? (
            <div className="space-y-2">
              {topPages.map((p, i) => (
                <div key={p.page} className="flex items-center gap-3">
                  <span className="text-xs text-white/20 w-5">{i + 1}.</span>
                  <span className="flex-1 text-sm truncate capitalize">{p.page.replace(/-/g, " ")}</span>
                  <span className="text-sm font-medium text-green-400">{p.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-white/20 text-sm">
              {loading ? "Caricamento..." : "Nessun dato"}
            </div>
          )}
        </div>
      </div>

      {/* Recent leads + Contact form submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Lead recenti</h2>
          {recentLeads && recentLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/30 text-xs uppercase tracking-wider">
                    <th className="text-left pb-3 font-medium">Nome</th>
                    <th className="text-left pb-3 font-medium">Stato</th>
                    <th className="text-left pb-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white">{lead.customerName}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          lead.status === "nuovo" ? "bg-green-500/10 text-green-400" :
                          lead.status === "in_lavorazione" ? "bg-orange-500/10 text-orange-400" :
                          "bg-blue-500/10 text-blue-400"
                        }`}>
                          {lead.status === "nuovo" ? "Nuovo" : lead.status === "in_lavorazione" ? "In lav." : "Evaso"}
                        </span>
                      </td>
                      <td className="py-3 text-white/40 text-xs">{new Date(lead.createdAt).toLocaleDateString("it-IT")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-white/20 text-sm py-8 text-center">
              {loading ? "Caricamento..." : "Nessun lead"}
            </p>
          )}
        </div>

        {/* Contact form submissions */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Richiestre contatto</h2>
          {contactSubmissions && contactSubmissions.length > 0 ? (
            <div className="space-y-3">
              {contactSubmissions.map((s) => {
                let meta: Record<string, string> = {};
                try { if (s.metadata) meta = JSON.parse(s.metadata); } catch {}
                return (
                  <div key={s._id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{meta.name || "Anonimo"}</p>
                      <p className="text-xs text-white/40 truncate">{meta.email || ""}</p>
                      {meta.message && (
                        <p className="text-xs text-white/30 mt-1 truncate">{meta.message.substring(0, 80)}</p>
                      )}
                    </div>
                    <span className="text-xs text-white/20 shrink-0">{new Date(s.timestamp).toLocaleDateString("it-IT")}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white/20 text-sm py-8 text-center">
              {loading ? "Caricamento..." : "Nessuna richiesta contatto"}
            </p>
          )}
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-medium text-white/60 mb-4">Attività recenti</h2>
        {activityItems.length > 0 ? (
          <div className="space-y-1">
            {activityItems.map((a) => (
              <div key={a._id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                <span className={`text-xs font-medium w-28 shrink-0 ${a.color}`}>{a.label}</span>
                <span className="text-sm text-white/60 flex-1 truncate capitalize">{a.page ? a.page.replace(/-/g, " ") : "—"}</span>
                <span className="text-xs text-white/20 shrink-0">
                  {new Date(a.timestamp).toLocaleString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/20 text-sm py-8 text-center">
            {loading ? "Caricamento..." : "Nessuna attività"}
          </p>
        )}
      </div>
    </div>
  );
}
