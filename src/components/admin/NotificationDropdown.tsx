"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react";
import Link from "next/link";

const TYPE_ICONS: Record<string, string> = {
  new_lead: "bg-green-500/10 text-green-400",
  contact_form: "bg-blue-500/10 text-blue-400",
  new_user: "bg-purple-500/10 text-purple-400",
  lead_update: "bg-orange-500/10 text-orange-400",
};

const TYPE_LABELS: Record<string, string> = {
  new_lead: "Nuovo lead",
  contact_form: "Contatto",
  new_user: "Nuovo utente",
  lead_update: "Lead aggiornato",
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = useQuery(api.notifications.list, { limit: 10 });
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const markRead = useMutation(api.notifications.markRead);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items = notifications ?? [];
  const unread = unreadCount ?? 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-white/30 hover:text-white transition-colors"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <h3 className="text-sm font-medium text-white">Notifiche</h3>
            {unread > 0 && (
              <button
                onClick={async () => { await markAllRead(); }}
                className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
              >
                <CheckCheck size={12} /> Leggi tutte
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8 text-white/20 text-sm">
                {notifications === undefined ? "Caricamento..." : "Nessuna notifica"}
              </div>
            ) : (
              items.map((n) => (
                <Link
                  key={n._id}
                  href={n.link ?? "#"}
                  onClick={() => {
                    if (!n.read) markRead({ id: n._id });
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] ${
                    !n.read ? "bg-green-500/[0.03] border-l-2 border-green-500" : "border-l-2 border-transparent"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TYPE_ICONS[n.type] || "bg-white/5 text-white/40"}`}>
                    <span className="text-[10px] font-bold uppercase">{TYPE_LABELS[n.type]?.charAt(0) || "?"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-tight truncate">{n.title}</p>
                    {n.description && (
                      <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{n.description}</p>
                    )}
                    <p className="text-[10px] text-white/20 mt-1">
                      {new Date(n.createdAt).toLocaleString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />}
                </Link>
              ))
            )}
          </div>

          <Link
            href="/admin/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 px-4 py-3 text-xs text-white/40 hover:text-white border-t border-white/5 transition-colors"
          >
            Vedi tutte <ExternalLink size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
