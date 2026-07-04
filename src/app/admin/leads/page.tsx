"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { Search, Filter, ExternalLink } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  nuovo: "Nuovo",
  in_lavorazione: "In lavorazione",
  evaso: "Evaso",
};

const STATUS_COLORS: Record<string, string> = {
  nuovo: "bg-green-500/10 text-green-400",
  in_lavorazione: "bg-orange-500/10 text-orange-400",
  evaso: "bg-blue-500/10 text-blue-400",
};

export default function AdminLeads() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");

  const leads = useQuery(api.analytics.getLeads, { status: statusFilter, limit: 200 });
  const updateStatus = useMutation(api.analytics.updateLeadStatus);

  const filtered = leads
    ?.filter((l) => !search || l.customerName.toLowerCase().includes(search.toLowerCase()) || l.customerEmail.toLowerCase().includes(search.toLowerCase()))
    ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Lead</h1>
        <p className="text-white/40 text-sm mt-1">Gestisci le richieste di preventivo</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca per nome o email..."
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50"
          />
        </div>
        <div className="flex gap-2">
          {[undefined, "nuovo", "in_lavorazione", "evaso"].map((s) => (
            <button
              key={s ?? "tutti"}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-[#1A1A1A] text-white/40 border border-white/10 hover:text-white"
              }`}
            >
              {s ? STATUS_LABELS[s] : "Tutti"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="text-left px-5 py-4 font-medium">Nome</th>
                  <th className="text-left px-5 py-4 font-medium">Email</th>
                  <th className="text-left px-5 py-4 font-medium">Telefono</th>
                  <th className="text-left px-5 py-4 font-medium">Data</th>
                  <th className="text-left px-5 py-4 font-medium">Stato</th>
                  <th className="text-left px-5 py-4 font-medium">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((lead) => (
                  <tr key={lead._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-white font-medium">{lead.customerName}</td>
                    <td className="px-5 py-4 text-white/60">{lead.customerEmail}</td>
                    <td className="px-5 py-4 text-white/40">{lead.customerPhone}</td>
                    <td className="px-5 py-4 text-white/40 text-xs">{new Date(lead.createdAt).toLocaleDateString("it-IT")} {new Date(lead.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus({ leadId: lead._id, status: e.target.value as any })}
                        className={`text-xs px-2 py-1 rounded-full border-0 appearance-none cursor-pointer ${STATUS_COLORS[lead.status]} bg-opacity-100`}
                      >
                        <option value="nuovo">Nuovo</option>
                        <option value="in_lavorazione">In lavorazione</option>
                        <option value="evaso">Evaso</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/leads/${lead._id}`}
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-white/20">
            <p>{leads === undefined ? "Caricamento..." : "Nessun lead trovato"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
