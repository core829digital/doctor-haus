"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { Search, User, Mail, Calendar, Clock } from "lucide-react";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const users = useQuery(api.customerAuth.listAll, { limit: 200 });

  const filtered = users
    ?.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Utenti registrati</h1>
        <p className="text-white/40 text-sm mt-1">{users ? `${users.length} utenti totali` : "Caricamento..."}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per nome o email..."
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50"
        />
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
                  <th className="text-left px-5 py-4 font-medium">Registrazione</th>
                  <th className="text-left px-5 py-4 font-medium">Ultimo accesso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/60">{u.email}</td>
                    <td className="px-5 py-4 text-white/40 text-xs">
                      {new Date(u.createdAt).toLocaleDateString("it-IT")} {new Date(u.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-5 py-4 text-white/40 text-xs">
                      {u.lastLoginAt ? (
                        <>{new Date(u.lastLoginAt).toLocaleDateString("it-IT")} {new Date(u.lastLoginAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-white/20">
            <User size={32} className="mx-auto mb-3 opacity-50" />
            <p>{users === undefined ? "Caricamento..." : "Nessun utente trovato"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
