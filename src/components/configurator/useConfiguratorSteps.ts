import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

export type StepDefinition = {
  index: number;
  slug: string;
  label: string;
};

const ALL_STEPS: StepDefinition[] = [
  { index: 0, slug: "prodotto", label: "Prodotto" },
  { index: 1, slug: "modello", label: "Modello" },
  { index: 2, slug: "planimetria", label: "Planimetria" },
  { index: 3, slug: "rivestimento-esterno", label: "Rivestimento esterno" },
  { index: 4, slug: "pannello-parete", label: "Pannello pareti" },
  { index: 5, slug: "rivestimento-pareti", label: "Rivestimento pareti" },
  { index: 6, slug: "finestre", label: "Finestre" },
  { index: 7, slug: "porte", label: "Porte" },
  { index: 8, slug: "pavimentazione", label: "Pavimentazione" },
  { index: 9, slug: "bagno", label: "Bagno" },
  { index: 10, slug: "riepilogo", label: "Riepilogo" },
];

// Which top-level step slugs map to which option category slugs
const STEP_TO_CATEGORY_SLUG: Record<string, string> = {
  "rivestimento-esterno": "rivestimento-esterno",
  "pannello-parete": "pannello-parete",
  "rivestimento-pareti": "rivestimento-pareti",
  finestre: "finestre",
  porte: "porte",
  pavimentazione: "pavimentazione",
  bagno: "bagno",
};

// Per-product-family slug overrides for rivestimento-esterno
const FAMILY_EXTERNAL_FINISH_SLUGS: Record<string, string> = {
  "Apple Cabin": "rivestimento-esterno",
  "Box Espandibile": "rivestimento-esterno",
  "Box Container": "rivestimento-esterno",
  "Modulo Abitativo": "rivestimento-esterno",
  "Cabina Spaziale": "rivestimento-esterno",
  "Food Trailer Mobile": "rivestimento-esterno",
};

// Which families have multiple models (need step 1)
const FAMILIES_WITH_MULTIPLE_MODELS = new Set([
  "Box Espandibile",
  "Box Container",
  "Cabina Spaziale",
  "Food Trailer Mobile",
]);

// Which families have layouts
const FAMILIES_WITH_LAYOUTS = new Set(["Box Espandibile"]);

const CATEGORY_STEPS = new Set([
  "rivestimento-esterno",
  "pannello-parete",
  "rivestimento-pareti",
  "finestre",
  "porte",
  "pavimentazione",
  "bagno",
]);

export function useConfiguratorSteps(productFamily: string | null) {
  const optionCategories = useQuery(api.optionCategories.listAll);

  return useMemo(() => {
    let steps: StepDefinition[] = [];

    // Step 0: prod family selection — always present
    steps.push(ALL_STEPS[0]);

    if (!productFamily) {
      // No product selected yet — only show step 0
      steps = steps.slice(0, 1);
      return { steps, totalSteps: 1, categorySteps: [] };
    }

    // Step 1: model/variant selection (only for multi-variant families)
    if (FAMILIES_WITH_MULTIPLE_MODELS.has(productFamily)) {
      steps.push(ALL_STEPS[1]);
    }

    // Step 2: layout/floorplan (only for families with layouts)
    if (FAMILIES_WITH_LAYOUTS.has(productFamily)) {
      steps.push(ALL_STEPS[2]);
    }

    // Dynamic option category steps
    if (optionCategories) {
      const applicable = optionCategories.filter((cat: any) =>
        cat.applicableToFamilies.includes(productFamily)
      );

      for (const cat of applicable) {
        const stepDef = ALL_STEPS.find(
          (s) => STEP_TO_CATEGORY_SLUG[s.slug] === cat.slug
        );
        if (stepDef) {
          steps.push(stepDef);
        }
      }
    }

    // Final step: summary
    steps.push(ALL_STEPS[10]);

    // Re-index
    steps = steps.map((s, i) => ({ ...s, index: i }));

    const categorySteps = steps.filter((s) => CATEGORY_STEPS.has(s.slug));

    return { steps, totalSteps: steps.length, categorySteps };
  }, [productFamily, optionCategories]);
}
