"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

export default function FAQSection() {
  const t = useTranslations("home.faq");
  const items = t.raw("items") as { q: string; a: string }[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionWrapper id="faq" alt>
      <SectionTitle title={t("title")} />
      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-line bg-background overflow-hidden transition-colors duration-300"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex items-center justify-between w-full px-6 py-5 lg:px-8 lg:py-6 text-left"
              >
                <span className="text-base lg:text-lg font-display font-semibold text-text pr-4">
                  {item.q}
                </span>
                <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-background-alt text-text-muted transition-transform duration-300">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 lg:px-8 lg:pb-6">
                      <p className="text-sm lg:text-base text-text-muted leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
