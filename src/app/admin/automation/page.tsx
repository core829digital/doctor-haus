"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { RefreshCw, Send, CheckCircle, Clock, Star } from "lucide-react";

const STATUS_BADGES: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "In attesa", color: "text-orange-400 bg-orange-500/10", icon: Clock },
  sent: { label: "Inviata", color: "text-blue-400 bg-blue-500/10", icon: Send },
  completed: { label: "Completata", color: "text-green-400 bg-green-500/10", icon: CheckCircle },
  skipped: { label: "Saltata", color: "text-white/20 bg-white/5", icon: RefreshCw },
};

export default function AdminAutomation() {
  const [enabled, setEnabled] = useState(false);
  const stats = useQuery(api.reviewRequests.getReviewStats);
  const reviews = useQuery(api.reviewRequests.getReviews);
  const leads = useQuery(api.analytics.getLeads, { status: "evaso", limit: 100 });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold">Automazione</h1>
        <p className="text-white/40 text-sm mt-1">Gestione recensioni e controllo qualità</p>
      </div>

      {/* Status toggle */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-white">Richiesta recensioni automatica</h2>
            <p className="text-xs text-white/40 mt-1">Invia automaticamente una richiesta di recensione ai clienti dopo 7 giorni dall&apos;evasione</p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-green-500" : "bg-white/10"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{leads?.length ?? "—"}</p>
          <p className="text-xs text-white/40 mt-1">Lead evasi</p>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{stats?.completed ?? "—"}</p>
          <p className="text-xs text-white/40 mt-1">Recensioni ricevute</p>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{stats?.pending ?? "—"}</p>
          <p className="text-xs text-white/40 mt-1">In attesa</p>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
            <Star size={16} /> {stats?.avgRating != null ? stats.avgRating.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-white/40 mt-1">Media rating</p>
        </div>
      </div>

      {/* Review list */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
        <h2 className="text-sm font-medium text-white/60 mb-4">Storico recensioni</h2>
        {reviews === undefined ? (
          <div className="text-center py-12 text-white/20 text-sm">Caricamento...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-white/20 text-sm">
            Nessuna recensione ancora. Il sistema invierà richieste automatiche ogni 24 ore quando attivato.
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => {
              const badge = STATUS_BADGES[review.status] ?? STATUS_BADGES.pending;
              const Icon = badge.icon;
              return (
                <div key={review._id} className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-sm text-white">{review.customerName}</p>
                    <p className="text-xs text-white/40">{review.customerEmail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {review.rating != null && (
                      <span className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star size={12} /> {review.rating}/5
                      </span>
                    )}
                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${badge.color}`}>
                      <Icon size={12} />
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
