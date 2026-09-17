"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const GALLERY_PHOTOS = Array.from(
  { length: 16 },
  (_, i) => `/doctor-haus-piu-foto-e-video/lavori-${String(i + 1).padStart(2, "0")}.jpeg`
);

const WORKS_VIDEO = "/doctor-haus-piu-foto-e-video/lavori-video-03.mp4";

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

      {/* Real job sites gallery — video + auto-scrolling photo carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mt-16 lg:mt-20"
      >
        <div className="text-center mb-8 lg:mb-10">
          <h3 className="text-xl lg:text-2xl font-display font-semibold text-text">
            {t("galleryTitle")}
          </h3>
          <p className="mt-2 text-sm lg:text-base text-text-muted leading-relaxed max-w-2xl mx-auto">
            {t("gallerySubtitle")}
          </p>
        </div>

        <div className="mx-auto max-w-2xl mb-10">
          <video
            src={WORKS_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={t("videoLabel")}
            className="w-full rounded-2xl border border-line shadow-lg aspect-video object-cover"
          />
        </div>

        <div className="marquee-hover-pause marquee-mask overflow-hidden">
          <div
            className="animate-marquee-left flex w-max gap-4"
            style={{ "--marquee-duration": "60s" } as React.CSSProperties}
          >
            {[...GALLERY_PHOTOS, ...GALLERY_PHOTOS].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={i < GALLERY_PHOTOS.length ? t("galleryAlt", { n: i + 1 }) : ""}
                aria-hidden={i >= GALLERY_PHOTOS.length}
                width={288}
                height={192}
                loading="lazy"
                draggable={false}
                className="h-40 lg:h-48 w-60 lg:w-72 object-cover rounded-xl border border-line shadow-sm pointer-events-none select-none shrink-0"
              />
            ))}
          </div>
        </div>
      </motion.div>

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
