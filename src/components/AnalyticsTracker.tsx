"use client";

import { usePageviewTracking, useClickTracking } from "@/lib/analytics";

export default function AnalyticsTracker({ locale }: { locale: string }) {
  usePageviewTracking(locale);
  useClickTracking();
  return null;
}
