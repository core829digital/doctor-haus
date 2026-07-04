"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ProcessoSection() {
  const t = useTranslations("home.processo");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <SectionWrapper id="processo">
      <SectionTitle title={t("title")} subtitle={t("description")} />
      <div className="relative">
        <div className="hidden lg:block absolute top-12 left-[44px] right-[44px] h-0.5 bg-line" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-green-50 text-green-500 border-2 border-green-200 mb-6">
                <span className="text-2xl lg:text-3xl font-display font-semibold">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg lg:text-xl font-display font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm lg:text-base text-text-muted leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-14 text-center"
      >
        <Link
          href="/come-funziona"
          className="inline-flex items-center gap-2 rounded-full border border-line px-8 py-3.5 text-base font-medium text-text transition-all duration-300 hover:border-text-muted hover:bg-background-alt"
        >
          {t("cta")}
          <ArrowRight size={18} />
        </Link>
      </motion.div>
    </SectionWrapper>
  );
}
