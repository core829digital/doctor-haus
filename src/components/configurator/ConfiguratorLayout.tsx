"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfiguratorStore } from "@/lib/configurator-store";
import { StepDefinition } from "./useConfiguratorSteps";
import ConfigurationSummaryPanel from "./ConfigurationSummaryPanel";

type Props = {
  steps: StepDefinition[];
  children: ReactNode;
  locale: string;
};

export default function ConfiguratorLayout({ steps, children, locale }: Props) {
  const { currentStep, setCurrentStep } = useConfiguratorStore();
  const progress = steps.length > 1 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Progress bar */}
      <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-md border-b border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {steps.map((step, i) => {
              const isActive = i === currentStep;
              const isPast = i < currentStep;
              return (
                <button
                  key={step.slug}
                  onClick={() => {
                    if (isPast) setCurrentStep(i);
                  }}
                  className={`flex-shrink-0 text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-green-500"
                      : isPast
                      ? "text-text-muted hover:text-text"
                      : "text-text-muted/40"
                  }`}
                  disabled={!isPast && !isActive}
                >
                  <span className="hidden sm:inline">
                    {i + 1}. {step.label}
                  </span>
                  <span className="sm:hidden">
                    {i + 1}
                    {isActive && (
                      <span className="ml-1 text-green-500">
                        {step.label}
                      </span>
                    )}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="mx-2 text-text-muted/20">/</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="h-0.5 bg-line rounded-full">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar summary - desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-40">
              <ConfigurationSummaryPanel locale={locale} compact />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile summary drawer button */}
      <MobileSummaryDrawer locale={locale} />
    </div>
  );
}

function MobileSummaryDrawer({ locale }: { locale: string }) {
  return (
    <details className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      <summary className="flex items-center justify-between bg-background border-t border-line px-6 py-3 cursor-pointer text-sm font-medium text-text">
        {locale === "it" ? "Riepilogo configurazione" : "Configuration summary"}
        <span className="text-green-500 text-xs">▼</span>
      </summary>
      <div className="bg-background border-t border-line max-h-64 overflow-y-auto px-6 py-4">
        <ConfigurationSummaryPanel locale={locale} />
      </div>
    </details>
  );
}
