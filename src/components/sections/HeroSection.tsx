"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("home.hero");

  const headlineWords = t("headline").split(" ");

  return (
    <section className="sticky top-0 min-h-screen flex items-center overflow-hidden bg-background">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-main.webp"
          alt="Doctor Haus Apple Cabin"
          className="w-full h-full object-cover pointer-events-none select-none"
          style={{ objectPosition: "50% 50%" }}
          draggable={false}
        />
      </div>
      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="flex justify-end min-h-screen items-center py-32 lg:py-0">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} className="text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
