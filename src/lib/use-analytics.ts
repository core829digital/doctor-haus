"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem("analytics_session_id");
  if (!sid) {
    sid = crypto.randomUUID?.() ?? Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("analytics_session_id", sid);
  }
  return sid;
}

export function useAnalytics() {
  const trackEvent = useMutation(api.analytics.trackEvent);
  const pathname = usePathname();
  const locale = useLocale();
  const lastPathRef = useRef<string>("");
  const sidRef = useRef<string>("");

  useEffect(() => {
    sidRef.current = getSessionId();
  }, []);

  useEffect(() => {
    if (!pathname || pathname === lastPathRef.current) return;
    lastPathRef.current = pathname;
    const timeout = setTimeout(() => {
      trackEvent({ type: "pageview", page: pathname, locale, sessionId: sidRef.current });
    }, 300);
    return () => clearTimeout(timeout);
  }, [pathname, locale, trackEvent]);

  const trackClick = useCallback(
    (label: string, metadata?: string) => {
      trackEvent({
        type: "click",
        page: pathname,
        locale,
        sessionId: sidRef.current,
        metadata: metadata ? `${label}::${metadata}` : label,
      });
    },
    [trackEvent, pathname, locale]
  );

  return { trackClick };
}
