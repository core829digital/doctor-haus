import { create } from "zustand";
import { Id } from "convex/_generated/dataModel";

type OptionSelection = {
  categoryId: Id<"optionCategories">;
  choiceId: Id<"optionChoices">;
  categoryLabel: string;
  choiceLabel: string;
};

type StepName =
  | "prodotto"
  | "modello"
  | "planimetria"
  | "rivestimento-esterno"
  | "pannello-parete"
  | "rivestimento-pareti"
  | "finestre"
  | "porte"
  | "pavimentazione"
  | "bagno"
  | "riepilogo";

type Store = {
  currentStep: number;
  totalSteps: number;
  selectedProductId: Id<"products"> | null;
  selectedLayoutId: Id<"productLayouts"> | null;
  selectedOptions: OptionSelection[];
  sessionId: string;

  setCurrentStep: (step: number) => void;
  setTotalSteps: (n: number) => void;
  setSelectedProductId: (id: Id<"products"> | null) => void;
  setSelectedLayoutId: (id: Id<"productLayouts"> | null) => void;
  setOption: (categoryId: Id<"optionCategories">, choiceId: Id<"optionChoices">, categoryLabel?: string, choiceLabel?: string) => void;
  reset: () => void;
};

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const useConfiguratorStore = create<Store>((set) => ({
  currentStep: 0,
  totalSteps: 1,
  selectedProductId: null,
  selectedLayoutId: null,
  selectedOptions: [],
  sessionId: typeof window === "undefined" ? "" : generateSessionId(),

  setCurrentStep: (step) => set({ currentStep: step }),
  setTotalSteps: (n) => set({ totalSteps: n }),
  setSelectedProductId: (id) => set({ selectedProductId: id, selectedLayoutId: null }),
  setSelectedLayoutId: (id) => set({ selectedLayoutId: id }),
  setOption: (categoryId, choiceId, categoryLabel?, choiceLabel?) =>
    set((state) => {
      const filtered = state.selectedOptions.filter(
        (o) => o.categoryId !== categoryId
      );
      return {
        selectedOptions: [
          ...filtered,
          { categoryId, choiceId, categoryLabel: categoryLabel ?? categoryId, choiceLabel: choiceLabel ?? choiceId },
        ],
      };
    }),
  reset: () =>
    set({
      currentStep: 0,
      selectedProductId: null,
      selectedLayoutId: null,
      selectedOptions: [],
    }),
}));
