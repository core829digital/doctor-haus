"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const backgrounds = [
  "from-green-100 to-green-200/50",
  "from-orange-100 to-orange-200/50",
  "from-blue-100 to-blue-200/50",
  "from-stone-100 to-stone-200/50",
];

const labels = [
  "Giardino privato",
  "Terreno agricolo",
  "Area resort",
  "Spazio ufficio",
];

export default function AmbientazioniSection() {
  const t = useTranslations("home.ambientazioni");

  return (
    <SectionWrapper id="ambientazioni" alt>
      <SectionTitle title={t("title")} subtitle={t("description")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
        {labels.map((label, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br border border-line group cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${backgrounds[i]}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-text">
                {label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
