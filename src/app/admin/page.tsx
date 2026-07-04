"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function MetricCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color ? `text-${color}` : "text-white"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-white/20 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [days] = useState(30);
  const { now, startDate } = useMemo(() => {
    const now = Date.now();
    return {
      now,
      startDate: now - days * 24 * 60 * 60 * 1000,
    };
  }, [days]);

  const stats = useQuery(api.analytics.getStats, { startDate, endDate: now });
  const dailyViews = useQuery(api.analytics.getDailyPageviews, { days });
  const topPages = useQuery(api.analytics.getTopPages, { startDate, endDate: now, limit: 5 });
  const recentLeads = useQuery(api.analytics.getLeads, { limit: 5 });

  return (
    <div className="space-y-6">
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
        <MetricCard label="Lead" value={stats?.leads ?? "—"} color="text-orange-400" sub={stats ? `${stats.leadsByStatus.nuovo} nuovi, ${stats.leadsByStatus.in_lavorazione} in lavorazione` : undefined} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily pageviews chart */}
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
                <Tooltip
                  contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                />
                <Area type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} fill="url(#colorViews)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-white/20 text-sm">
              {stats === undefined ? "Caricamento..." : "Nessun dato disponibile"}
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
                  <span className="flex-1 text-sm truncate">{p.page}</span>
                  <span className="text-sm font-medium text-green-400">{p.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-white/20 text-sm">
              {stats === undefined ? "Caricamento..." : "Nessun dato"}
            </div>
          )}
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-medium text-white/60 mb-4">Lead recenti</h2>
        {recentLeads && recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-xs uppercase tracking-wider">
                  <th className="text-left pb-3 font-medium">Nome</th>
                  <th className="text-left pb-3 font-medium">Email</th>
                  <th className="text-left pb-3 font-medium">Data</th>
                  <th className="text-left pb-3 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-white">{lead.customerName}</td>
                    <td className="py-3 text-white/60">{lead.customerEmail}</td>
                    <td className="py-3 text-white/40">{new Date(lead.createdAt).toLocaleDateString("it-IT")}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        lead.status === "nuovo" ? "bg-green-500/10 text-green-400" :
                        lead.status === "in_lavorazione" ? "bg-orange-500/10 text-orange-400" :
                        "bg-blue-500/10 text-blue-400"
                      }`}>
                        {lead.status === "nuovo" ? "Nuovo" : lead.status === "in_lavorazione" ? "In lavorazione" : "Evaso"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/20 text-sm py-8 text-center">
            {recentLeads === undefined ? "Caricamento..." : "Nessun lead"}
          </p>
        )}
      </div>
    </div>
  );
}
