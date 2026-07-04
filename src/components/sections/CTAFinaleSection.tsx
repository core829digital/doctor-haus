"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export default function CTAFinaleSection() {
  const t = useTranslations("home.ctaFinale");

  return (
    <section className="relative py-24 lg:py-32 bg-background-alt overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl lg:text-4xl xl:text-5xl font-display font-semibold text-text leading-tight tracking-tight"
        >
          {t("title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 lg:mt-6 text-base lg:text-lg text-text-muted max-w-xl mx-auto leading-relaxed"
        >
          {t("description")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10"
        >
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-base font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] shadow-lg shadow-orange-500/20"
          >
            {t("cta")}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
