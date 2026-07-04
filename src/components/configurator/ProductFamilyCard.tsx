"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Props = {
  name: string;
  description: string;
  areaSqm: number;
  isFeatured: boolean;
  selected: boolean;
  onClick: () => void;
  index: number;
};

export default function ProductFamilyCard({
  name,
  description,
  areaSqm,
  isFeatured,
  selected,
  onClick,
  index,
}: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className={`relative text-left rounded-2xl border-2 p-6 lg:p-8 transition-all duration-300 ${
        selected
          ? "border-green-500 bg-green-50/30 shadow-[0_0_0_2px_rgba(34,197,94,0.15)]"
          : "border-line bg-background hover:border-text-muted hover:shadow-sm"
      } ${isFeatured ? "lg:col-span-2 lg:row-span-1" : ""}`}
    >
      {isFeatured && (
        <span className="inline-block text-[10px] font-mono text-orange-500 tracking-[0.15em] uppercase mb-3 bg-orange-50 px-3 py-1 rounded-full">
          Il nostro prodotto di punta
        </span>
      )}
      <h3
        className={`font-display font-semibold text-text ${
          isFeatured ? "text-2xl lg:text-3xl" : "text-xl"
        }`}
      >
        {name}
      </h3>
      <p className="mt-2 text-sm text-text-muted leading-relaxed line-clamp-3">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
        <span>{areaSqm} m²</span>
      </div>
      {selected && (
        <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </span>
      )}
    </motion.button>
  );
}
