"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Id } from "convex/_generated/dataModel";

type Choice = {
  _id: Id<"optionChoices">;
  label: string;
  description?: string;
};

type Props = {
  title: string;
  choices: Choice[];
  selectedId: Id<"optionChoices"> | null;
  onSelect: (id: Id<"optionChoices">) => void;
};

export default function SwatchOptionGrid({ title, choices, selectedId, onSelect }: Props) {
  return (
    <div>
      <h3 className="text-base font-medium text-text mb-4">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {choices.map((choice, i) => {
          const isSelected = choice._id === selectedId;
          return (
            <motion.button
              key={choice._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              onClick={() => onSelect(choice._id)}
              className={`relative rounded-xl border-2 p-3 text-center transition-all duration-200 ${
                isSelected
                  ? "border-green-500 bg-green-50/30"
                  : "border-line bg-background hover:border-text-muted"
              }`}
            >
              <div className="aspect-square rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 mb-2 flex items-center justify-center">
                <span className="text-[10px] text-stone-400 leading-tight text-center px-1">
                  {(choice.label.split(" — ").pop() ?? "").length > 12
                    ? (choice.label.split(" — ").pop() ?? "").substring(0, 10) + "…"
                    : choice.label.split(" — ").pop() ?? ""}
                </span>
              </div>
              <span className="text-[11px] font-medium text-text leading-tight block">
                {choice.label}
              </span>
              {isSelected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
