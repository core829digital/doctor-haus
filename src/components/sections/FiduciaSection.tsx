"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

function StatCard({ value, unit, label }: { value: string; unit: string; label: string }) {
  const numeric = parseInt(value, 10);
  const hasPlus = value.includes("+");
  const isRange = value.includes("-");
  const isNumeric = !isRange && !isNaN(numeric);

  const { ref, count } = useCountUp(isNumeric ? numeric : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-4xl lg:text-5xl xl:text-6xl font-display font-semibold text-text leading-none">
        {isNumeric ? (
          <span ref={ref}>
            {count}
            {hasPlus ? "+" : ""}
          </span>
        ) : (
          <span>{value}</span>
        )}
        <span className="text-lg lg:text-xl text-text-muted ml-1">
          {unit}
        </span>
      </div>
      <p className="mt-3 text-sm lg:text-base text-text-muted">
        {label}
      </p>
    </motion.div>
  );
}

export default function FiduciaSection() {
  const t = useTranslations("home.fiducia");
  const items = t.raw("items") as { value: string; unit: string; label: string }[];

  return (
    <SectionWrapper id="fiducia">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        {items.map((item, i) => (
          <StatCard key={i} value={item.value} unit={item.unit} label={item.label} />
        ))}
      </div>
    </SectionWrapper>
  );
}
