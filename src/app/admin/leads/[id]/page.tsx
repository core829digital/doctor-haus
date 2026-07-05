"use client";

import { useState, useEffect, useTransition } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MessageSquare, Save } from "lucide-react";

type SelectedOption = {
  categoryLabel: string;
  choiceLabel: string;
};

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

export default function LeadDetailPage() {
  const params = useParams();
  const leadId = params.id as Id<"quoteRequests">;
  const lead = useQuery(api.analytics.getLeadDetail, { leadId });
  const updateStatus = useMutation(api.analytics.updateLeadStatus);
  const updateNote = useMutation(api.analytics.updateLeadAdminNote);
  const [note, setNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (lead) startTransition(() => setNote(lead.adminNote ?? ""));
  }, [lead, startTransition]);

  const saveNote = async () => {
    await updateNote({ leadId: lead!._id, adminNote: note });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  if (!lead) {
    return (
      <div className="flex items-center justify-center py-20 text-white/20">
        {lead === undefined ? "Caricamento..." : "Lead non trovato"}
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/leads" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
        <ArrowLeft size={14} /> Torna ai lead
      </Link>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{lead.customerName}</h1>
            <p className="text-white/40 text-sm mt-1">{lead.productName}</p>
          </div>
          <select
            value={lead.status}
            onChange={(e) => updateStatus({ leadId: lead._id, status: e.target.value as "nuovo" | "in_lavorazione" | "evaso" })}
            className={`text-sm px-3 py-1.5 rounded-full border-0 appearance-none cursor-pointer ${STATUS_COLORS[lead.status]}`}
          >
            <option value="nuovo">Nuovo</option>
            <option value="in_lavorazione">In lavorazione</option>
            <option value="evaso">Evaso</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
            <Mail size={16} className="text-white/20" />
            <div>
              <p className="text-xs text-white/30">Email</p>
              <p className="text-sm text-white">{lead.customerEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
            <Phone size={16} className="text-white/20" />
            <div>
              <p className="text-xs text-white/30">Telefono</p>
              <p className="text-sm text-white">{lead.customerPhone}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/30 mb-2">Data richiesta</p>
          <p className="text-sm text-white">{new Date(lead.createdAt).toLocaleString("it-IT")}</p>
        </div>

        {lead.layoutName && (
          <div>
            <p className="text-xs text-white/30 mb-2">Layout selezionato</p>
            <p className="text-sm text-white">{lead.layoutName}</p>
          </div>
        )}

        {lead.customerMessage && (
          <div>
            <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
              <MessageSquare size={12} /> Messaggio del cliente
            </p>
            <p className="text-sm text-white/80 bg-white/5 rounded-lg p-4 leading-relaxed">{lead.customerMessage}</p>
          </div>
        )}

        {lead.selectedOptions && lead.selectedOptions.length > 0 && (
          <div>
            <p className="text-xs text-white/30 mb-2">Opzioni selezionate</p>
            <div className="space-y-1">
              {lead.selectedOptions.map((opt: SelectedOption, i: number) => (
                <div key={i} className="text-sm text-white/60">
                  <span className="text-white/40">{opt.categoryLabel}:</span> {opt.choiceLabel}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-white/30 mb-2">Risposta al cliente</p>
          <textarea
            value={note}
            onChange={(e) => { setNote(e.target.value); setNoteSaved(false); }}
            placeholder="Scrivi una risposta per il cliente..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 resize-none"
          />
          <button
            onClick={saveNote}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors"
          >
            <Save size={14} />
            {noteSaved ? "Salvato!" : "Salva risposta"}
          </button>
        </div>
      </div>
    </div>
  );
}
