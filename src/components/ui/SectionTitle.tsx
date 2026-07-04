"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionTitle({ title, subtitle, align = "center", className = "" }: Props) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} max-w-2xl ${align === "center" ? "mx-auto" : ""} mb-16 lg:mb-20 ${className}`}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-3xl lg:text-4xl xl:text-5xl font-display font-semibold text-text leading-tight tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 lg:mt-6 text-base lg:text-lg text-text-muted leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
