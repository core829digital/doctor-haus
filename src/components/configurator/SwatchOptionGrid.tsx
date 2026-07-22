"use client";

import { useMemo } from "react";
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

function swatchColor(label: string): string {
  const lower = label.toLowerCase();
  if (/legno|wood|noce|rovere|teak|wenge/.test(lower)) return "bg-amber-700";
  if (/bianco|white|avorio|ivory/.test(lower)) return "bg-stone-100";
  if (/nero|black|scuro|dark/.test(lower)) return "bg-neutral-900";
  if (/grigio|gray|grey|stone/.test(lower)) return "bg-stone-400";
  if (/beige/.test(lower)) return "bg-stone-200";
  if (/mattone|brick|rosso|red|terracotta/.test(lower)) return "bg-red-600";
  if (/pietra|stone/.test(lower)) return "bg-stone-500";
  if (/metallo|metal|alluminio|aluminum|acciaio|steel/.test(lower)) return "bg-slate-400";
  if (/verde|green/.test(lower)) return "bg-emerald-600";
  if (/blu|blue/.test(lower)) return "bg-blue-600";
  if (/crema|cream/.test(lower)) return "bg-yellow-50";
  if (/antracite|anthracite/.test(lower)) return "bg-zinc-800";
  return "bg-amber-600";
}

function borderStyle(label: string): string {
  const lower = label.toLowerCase();
  if (/bianco|white|avorio|ivory|crema|cream|beige/.test(lower)) return "border-stone-300";
  return "";
}

export default function SwatchOptionGrid({ title, choices, selectedId, onSelect }: Props) {
  return (
    <div>
      <h3 className="text-base font-medium text-text mb-4">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {choices.map((choice, i) => {
          const isSelected = choice._id === selectedId;
          const color = swatchColor(choice.label);
          const border = borderStyle(choice.label);
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
              <div className={`aspect-square rounded-lg mb-2 ${color} ${border} border flex items-center justify-center`}>
                {isSelected && <Check size={18} className="text-white drop-shadow" />}
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
