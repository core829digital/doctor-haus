"use client";

import { usePageviewTracking } from "@/lib/analytics";

export default function AnalyticsTracker({ locale }: { locale: string }) {
  usePageviewTracking(locale);
  return null;
}
