"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ChevronDown, X, BadgeCheck, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const WORKS_PHOTOS = [
  "/doctorhaus-lavori-fatti/1.jpeg",
  "/doctorhaus-lavori-fatti/2.jpeg",
  "/doctorhaus-lavori-fatti/3.jpeg",
  "/doctorhaus-lavori-fatti/4.jpeg",
  "/doctorhaus-lavori-fatti/5.jpeg",
  "/doctorhaus-lavori-fatti/6.jpeg",
];

export default function HeroSection() {
  const t = useTranslations("home.hero");
  const [worksOpen, setWorksOpen] = useState(false);

  const headlineWords = t("headline").split(" ");

  const openWorks = useCallback(() => setWorksOpen(true), []);
  const closeWorks = useCallback(() => setWorksOpen(false), []);

  useEffect(() => {
    if (!worksOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWorks();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [worksOpen, closeWorks]);

  return (
    <section className="sticky top-0 min-h-screen flex items-center overflow-hidden bg-background">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-main.webp"
          alt="Doctor Haus Apple Cabin — mini casa modulare prefabbricata"
          width={1376}
          height={768}
          className="w-full h-full object-cover pointer-events-none select-none"
          style={{ objectPosition: "50% 50%" }}
          draggable={false}
        />
      </div>
      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="flex justify-end min-h-screen items-center py-32 pb-48 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-lg lg:max-w-xl text-right"
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold text-white leading-[1.1] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.04 } },
              }}
            >
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em]"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
                    },
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-6 lg:mt-8 text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed ml-auto max-w-md drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"
            >
              {t("subheadline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-end gap-4"
            >
              <Link
                href="/prodotto"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-base font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] shadow-lg shadow-orange-500/20"
              >
                {t("cta")}
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-base font-medium text-white transition-all duration-300 hover:border-white/70 hover:bg-white/10 backdrop-blur-sm"
              >
                {t("ctaSecondary")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Works proof block — CTA "Uno dei nostri lavori fatti" + auto-scrolling carousel */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 z-10"
      >
        <button
          type="button"
          onClick={openWorks}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 px-4 py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:border-white/50 shadow-lg"
        >
          <BadgeCheck size={16} className="text-green-200 shrink-0" />
          {t("ctaWorks")}
        </button>
        <div className="marquee-hover-pause marquee-mask mt-3 overflow-hidden w-[68vw] sm:w-[340px] lg:w-[420px]">
          <div
            className="animate-marquee-right flex w-max gap-3"
            style={{ "--marquee-duration": "38s" } as React.CSSProperties}
          >
            {[...WORKS_PHOTOS, ...WORKS_PHOTOS].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={i < WORKS_PHOTOS.length ? t("worksAlt", { n: i + 1 }) : ""}
                aria-hidden={i >= WORKS_PHOTOS.length}
                width={112}
                height={80}
                loading="lazy"
                draggable={false}
                className="h-16 w-24 lg:h-20 lg:w-28 object-cover rounded-lg border border-white/20 shadow-md pointer-events-none select-none shrink-0"
              />
            ))}
          </div>
        </div>
        <Link
          href="/catalogo"
          className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
        >
          {t("requestProjectCta")}
          <ArrowRight size={14} />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} className="text-white/50" />
        </motion.div>
      </motion.div>

      {/* Works modal — shows the completed project + catalog CTA */}
      <AnimatePresence>
        {worksOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={closeWorks}
            role="dialog"
            aria-modal="true"
            aria-label={t("worksTitle")}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative w-full max-w-4xl rounded-2xl bg-background shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeWorks}
                aria-label={t("closeLabel")}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background-alt text-text-muted hover:text-text hover:bg-line transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="pr-10 text-2xl sm:text-3xl font-display font-semibold text-text">
                {t("worksTitle")}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl">
                {t("worksSubtitle")}
              </p>

              <div className="marquee-hover-pause marquee-mask mt-6 overflow-hidden">
                <div
                  className="animate-marquee-right flex w-max gap-4"
                  style={{ "--marquee-duration": "30s" } as React.CSSProperties}
                >
                  {[...WORKS_PHOTOS, ...WORKS_PHOTOS].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={i < WORKS_PHOTOS.length ? t("worksAlt", { n: i + 1 }) : ""}
                      aria-hidden={i >= WORKS_PHOTOS.length}
                      width={384}
                      height={256}
                      draggable={false}
                      className="h-48 w-72 sm:h-64 sm:w-96 object-cover rounded-xl border border-line shadow-md pointer-events-none select-none shrink-0"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/catalogo"
                  onClick={closeWorks}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm sm:text-base font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] shadow-lg shadow-orange-500/20 text-center"
                >
                  {t("requestProjectCta")}
                  <ArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  onClick={closeWorks}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm sm:text-base font-medium text-text transition-all duration-300 hover:border-text-muted hover:bg-background-alt"
                >
                  {t("closeLabel")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
