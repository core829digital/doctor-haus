"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useConfiguratorStore } from "@/lib/configurator-store";
import type { Id } from "convex/_generated/dataModel";
import { useAnalytics } from "@/lib/use-analytics";
import {
  useConfiguratorSteps,
} from "@/components/configurator/useConfiguratorSteps";
import ConfiguratorLayout from "@/components/configurator/ConfiguratorLayout";
import ProductFamilyCard from "@/components/configurator/ProductFamilyCard";
import ModelComparisonTable from "@/components/configurator/ModelComparisonTable";
import LayoutOptionCard from "@/components/configurator/LayoutOptionCard";
import SwatchOptionGrid from "@/components/configurator/SwatchOptionGrid";
import TechnicalOptionCard from "@/components/configurator/TechnicalOptionCard";
import QuoteRequestForm from "@/components/configurator/QuoteRequestForm";
import QuoteConfirmationScreen from "@/components/configurator/QuoteConfirmationScreen";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  locale: string;
  preselectedSlug?: string;
};

const STEP_CATEGORY_SLUGS: Record<string, string> = {
  "rivestimento-esterno": "rivestimento-esterno",
  "pannello-parete": "pannello-parete",
  "rivestimento-pareti": "rivestimento-pareti",
  finestre: "finestre",
  porte: "porte",
  pavimentazione: "pavimentazione",
  bagno: "bagno",
};

const SWATCH_STEPS = new Set([
  "rivestimento-esterno",
  "rivestimento-pareti",
  "pavimentazione",
]);

const CATEGORY_STEPS = new Set(Object.keys(STEP_CATEGORY_SLUGS));

export default function ConfiguratoreContent({ locale, preselectedSlug }: Props) {
  const { trackClick } = useAnalytics();
  const products = useQuery(api.products.listActive);
  const productBySlug = useQuery(
    api.products.getBySlug,
    preselectedSlug ? { slug: preselectedSlug } : "skip"
  );

  const {
    currentStep,
    totalSteps,
    selectedProductId,
    selectedLayoutId,
    selectedOptions,
    setCurrentStep,
    setTotalSteps,
    setSelectedProductId,
    setSelectedLayoutId,
    setOption,
    sessionId,
  } = useConfiguratorStore();

  // Sub-option tracking (e.g., rock wool thickness)
  const [subOptions, setSubOptions] = useState<Record<string, string>>({});

  const upsertDraft = useMutation(api.configurationDrafts.upsert);

  // Debounced draft save
  const draftTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedProductId) return;
    if (draftTimeoutRef.current) clearTimeout(draftTimeoutRef.current);
    draftTimeoutRef.current = setTimeout(() => {
      upsertDraft({
        sessionId,
        productId: selectedProductId,
        layoutId: selectedLayoutId ?? undefined,
        selectedOptions: selectedOptions.map((o) => ({ categoryId: o.categoryId, choiceId: o.choiceId })),
        currentStep,
        completed: false,
      });
    }, 500);
    return () => {
      if (draftTimeoutRef.current) clearTimeout(draftTimeoutRef.current);
    };
  }, [selectedProductId, selectedLayoutId, selectedOptions, currentStep, sessionId, upsertDraft]);

  // Pre-select product from slug
  useEffect(() => {
    if (productBySlug && !selectedProductId) {
      setSelectedProductId(productBySlug._id);
    }
  }, [productBySlug, selectedProductId, setSelectedProductId]);

  const selectedProduct = products?.find((p) => p._id === selectedProductId);
  const productFamily = selectedProduct?.family ?? null;

  const { steps } = useConfiguratorSteps(productFamily);

  useEffect(() => {
    setTotalSteps(steps.length);
  }, [steps.length, setTotalSteps]);

  // Get models for the same family
  const familyModels = products?.filter(
    (p) => p.family === productFamily && p._id !== selectedProductId
  );

  // Get option categories for this step
  const currentStepDef = steps[currentStep];

  // Load layouts
  const layouts = useQuery(
    api.productLayouts.listByProduct,
    selectedProductId ? { productId: selectedProductId } : "skip"
  );

  // ── Option category data (always at top level, never conditional) ──
  const allCats = useQuery(api.optionCategories.listAll);
  const currentStepSlug = currentStepDef?.slug ?? "";
  const querySlug = STEP_CATEGORY_SLUGS[currentStepSlug] ?? "";
  const currentCat = allCats?.find((c) => c.slug === querySlug);
  const choices = useQuery(
    api.optionChoices.listByCategory,
    currentCat ? { categoryId: currentCat._id } : "skip"
  );

  // Summary state
  const [showSuccess, setShowSuccess] = useState(false);

  const t = (it: string, en: string) => (locale === "it" ? it : en);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, steps.length, setCurrentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, setCurrentStep]);

  if (!products) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background pt-16">
        <div className="animate-pulse text-text-muted">
          {t("Caricamento...", "Loading...")}
        </div>
      </div>
    );
  }

  const renderStep = () => {
    if (showSuccess) {
      return <QuoteConfirmationScreen locale={locale} />;
    }

    if (!currentStepDef) return null;

    // ── Step 0: Product family selection ──────────────
    if (currentStepDef.slug === "prodotto") {
      const families = products
        .filter((p) => p.active)
        .reduce<{ slug: string; name: string; description: string; areaSqm: number; isFeatured: boolean; memberIds: Id<"products">[] }[]>(
          (acc, p) => {
            const existing = acc.find((f) => f.name === p.family);
            if (existing) {
              existing.memberIds.push(p._id);
            } else {
              acc.push({
                slug: p.slug,
                name: p.family,
                description: p.description,
                areaSqm: p.areaSqm,
                isFeatured: p.isFeatured,
                memberIds: [p._id],
              });
            }
            return acc;
          },
          []
        );

      return (
        <div>
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-text mb-2">
            {t("Scegli il prodotto", "Choose your product")}
          </h2>
          <p className="text-text-muted mb-8">
            {t(
              "Seleziona la tipologia di struttura che vuoi configurare.",
              "Select the type of structure you want to configure."
            )}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {families.map((fam, i) => {
              const isSelected = selectedProductId
                ? fam.memberIds.includes(selectedProductId)
                : false;
              const firstId = fam.memberIds[0];
              return (
                <ProductFamilyCard
                  key={fam.slug}
                  name={fam.name}
                  description={fam.description}
                  areaSqm={fam.areaSqm}
                  isFeatured={fam.isFeatured}
                  selected={isSelected}
                  onClick={() => {
                    setSelectedProductId(firstId);
                    const singleModelFamilies = new Set([
                      "Apple Cabin",
                      "Modulo Abitativo",
                    ]);
                    if (singleModelFamilies.has(fam.name)) {
                      setTimeout(() => handleNext(), 200);
                    }
                  }}
                  index={i}
                />
              );
            })}
          </div>
        </div>
      );
    }

    // ── Step 1: Model selection ──────────────
    if (currentStepDef.slug === "modello") {
      const allFamilyModels = products.filter(
        (p) => p.family === productFamily && p.active
      );
      return (
        <div>
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-text mb-2">
            {t("Scegli il modello", "Choose the model")}
          </h2>
          <p className="text-text-muted mb-8">
            {t(
              "Confronta le varianti disponibili per questa famiglia.",
              "Compare the available variants for this family."
            )}
          </p>
          <ModelComparisonTable
            models={allFamilyModels}
            selectedId={selectedProductId}
            onSelect={(id) => setSelectedProductId(id)}
            locale={locale}
          />
        </div>
      );
    }

    // ── Step 2: Layout/Floorplan ──────────────
    if (currentStepDef.slug === "planimetria") {
      return (
        <div>
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-text mb-2">
            {t("Scegli la planimetria", "Choose the floor plan")}
          </h2>
          <p className="text-text-muted mb-8">
            {t(
              "Seleziona la disposizione interna che preferisci.",
              "Select the internal layout you prefer."
            )}
          </p>
          {layouts && (
            <LayoutOptionCard
              layouts={layouts}
              selectedId={selectedLayoutId}
               onSelect={(id) => setSelectedLayoutId(id)}
            />
          )}
        </div>
      );
    }

    // ── Option category steps ──────────────
    if (CATEGORY_STEPS.has(currentStepDef.slug)) {
      const currentChoice = selectedOptions.find(
        (o) => o.categoryId === (currentCat?._id ?? "")
      );

      if (!currentCat) return null;

      const handleChoiceSelect = (choiceId: Id<"optionChoices">) => {
        const choice = choices?.find((ch) => ch._id === choiceId);
        setOption(currentCat._id, choiceId, currentCat.label, choice?.label ?? choiceId);
      };

      return (
        <div>
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-text mb-2">
            {currentCat.label}
          </h2>
          {currentCat.description && (
            <p className="text-text-muted mb-8">{currentCat.description}</p>
          )}
          {choices && (
            <>
              {SWATCH_STEPS.has(currentStepDef.slug) ? (
                <SwatchOptionGrid
                  title=""
                  choices={choices}
                  selectedId={currentChoice?.choiceId ?? null}
                  onSelect={handleChoiceSelect}
                />
              ) : (
                <TechnicalOptionCard
                  title=""
                  choices={choices}
                  selectedId={currentChoice?.choiceId ?? null}
                  onSelect={handleChoiceSelect}
                  selectedSubOption={
                    currentChoice?.choiceId
                      ? subOptions[currentChoice.choiceId]
                      : undefined
                  }
                  onSubOptionSelect={(choiceId, subLabel) => {
                    handleChoiceSelect(choiceId);
                    setSubOptions((prev) => ({ ...prev, [choiceId]: subLabel }));
                  }}
                />
              )}
            </>
          )}
        </div>
      );
    }

    // ── Final step: summary + form ──────────────
    if (currentStepDef.slug === "riepilogo") {
      return (
        <QuoteRequestForm locale={locale} onSuccess={() => setShowSuccess(true)} />
      );
    }

    return null;
  };

  return (
      <ConfiguratorLayout steps={steps} locale={locale}>
        {renderStep()}

        {/* Navigation buttons */}
        {currentStep < steps.length - 1 && !showSuccess && currentStepDef?.slug !== "riepilogo" && (
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-line">
            <button
              onClick={() => { handlePrev(); trackClick("config-back", steps[currentStep]?.slug); }}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={14} />
              {t("Indietro", "Back")}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted">
                {t(
                  `Passo ${currentStep + 1} di ${steps.length}`,
                  `Step ${currentStep + 1} of ${steps.length}`
                )}
              </span>
              <button
                onClick={() => { handleNext(); trackClick("config-next", steps[currentStep]?.slug); }}
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-green-600 hover:scale-[1.02]"
              >
                {t("Continua", "Continue")}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </ConfiguratorLayout>
  );
}
