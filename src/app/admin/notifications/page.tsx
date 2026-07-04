"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Check, CheckCheck, Bell, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

const TYPE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  new_lead: { label: "Nuovo lead", color: "text-green-400", bg: "bg-green-500/10" },
  contact_form: { label: "Contatto", color: "text-blue-400", bg: "bg-blue-500/10" },
  new_user: { label: "Nuovo utente", color: "text-purple-400", bg: "bg-purple-500/10" },
  lead_update: { label: "Lead aggiornato", color: "text-orange-400", bg: "bg-orange-500/10" },
};

export default function AdminNotifications() {
  const notifications = useQuery(api.notifications.list, { limit: 100 });
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const markRead = useMutation(api.notifications.markRead);

  const items = notifications ?? [];
  const unread = unreadCount ?? 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Notifiche</h1>
          <p className="text-white/40 text-sm mt-1">
            {items.length} notifiche{unread > 0 ? ` (${unread} non lette)` : ""}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={() => markAllRead()}
            className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            <CheckCheck size={16} /> Segna tutte come lette
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-12 text-center">
          <Bell size={32} className="mx-auto mb-3 text-white/10" />
          <p className="text-white/20 text-sm">
            {notifications === undefined ? "Caricamento..." : "Nessuna notifica"}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((n) => {
            const style = TYPE_STYLES[n.type] || { label: n.type, color: "text-white/40", bg: "bg-white/5" };
            return (
              <div
                key={n._id}
                className={`bg-[#1A1A1A] border border-white/5 rounded-xl transition-colors ${
                  !n.read ? "border-green-500/20" : ""
                }`}
              >
                <div className="flex items-start gap-4 p-5">
                  <div className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center shrink-0`}>
                    <span className="text-sm font-bold uppercase" style={{ color: style.color }}>
                      {style.label.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-white font-medium">{n.title}</p>
                        {n.description && (
                          <p className="text-sm text-white/50 mt-1">{n.description}</p>
                        )}
                        <p className="text-xs text-white/20 mt-2">
                          {new Date(n.createdAt).toLocaleString("it-IT", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {n.link && (
                          <Link
                            href={n.link}
                            className="p-2 rounded-lg text-white/20 hover:text-green-400 hover:bg-green-500/10 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                        {!n.read && (
                          <button
                            onClick={() => markRead({ id: n._id })}
                            className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-colors"
                            title="Segna come letta"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
