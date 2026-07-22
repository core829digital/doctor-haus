"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Ruler, Package, Wrench, Layout as LayoutIcon, Sparkles, Check } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const galleryPhotos = [
  "/images/apple-cabin/webp/1.webp",
  "/images/apple-cabin/webp/2.webp",
  "/images/apple-cabin/webp/21.webp",
  "/images/apple-cabin/webp/22.webp",
  "/images/apple-cabin/webp/15.webp",
  "/images/apple-cabin/webp/16.webp",
  "/images/apple-cabin/webp/23.webp",
  "/images/apple-cabin/webp/24.webp",
  "/images/apple-cabin/webp/25.webp",
  "/images/apple-cabin/webp/29.webp",
  "/images/apple-cabin/webp/40.webp",
  "/images/apple-cabin/webp/45.webp",
];

export default function ProdottoContent({ locale }: { locale: string }) {
  const t = useTranslations("product");

  const specSections = ["layout", "dimensioni", "materiali", "impianti"] as const;
  const sectionIcons = [LayoutIcon, Ruler, Package, Wrench];

  const specs = specSections.map((key, idx) => {
    const section = t.raw(`specifiche.${key}`);
    const Icon = sectionIcons[idx];
    return {
      title: section.title as string,
      Icon,
      items: (section.items as { label: string; value: string }[]),
    };
  });

  const customizations = t.raw("personalizzazioni.items") as string[];
  const galleryTitle = t("galleria.title");

  return (
    <>
      <section className="relative pt-40 pb-24 lg:pb-32 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-mono text-green-500 tracking-[0.2em] uppercase mb-6"
          >
            Doctor Haus
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl xl:text-7xl font-display font-semibold text-text leading-tight"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg text-text-muted max-w-xl mx-auto"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </section>

      <SectionWrapper alt>
        <SectionTitle title={t("specifiche.title")} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {specs.map((section, i) => {
            const Icon = section.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background rounded-2xl border border-line p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Icon size={20} className="text-green-500" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-text">{section.title}</h3>
                </div>
                <div className="space-y-4">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex justify-between items-start gap-4 pb-3 border-b border-line last:border-0 last:pb-0">
                      <span className="text-sm text-text-muted">{item.label}</span>
                      <span className="text-sm font-medium text-text text-right">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <SectionTitle
          title={t("personalizzazioni.title")}
          subtitle={locale === "it" ? "Rendi unica la tua Apple Cabin." : "Make your Apple Cabin unique."}
        />
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customizations.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-background-alt"
              >
                <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-text-muted">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper alt>
        <SectionTitle title={galleryTitle} />
        <div className="columns-1 sm:columns-2 gap-4 max-w-5xl mx-auto space-y-4">
          {galleryPhotos.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
              className="break-inside-avoid overflow-hidden rounded-2xl bg-background-alt border border-line group cursor-pointer"
            >
              <img
                src={src}
                alt={`Apple Cabin ${i + 1}`}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-b from-green-50/50 to-transparent rounded-3xl p-12 lg:p-16 border border-line"
        >
          <Sparkles size={32} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-text mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-text-muted mb-6 max-w-lg mx-auto">{t("cta.description")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/configuratore?prodotto=apple-cabin"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-green-600 hover:scale-[1.02]"
            >
              {locale === "it" ? "Configura la tua Apple Cabin" : "Configure your Apple Cabin"}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
            >
              {t("cta.button")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </SectionWrapper>
    </>
  );
}
