"use client";

import { useConfiguratorStore } from "@/lib/configurator-store";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Check } from "lucide-react";

type Props = {
  locale: string;
  compact?: boolean;
};

export default function ConfigurationSummaryPanel({ locale, compact }: Props) {
  const { selectedProductId, selectedLayoutId, selectedOptions } =
    useConfiguratorStore();

  const product = useQuery(
    api.products.getById,
    selectedProductId ? { id: selectedProductId } : "skip"
  );
  const layout = useQuery(
    api.productLayouts.listByProduct,
    selectedProductId ? { productId: selectedProductId } : "skip"
  );

  const selectedLayout = layout?.find((l) => l._id === selectedLayoutId);

  if (!selectedProductId) {
    return (
      <div className="p-4 rounded-xl border border-line bg-background-alt text-sm text-text-muted text-center">
        {locale === "it"
          ? "Nessun prodotto selezionato"
          : "No product selected"}
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <h3
        className={`font-display font-semibold text-text ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        {locale === "it" ? "La tua configurazione" : "Your configuration"}
      </h3>

      {/* Product */}
      {product && (
        <div className="p-3 rounded-lg bg-background-alt border border-line">
          <span className="text-[10px] font-mono text-green-500 tracking-wider uppercase">
            {locale === "it" ? "Prodotto" : "Product"}
          </span>
          <p className="text-sm font-medium text-text mt-0.5">
            {product.name}
          </p>
          {selectedLayout && (
            <p className="text-xs text-text-muted mt-0.5">
              {selectedLayout.name}
            </p>
          )}
        </div>
      )}

      {/* Selected options */}
      {selectedOptions.length > 0 && (
        <div className="space-y-1.5">
          {selectedOptions.map((opt, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-text-muted"
            >
              <Check size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <span className="font-medium text-text">{opt.categoryLabel}:</span>{" "}
                {opt.choiceLabel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
