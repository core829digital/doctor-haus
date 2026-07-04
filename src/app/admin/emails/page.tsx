"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { Send, Loader2, Mail, Check, X, AlertCircle } from "lucide-react";

export default function AdminEmails() {
  const { token } = useAdminAuth();
  const leads = useQuery(api.analytics.getLeads, { status: undefined, limit: 50 });
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const lead = leads?.find((l) => l._id === selectedLead);

  const handleSend = async () => {
    if (!selectedLead || !subject.trim() || !body.trim()) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: lead?.customerEmail,
          subject,
          body,
          leadId: selectedLead,
          adminToken: token,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Errore nell'invio");
      }

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setSelectedLead(null);
        setSubject("");
        setBody("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'invio");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold">Email</h1>
        <p className="text-white/40 text-sm mt-1">Invia email ai clienti tramite Resend</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead list */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Seleziona destinatario</h2>
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {leads?.map((l) => (
              <button
                key={l._id}
                onClick={() => {
                  setSelectedLead(l._id);
                  setSubject(`R: Richiesta preventivo - ${l.customerName}`);
                  setBody(`Ciao ${l.customerName},\n\n`);
                  setSent(false);
                  setError("");
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedLead === l._id
                    ? "bg-green-500/10 text-green-400"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="font-medium">{l.customerName}</span>
                <span className="text-xs text-white/30 ml-2">{l.customerEmail}</span>
              </button>
            )) ?? (
              <p className="text-white/20 text-sm py-4 text-center">Caricamento...</p>
            )}
          </div>
        </div>

        {/* Compose */}
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          {lead ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-white/60 pb-4 border-b border-white/5">
                <Mail size={16} />
                <span>{lead.customerEmail}</span>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Oggetto</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-1.5">Messaggio</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-3">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {sent ? (
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 rounded-lg px-4 py-3">
                  <Check size={14} /> Email inviata con successo!
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={sending || !subject.trim() || !body.trim()}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-all flex items-center gap-2"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? "Invio in corso..." : "Invia email"}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-white/20 text-sm">
              Seleziona un lead per scrivere un'email
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
