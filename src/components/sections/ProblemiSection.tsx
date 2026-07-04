"use client";

import { useTranslations } from "next-intl";
import { Clock, Euro, Leaf, Lock } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const icons = [Clock, Euro, Leaf, Lock];

export default function ProblemiSection() {
  const t = useTranslations("home.problemi");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <SectionWrapper id="problemi">
      <SectionTitle title={t("title")} subtitle={t("description")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
        {items.map((item, i) => {
          const Icon = icons[i];
          return (
            <div
              key={i}
              className="rounded-2xl border border-line p-6 lg:p-8 bg-background transition-all duration-300 hover:border-text-muted/20"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 text-orange-500">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-display font-semibold text-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm lg:text-base text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
