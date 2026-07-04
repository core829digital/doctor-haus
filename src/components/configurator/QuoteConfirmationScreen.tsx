"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

type Props = {
  locale: string;
};

export default function QuoteConfirmationScreen({ locale }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto text-center py-12"
    >
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="text-3xl lg:text-4xl font-display font-semibold text-text mb-4">
        {locale === "it" ? "Richiesta ricevuta!" : "Request received!"}
      </h2>
      <p className="text-text-muted leading-relaxed mb-8 max-w-md mx-auto">
        {locale === "it"
          ? "Abbiamo ricevuto la tua richiesta di preventivo. Ti contatteremo entro 24-48 ore lavorative con un preventivo personalizzato. Riceverai anche una conferma via email con il riepilogo della tua configurazione."
          : "We've received your quote request. We'll get back to you within 24-48 business hours with a personalized quote. You'll also receive an email confirmation with a summary of your configuration."}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
        >
          {locale === "it" ? "Torna alla home" : "Back to home"}
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/prodotto"
          className="text-sm font-medium text-text-muted hover:text-text transition-colors"
        >
          {locale === "it" ? "Scopri la Apple Cabin" : "Discover the Apple Cabin"}
        </Link>
      </div>
    </motion.div>
  );
}
