"use client";

import { useState, FormEvent } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { UserPlus, ArrowRight, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { setStoredSession } from "@/lib/customer-auth";

export default function RegisterPage() {
  const t = useTranslations("common");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Compila tutti i campi");
      return;
    }
    if (password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      return;
    }

    setLoading(true);
    try {
      const { api } = await import("convex/_generated/api");
      const { fetchMutation } = await import("convex/nextjs");
      const result = await fetchMutation(api.customerAuth.register, {
        email: email.trim(),
        password,
        name: name.trim(),
        preferredLanguage: "it",
      });
      setStoredSession(result.token, result.user);
      const { trackRegistration } = await import("@/lib/analytics");
      trackRegistration(document.documentElement.lang || "it", name.trim());
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <UserPlus size={28} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-text">
            Crea il tuo account
          </h1>
          <p className="mt-2 text-text-muted text-sm">
            Registrati per monitorare i tuoi preventivi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reg-name" className="sr-only">Nome e cognome</label>
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome e cognome"
              disabled={loading}
              className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="sr-only">Email</label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="la tua@email.com"
              disabled={loading}
              className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="sr-only">Password</label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 8 caratteri)"
                disabled={loading}
                className="w-full rounded-xl border border-line bg-background px-4 py-3 pr-10 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Registrazione in corso...
              </>
            ) : (
              <>
                Crea account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Hai già un account?{" "}
          <Link href="/accedi" className="text-green-600 hover:underline font-medium">
            Accedi
          </Link>
        </p>
      </div>
    </main>
  );
}
