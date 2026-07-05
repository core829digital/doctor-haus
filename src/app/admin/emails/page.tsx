"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { Send, Loader2, Mail, Check, X, AlertCircle, History } from "lucide-react";

export default function AdminEmails() {
  const { token } = useAdminAuth();
  const leads = useQuery(api.analytics.getLeads, { status: undefined, limit: 50 });
  const emailLogs = useQuery(api.email.getEmailLogs, { limit: 50 });
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"compose" | "logs">("compose");

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

  const TYPE_LABELS: Record<string, string> = {
    new_lead: "Nuovo lead",
    contact_form: "Richiesta contatto",
    registration: "Nuovo utente",
    welcome: "Benvenuto",
    quote_reply: "Risposta a lead",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Email</h1>
          <p className="text-white/40 text-sm mt-1">Invia email ai clienti e consulta lo storico</p>
        </div>
        <div className="flex items-center gap-1 bg-[#1A1A1A] border border-white/5 rounded-lg p-1">
          <button
            onClick={() => setTab("compose")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "compose" ? "bg-green-500/10 text-green-400" : "text-white/40 hover:text-white"}`}
          >
            <Mail size={14} className="inline mr-1" />Scrivi
          </button>
          <button
            onClick={() => setTab("logs")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${tab === "logs" ? "bg-green-500/10 text-green-400" : "text-white/40 hover:text-white"}`}
          >
            <History size={14} className="inline mr-1" />Storico
          </button>
        </div>
      </div>

      {tab === "compose" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                Seleziona un lead per scrivere un&apos;email
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white/60 mb-4">Storico email inviate</h2>
          {emailLogs === undefined ? (
            <div className="text-center py-12 text-white/20 text-sm">Caricamento...</div>
          ) : emailLogs.length === 0 ? (
            <div className="text-center py-12 text-white/20 text-sm">Nessuna email inviata</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="text-left px-4 py-3 font-medium">Tipo</th>
                    <th className="text-left px-4 py-3 font-medium">Destinatario</th>
                    <th className="text-left px-4 py-3 font-medium">Oggetto</th>
                    <th className="text-left px-4 py-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {emailLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                          {TYPE_LABELS[log.type] || log.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60">{log.to}</td>
                      <td className="px-4 py-3 text-white/80 max-w-[200px] truncate">{log.subject}</td>
                      <td className="px-4 py-3 text-white/40 text-xs">
                        {new Date(log.sentAt).toLocaleDateString("it-IT")} {new Date(log.sentAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
