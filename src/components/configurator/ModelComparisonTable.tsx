"use client";

import { motion } from "framer-motion";

import type { Id } from "convex/_generated/dataModel";

type Model = {
  _id: Id<"products">;
  name: string;
  description: string;
  dimensions: { lengthMm: number; widthMm: number; heightMm: number };
  dimensionsExpandedMm?: { lengthMm: number; widthMm: number; heightMm: number };
  areaSqm: number;
  weightTons?: number;
  capacityPersons?: string;
};

type Props = {
  models: Model[];
  selectedId: Id<"products"> | null;
  onSelect: (id: Id<"products">) => void;
  locale: string;
};

export default function ModelComparisonTable({ models, selectedId, onSelect, locale }: Props) {
  return (
    <div className="space-y-4">
      {models.map((model, i) => {
        const isSelected = model._id === selectedId;
        return (
          <motion.button
            key={model._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            onClick={() => onSelect(model._id)}
            className={`w-full text-left rounded-2xl border-2 p-6 transition-all duration-300 ${
              isSelected
                ? "border-green-500 bg-green-50/30"
                : "border-line bg-background hover:border-text-muted"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
              <div className="flex-1">
                <h3 className="text-lg font-display font-semibold text-text">
                  {model.name}
                </h3>
                <p className="mt-1 text-sm text-text-muted line-clamp-2">
                  {model.description}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm flex-shrink-0">
                <div>
                  <span className="block text-xs text-text-muted">
                    {locale === "it" ? "Superficie" : "Area"}
                  </span>
                  <span className="font-medium text-text">{model.areaSqm} m²</span>
                </div>
                {model.dimensionsExpandedMm && (
                  <div>
                    <span className="block text-xs text-text-muted">
                      {locale === "it" ? "Aperto" : "Open"}
                    </span>
                    <span className="font-medium text-text">
                      {model.dimensionsExpandedMm.lengthMm / 1000}×{model.dimensionsExpandedMm.widthMm / 1000} m
                    </span>
                  </div>
                )}
                {model.weightTons !== undefined && (
                  <div>
                    <span className="block text-xs text-text-muted">Peso</span>
                    <span className="font-medium text-text">{model.weightTons} t</span>
                  </div>
                )}
                {model.capacityPersons && (
                  <div>
                    <span className="block text-xs text-text-muted">
                      {locale === "it" ? "Capacità" : "Capacity"}
                    </span>
                    <span className="font-medium text-text">{model.capacityPersons}</span>
                  </div>
                )}
              </div>
              {isSelected && (
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
