"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const ambientPhotos = [
  { src: "/images/apple-cabin/webp/1.webp", label: "Giardino privato" },
  { src: "/images/apple-cabin/webp/24.webp", label: "Terreno agricolo" },
  { src: "/images/apple-cabin/webp/22.webp", label: "Area resort" },
  { src: "/images/apple-cabin/webp/15.webp", label: "Spazio ufficio" },
];

export default function AmbientazioniSection() {
  const t = useTranslations("home.ambientazioni");

  return (
    <SectionWrapper id="ambientazioni" alt>
      <SectionTitle title={t("title")} subtitle={t("description")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
        {ambientPhotos.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-background-alt border border-line group cursor-pointer"
          >
            <img
              src={photo.src}
              alt={photo.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
              loading="lazy"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-text">
                {photo.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
