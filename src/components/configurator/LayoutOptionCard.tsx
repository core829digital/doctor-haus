"use client";

import { motion } from "framer-motion";

import type { Id } from "convex/_generated/dataModel";

type Layout = {
  _id: Id<"productLayouts">;
  name: string;
  bedrooms?: number;
};

type Props = {
  layouts: Layout[];
  selectedId: Id<"productLayouts"> | null;
  onSelect: (id: Id<"productLayouts">) => void;
};

export default function LayoutOptionCard({ layouts, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {layouts.map((layout, i) => {
        const isSelected = layout._id === selectedId;
        return (
          <motion.button
            key={layout._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            onClick={() => onSelect(layout._id)}
            className={`text-left rounded-xl border-2 p-4 transition-all duration-300 ${
              isSelected
                ? "border-green-500 bg-green-50/30"
                : "border-line bg-background hover:border-text-muted"
            }`}
          >
            <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 mb-3 flex items-center justify-center">
              <span className="text-xs text-stone-400">Layout</span>
            </div>
            <p className="text-sm font-medium text-text">{layout.name}</p>
            {layout.bedrooms !== undefined && (
              <span className="text-xs text-text-muted">
                {layout.bedrooms} camere
              </span>
            )}
            {isSelected && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-[10px]">✓</span>
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
