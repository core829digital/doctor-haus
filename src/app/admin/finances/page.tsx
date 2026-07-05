"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

type Period = "daily" | "weekly" | "monthly" | "quarterly" | "3days";

const PERIODS: { key: Period; label: string }[] = [
  { key: "daily", label: "Giornaliero" },
  { key: "3days", label: "Ogni 3 giorni" },
  { key: "weekly", label: "Settimanale" },
  { key: "monthly", label: "Mensile" },
  { key: "quarterly", label: "Trimestrale" },
];

export default function AdminFinances() {
  const [period, setPeriod] = useState<Period>("monthly");
  const leads = useQuery(api.analytics.getLeads, { status: undefined, limit: 500 });

  const periodTotals = aggregateByPeriod(leads ?? [], period);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Finanze</h1>
        <p className="text-white/40 text-sm mt-1">Andamento lead e conversioni</p>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              period === p.key
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-[#1A1A1A] text-white/40 border border-white/10 hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Lead totali</p>
          <p className="text-2xl font-bold text-white">{leads?.length ?? "—"}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Nuovi</p>
          <p className="text-2xl font-bold text-green-400">{leads?.filter((l) => l.status === "nuovo").length ?? "—"}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">In lavorazione</p>
          <p className="text-2xl font-bold text-orange-400">{leads?.filter((l) => l.status === "in_lavorazione").length ?? "—"}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Evaso</p>
          <p className="text-2xl font-bold text-blue-400">{leads?.filter((l) => l.status === "evaso").length ?? "—"}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-medium text-white/60 mb-4">Andamento lead</h2>
        {periodTotals.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={periodTotals}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              />
              <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-white/20 text-sm">
            {leads === undefined ? "Caricamento..." : "Nessun dato"}
          </div>
        )}
      </div>
    </div>
  );
}

type LeadSummary = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerMessage?: string;
  status: "nuovo" | "in_lavorazione" | "evaso";
  createdAt: number;
  preferredLanguage: string;
};

function aggregateByPeriod(leads: LeadSummary[], period: Period) {
  if (leads.length === 0) return [];

  const groups: Record<string, number> = {};

  for (const lead of leads) {
    const d = new Date(lead.createdAt);
    let key: string;

    switch (period) {
      case "daily":
        key = d.toISOString().split("T")[0];
        break;
      case "3days": {
        const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
        const periodNum = Math.floor(dayOfYear / 3);
        key = `P${periodNum}`;
        break;
      }
      case "weekly": {
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() - d.getDay() + 1);
        key = startOfWeek.toISOString().split("T")[0];
        break;
      }
      case "monthly":
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        break;
      case "quarterly": {
        const q = Math.floor(d.getMonth() / 3) + 1;
        key = `${d.getFullYear()}-Q${q}`;
        break;
      }
    }

    groups[key] = (groups[key] || 0) + 1;
  }

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-24)
    .map(([period, count]) => ({ period, count }));
}
