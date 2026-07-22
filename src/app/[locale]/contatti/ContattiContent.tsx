"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";

const content = {
  it: {
    title: "Contattaci",
    subtitle: "Raccontaci il tuo progetto. Ti risponderemo entro 24 ore.",
    form: {
      name: "Nome e Cognome",
      email: "Email",
      phone: "Telefono (opzionale)",
      message: "Il tuo messaggio",
      placeholder: "Raccontaci il tuo progetto...",
      privacy: "Ho letto e accetto la ",
      privacyLink: "Privacy Policy",
      submit: "Invia richiesta",
      sending: "Invio in corso...",
      success: "Richiesta inviata con successo!",
      successDesc: "Ti risponderemo entro 24 ore.",
      error: "Si è verificato un errore. Riprova più tardi.",
      required: "Campo obbligatorio",
      emailInvalid: "Email non valida",
    },
    info: {
      title: "Informazioni",
      email: "info@doctor-haus.com",
      phone: "+39 370 164 1622",
      address: "Italia",
    },
  },
  en: {
    title: "Contact Us",
    subtitle: "Tell us about your project. We'll respond within 24 hours.",
    form: {
      name: "Full Name",
      email: "Email",
      phone: "Phone (optional)",
      message: "Your Message",
      placeholder: "Tell us about your project...",
      privacy: "I have read and accept the ",
      privacyLink: "Privacy Policy",
      submit: "Send request",
      sending: "Sending...",
      success: "Request sent successfully!",
      successDesc: "We will respond within 24 hours.",
      error: "An error occurred. Please try again later.",
      required: "Required field",
      emailInvalid: "Invalid email",
    },
    info: {
      title: "Information",
      email: "info@doctor-haus.com",
      phone: "+39 370 164 1622",
      address: "Italy",
    },
  },
};

export default function ContattiContent({ locale }: { locale: string }) {
  const c = locale === "it" ? content.it : content.en;
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", privacy: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = c.form.required;
    if (!form.email.trim()) errs.email = c.form.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = c.form.emailInvalid;
    if (!form.message.trim()) errs.message = c.form.required;
    if (!form.privacy) errs.privacy = c.form.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const { trackFormSubmit } = await import("@/lib/analytics");
      trackFormSubmit("contatti", locale);
      const { api } = await import("convex/_generated/api");
      const { fetchMutation } = await import("convex/nextjs");
      await fetchMutation(api.analytics.trackEvent, {
        type: "contact_form_submit",
        page: "contatti",
        locale,
        sessionId: crypto.randomUUID?.() ?? Math.random().toString(36),
        metadata: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message.substring(0, 500),
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const infoItems = [
    { icon: Mail, value: c.info.email, href: `mailto:${c.info.email}` },
    { icon: Phone, value: c.info.phone },
    { icon: MapPin, value: c.info.address },
  ];

  return (
    <>
      <section className="relative pt-40 pb-24 lg:pb-32 bg-background">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-display font-semibold text-text leading-tight"
          >
            {c.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg text-text-muted max-w-xl mx-auto"
          >
            {c.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="pb-24 lg:pb-32 bg-background-alt">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-background rounded-2xl border border-line p-8 lg:p-10"
            >
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-display font-semibold text-text mb-2">{c.form.success}</h3>
                    <p className="text-text-muted">{c.form.successDesc}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">{c.form.name} *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={`w-full px-4 py-3 bg-background-alt border rounded-xl text-text text-sm outline-none transition-colors focus:border-green-500 ${
                            errors.name ? "border-red-400" : "border-line"
                          }`}
                        />
                        {errors.name && (
                          <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                            <AlertCircle size={12} /> {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">{c.form.email} *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={`w-full px-4 py-3 bg-background-alt border rounded-xl text-text text-sm outline-none transition-colors focus:border-green-500 ${
                            errors.email ? "border-red-400" : "border-line"
                          }`}
                        />
                        {errors.email && (
                          <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                            <AlertCircle size={12} /> {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">{c.form.phone}</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-background-alt border border-line rounded-xl text-text text-sm outline-none transition-colors focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">{c.form.message} *</label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={c.form.placeholder}
                        className={`w-full px-4 py-3 bg-background-alt border rounded-xl text-text text-sm outline-none transition-colors focus:border-green-500 resize-none ${
                          errors.message ? "border-red-400" : "border-line"
                        }`}
                      />
                      {errors.message && (
                        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                          <AlertCircle size={12} /> {errors.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.privacy}
                          onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                          className="mt-0.5 accent-green-500"
                        />
                        <span className="text-sm text-text-muted">
                          {c.form.privacy}
                          <Link href="/legal/privacy-policy" className="text-green-500 underline hover:text-green-600">
                            {c.form.privacyLink}
                          </Link>
                          {" *"}
                        </span>
                      </label>
                      {errors.privacy && (
                        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
                          <AlertCircle size={12} /> {errors.privacy}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "sending" ? c.form.sending : c.form.submit}
                      {status !== "sending" && <Send size={16} />}
                    </button>
                    {status === "error" && (
                      <p className="flex items-center gap-1 text-sm text-red-500 mt-2">
                        <AlertCircle size={14} /> {c.form.error}
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              <div>
                <h3 className="text-lg font-display font-semibold text-text mb-6">{c.info.title}</h3>
                <div className="space-y-5">
                  {infoItems.map((item, i) => {
                    const Icon = item.icon;
                    const content = item.href ? (
                      <a href={item.href} className="text-text-muted hover:text-green-500 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-text-muted">{item.value}</span>
                    );
                    return (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                          <Icon size={18} className="text-green-500" />
                        </div>
                        <div className="text-sm">{content}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-background rounded-2xl border border-line p-6">
                <h4 className="text-sm font-display font-semibold text-text mb-2">
                  {locale === "it" ? "Orari" : "Hours"}
                </h4>
                <p className="text-sm text-text-muted">
                  {locale === "it"
                    ? "Lun-Ven: 9:00 – 18:00"
                    : "Mon-Fri: 9:00 AM – 6:00 PM"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
