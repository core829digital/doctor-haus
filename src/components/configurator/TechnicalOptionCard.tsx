"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Id } from "convex/_generated/dataModel";

type Choice = {
  _id: Id<"optionChoices">;
  label: string;
  description?: string;
  technicalSpecs?: string[];
  subOptions?: { label: string; description?: string }[];
};

type Props = {
  title: string;
  choices: Choice[];
  selectedId: Id<"optionChoices"> | null;
  onSelect: (id: Id<"optionChoices">) => void;
  selectedSubOption?: string;
  onSubOptionSelect?: (choiceId: Id<"optionChoices">, subLabel: string) => void;
};

export default function TechnicalOptionCard({
  title,
  choices,
  selectedId,
  onSelect,
  selectedSubOption,
  onSubOptionSelect,
}: Props) {
  return (
    <div>
      <h3 className="text-base font-medium text-text mb-4">{title}</h3>
      <div className="space-y-4">
        {choices.map((choice, i) => {
          const isSelected = choice._id === selectedId;
          return (
            <motion.div
              key={choice._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className={`rounded-2xl border-2 p-5 transition-all duration-300 ${
                isSelected
                  ? "border-green-500 bg-green-50/30"
                  : "border-line bg-background"
              }`}
            >
              <button
                onClick={() => onSelect(choice._id)}
                className="w-full text-left flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-display font-semibold text-text">
                      {choice.label}
                    </h4>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-white" />
                      </span>
                    )}
                  </div>
                  {choice.description && (
                    <p className="mt-1 text-sm text-text-muted leading-relaxed">
                      {choice.description}
                    </p>
                  )}
                  {choice.technicalSpecs && choice.technicalSpecs.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {choice.technicalSpecs.map((spec, j) => (
                        <li
                          key={j}
                          className="text-xs bg-background-alt px-2.5 py-1 rounded-full text-text-muted"
                        >
                          {spec}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </button>

              {isSelected &&
                choice.subOptions &&
                choice.subOptions.length > 0 &&
                onSubOptionSelect && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <span className="text-xs font-mono text-green-500 tracking-wider uppercase">
                      Sotto-opzioni
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {choice.subOptions.map((sub) => {
                        const isSubSelected = selectedSubOption === sub.label;
                        return (
                          <button
                            key={sub.label}
                            onClick={() => onSubOptionSelect(choice._id, sub.label)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                              isSubSelected
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-line text-text-muted hover:border-text-muted"
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
