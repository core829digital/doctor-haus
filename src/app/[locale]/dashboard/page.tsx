"use client";

import { useEffect, useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { FileText, Clock, CheckCircle2, AlertCircle, LogOut, MessageSquare, Package, User, ArrowRight } from "lucide-react";
import { useCustomerAuth, clearStoredSession } from "@/lib/customer-auth";

type Lead = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: "nuovo" | "in_lavorazione" | "evaso";
  adminNote?: string;
  createdAt: number;
  productName: string;
  layoutName: string | null;
  selectedOptions: { categoryLabel: string; choiceLabel: string }[];
};

const statusMap: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  nuovo: { label: "In attesa", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
  in_lavorazione: { label: "In lavorazione", color: "text-blue-600 bg-blue-50 border-blue-200", icon: AlertCircle },
  evaso: { label: "Completato", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useCustomerAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.push("/accedi");
      return;
    }
    (async () => {
      try {
        const { api } = await import("convex/_generated/api");
        const { fetchQuery } = await import("convex/nextjs");
        const data = await fetchQuery(api.analytics.getLeadsByEmail, { email: user.email });
        setLeads(data ?? []);
      } catch {
        setLeads([]);
      } finally {
        setLoadingLeads(false);
      }
    })();
  }, [authLoading, isAuthenticated, user, router]);

  const handleLogout = async () => {
    try {
      const { api } = await import("convex/_generated/api");
      const { fetchMutation } = await import("convex/nextjs");
      const { getStoredToken } = await import("@/lib/customer-auth");
      const token = getStoredToken();
      if (token) {
        await fetchMutation(api.customerAuth.logout, { token });
      }
    } catch {
    }
    clearStoredSession();
    router.push("/accedi");
  };

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          Caricamento...
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) return null;

  const isLoading = loadingLeads;

  return (
    <main className="min-h-screen py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-display font-semibold text-text">
              I tuoi preventivi
            </h1>
            <p className="mt-1 text-sm text-text-muted">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/configuratore"
              className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              Nuovo preventivo <ArrowRight size={14} />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors"
            >
              <LogOut size={16} />
              Esci
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto text-text-muted/30 mb-4" />
            <p className="text-text-muted mb-6">Nessun preventivo trovato.</p>
            <Link
              href="/configuratore"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-700"
            >
              Configura la tua Apple Cabin <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {leads.map((lead) => {
              const st = statusMap[lead.status] ?? statusMap.nuovo;
              const StatusIcon = st.icon;
              return (
                <div
                  key={lead._id}
                  className="rounded-xl border border-line bg-background p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-text">{lead.productName}</span>
                        {lead.layoutName && (
                          <span className="text-sm text-text-muted">— {lead.layoutName}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                        <span className="flex items-center gap-1">
                          <User size={14} />
                          {lead.customerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package size={14} />
                          {new Date(lead.createdAt).toLocaleDateString("it-IT")}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${st.color}`}>
                      <StatusIcon size={14} />
                      {st.label}
                    </span>
                  </div>

                  {lead.selectedOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {lead.selectedOptions.map((opt, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                          {opt.categoryLabel}: {opt.choiceLabel}
                        </span>
                      ))}
                    </div>
                  )}

                  {lead.adminNote && (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <div className="flex items-start gap-3">
                        <MessageSquare size={16} className="text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-blue-700 mb-1">Risposta del team</p>
                          <p className="text-sm text-blue-900">{lead.adminNote}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
