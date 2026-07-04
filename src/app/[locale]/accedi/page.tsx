"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter as useLocaleRouter, Link } from "@/i18n/navigation";
import { Mail, ArrowRight, AlertCircle, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { setStoredSession } from "@/lib/customer-auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const t = useTranslations("common");
  const localeRouter = useLocaleRouter();
  const nativeRouter = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password" | "loading">("email");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"admin" | "customer" | null>(null);
  const [userName, setUserName] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const checkEmail = async () => {
    setError("");
    if (!email.trim()) { setError("Inserisci la tua email"); return; }
    setStep("loading");
    try {
      const { api } = await import("convex/_generated/api");
      const { fetchQuery } = await import("convex/nextjs");
      const result = await fetchQuery(api.adminAuth.checkUserType, { email: email.trim() });
      if (!result) {
        setError("Nessun account trovato con questa email.");
        setStep("email");
        return;
      }
      setUserType(result.type);
      setUserName(result.name);
      setHasPassword(result.hasPassword ?? false);

      if (result.type === "admin") {
        setStep("password");
      } else if (result.type === "customer" && result.hasPassword) {
        setStep("password");
      } else if (result.type === "customer" && !result.hasPassword) {
        setStep("loading");
        const { api: api2 } = await import("convex/_generated/api");
        const { fetchMutation } = await import("convex/nextjs");
        const loginResult = await fetchMutation(api2.customerAuth.loginWithoutPassword, { email: email.trim() });
        setStoredSession(loginResult.token, loginResult.user);
        localeRouter.push("/dashboard");
      }
    } catch {
      setError("Errore di connessione. Riprova.");
      setStep("email");
    }
  };

  const loginWithPassword = async () => {
    setError("");
    if (!password) { setError("Inserisci la password"); return; }
    setStep("loading");
    try {
      const { api } = await import("convex/_generated/api");
      const { fetchMutation } = await import("convex/nextjs");
      if (userType === "admin") {
        const result = await fetchMutation(api.adminAuth.login, { email: email.trim(), password });
        localStorage.setItem("admin_session_token", result.token);
        nativeRouter.push("/admin");
      } else {
        const result = await fetchMutation(api.customerAuth.login, { email: email.trim(), password });
        setStoredSession(result.token, result.user);
        localeRouter.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore di autenticazione");
      setStep("password");
    }
  };

  const handleBack = () => { setStep("email"); setPassword(""); setError(""); };

  const isAdmin = userType === "admin";

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            {step === "password" && isAdmin ? <Lock size={28} className="text-green-600" />
              : step === "password" ? <User size={28} className="text-green-600" />
              : <Mail size={28} className="text-green-600" />}
          </div>
          <h1 className="text-3xl font-display font-semibold text-text">
            {step === "password" && isAdmin ? "Benvenuto, " + userName.split(" ")[0]
              : step === "password" ? "Bentornato, " + userName.split(" ")[0]
              : t("accedi")}
          </h1>
          <p className="mt-2 text-text-muted text-sm">
            {step === "password" && isAdmin
              ? "Inserisci la password per accedere alla gestione"
              : step === "password"
              ? "Inserisci la password per accedere al tuo account"
              : "Inserisci la tua email per accedere"}
          </p>
        </div>

        {step === "email" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkEmail()}
                placeholder="la tua@email.com"
                className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={checkEmail}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-700"
            >
              Continua <ArrowRight size={16} />
            </button>

            <p className="text-center text-xs text-text-muted">
              Non hai ancora un account?{" "}
              <Link href="/registrati" className="text-green-600 hover:underline font-medium">Registrati</Link>
            </p>

            <p className="text-center text-xs text-text-muted">
              Oppure{" "}
              <Link href="/configuratore" className="text-green-600 hover:underline">configura la tua Apple Cabin</Link>
            </p>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loginWithPassword()}
                  placeholder="••••••••"
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
              onClick={loginWithPassword}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-700"
            >
              Accedi <ArrowRight size={16} />
            </button>

            <button
              onClick={handleBack}
              className="w-full text-center text-sm text-text-muted hover:text-text transition-colors"
            >
              ← Usa un&apos;altra email
            </button>
          </div>
        )}

        {step === "loading" && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          </div>
        )}
      </div>
    </main>
  );
}
