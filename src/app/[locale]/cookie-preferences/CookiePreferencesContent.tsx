"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Info, Save } from "lucide-react";

const content = {
  it: {
    title: "Preferenze Cookie",
    subtitle: "Gestisci le tue preferenze sui cookie. Puoi modificare le tue scelte in qualsiasi momento.",
    categories: [
      {
        id: "technical",
        title: "Cookie Tecnici",
        desc: "Necessari per il funzionamento del sito. Non possono essere disabilitati.",
        required: true,
      },
      {
        id: "analytics",
        title: "Cookie Analytics",
        desc: "Ci aiutano a capire come i visitatori interagiscono con il sito, raccogliendo dati anonimi.",
        required: false,
      },
      {
        id: "marketing",
        title: "Cookie Marketing",
        desc: "Utilizzati per mostrare contenuti pertinenti e misurare l'efficacia delle campagne.",
        required: false,
      },
      {
        id: "thirdparty",
        title: "Cookie di Terze Parti",
        desc: "Cookie impostati da servizi esterni (Google Maps, video incorporati, social media).",
        required: false,
      },
    ],
    save: "Salva preferenze",
    saved: "Preferenze salvate con successo!",
    acceptAll: "Accetta tutti",
    rejectAll: "Rifiuta tutti",
  },
  en: {
    title: "Cookie Preferences",
    subtitle: "Manage your cookie preferences. You can change your choices at any time.",
    categories: [
      {
        id: "technical",
        title: "Technical Cookies",
        desc: "Necessary for the website to function. They cannot be disabled.",
        required: true,
      },
      {
        id: "analytics",
        title: "Analytics Cookies",
        desc: "Help us understand how visitors interact with the site by collecting anonymous data.",
        required: false,
      },
      {
        id: "marketing",
        title: "Marketing Cookies",
        desc: "Used to show relevant content and measure campaign effectiveness.",
        required: false,
      },
      {
        id: "thirdparty",
        title: "Third-Party Cookies",
        desc: "Cookies set by external services (Google Maps, embedded videos, social media).",
        required: false,
      },
    ],
    save: "Save preferences",
    saved: "Preferences saved successfully!",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
  },
};

export default function CookiePreferencesContent({ locale }: { locale: string }) {
  const c = locale === "it" ? content.it : content.en;
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(c.categories.map((cat) => [cat.id, cat.required]))
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const setAll = (value: boolean) => {
    setPrefs(
      Object.fromEntries(c.categories.map((cat) => [cat.id, cat.required || value]))
    );
  };

  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-display font-semibold text-text mb-4"
        >
          {c.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-text-muted mb-10"
        >
          {c.subtitle}
        </motion.p>

        <div className="flex gap-3 mb-10">
          <button
            onClick={() => setAll(true)}
            className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-green-600"
          >
            {c.acceptAll}
          </button>
          <button
            onClick={() => setAll(false)}
            className="rounded-full border border-line px-6 py-2.5 text-sm font-medium text-text-muted transition-all hover:text-text hover:border-text-muted"
          >
            {c.rejectAll}
          </button>
        </div>

        <div className="space-y-4">
          {c.categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-start gap-4 p-5 rounded-xl border border-line bg-background"
            >
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id={cat.id}
                  checked={prefs[cat.id]}
                  disabled={cat.required}
                  onChange={(e) => setPrefs({ ...prefs, [cat.id]: e.target.checked })}
                  className="accent-green-500 w-5 h-5"
                />
              </div>
              <label htmlFor={cat.id} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text text-sm">{cat.title}</span>
                  {cat.required && (
                    <span className="text-[10px] uppercase tracking-wider text-green-500 font-medium">
                      {locale === "it" ? "Necessario" : "Required"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-muted mt-1">{cat.desc}</p>
              </label>
              <div className="flex-shrink-0 relative group">
                <Info size={16} className="text-text-muted/50 cursor-help" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
          >
            <Save size={16} />
            {c.save}
          </button>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-sm text-green-500"
            >
              <Check size={16} />
              {c.saved}
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
