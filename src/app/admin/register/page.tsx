"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { Loader2, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminRegisterPage() {
  const router = useRouter();
  const register = useMutation(api.adminAuth.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password || !adminCode) {
      setError("Compila tutti i campi");
      return;
    }
    if (password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      return;
    }

    setLoading(true);
    try {
      await register({ adminCode: adminCode.trim(), email: email.trim(), password, name: name.trim() });
      setSuccess(`Account creato con successo! Reindirizzamento al login...`);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
            <Shield size={24} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Registrazione <span className="text-green-400">Admin</span>
          </h1>
          <p className="text-white/40 text-sm mt-2">Crea un account per accedere alla gestione</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-code" className="block text-sm text-white/60 mb-1.5">Codice di registrazione</label>
            <input
              id="reg-code"
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="Inserisci il codice"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm text-white/60 mb-1.5">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="Mario Rossi"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm text-white/60 mb-1.5">Email</label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm text-white/60 mb-1.5">Password</label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/30">
          Hai già un account?{" "}
          <Link href="/admin/login" className="text-green-400/60 hover:text-green-400 transition-colors">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
