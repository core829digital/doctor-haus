"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ProdottoTeaserSection() {
  const t = useTranslations("home.prodotto");
  const specs = t.raw("specs") as { label: string; value: string }[];

  return (
    <SectionWrapper id="prodotto">
      <SectionTitle title={t("title")} subtitle={t("description")} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-green-200/40 via-background to-orange-200/30 border border-line">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-3xl bg-gradient-to-b from-white/80 to-background-alt shadow-sm border border-line" />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4 mb-10">
            {specs.map((spec, i) => (
              <div
                key={i}
                className="rounded-xl border border-line p-4 lg:p-5 text-center"
              >
                <div className="text-xl lg:text-2xl font-display font-semibold text-text">
                  {spec.value}
                </div>
                <div className="text-xs lg:text-sm text-text-muted mt-1">
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/prodotto"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-base font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] shadow-lg shadow-orange-500/20"
            >
              {t("cta")}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
