"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  alt?: boolean;
};

export default function SectionWrapper({ children, className = "", id, alt }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-24 lg:py-32 ${alt ? "bg-background-alt" : "bg-background"} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
