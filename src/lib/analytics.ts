"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "analytics_session_id";
const TRACKING_ENABLED_KEY = "analytics_enabled";

function generateSessionId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = generateSessionId();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) {
    if (/tablet|ipad/i.test(ua)) return "tablet";
    return "mobile";
  }
  return "desktop";
}

function getMetadata(): string {
  const data: Record<string, string> = {
    deviceType: getDeviceType(),
    screenWidth: String(window.innerWidth),
    screenHeight: String(window.innerHeight),
    referrer: document.referrer || "",
    language: navigator.language,
    href: window.location.href,
    userAgent: navigator.userAgent.substring(0, 200),
  };
  return JSON.stringify(data);
}

async function track(type: string, page?: string, locale?: string, extraMeta?: Record<string, string>) {
  try {
    const { api } = await import("convex/_generated/api");
    const { fetchMutation } = await import("convex/nextjs");
    let meta = getMetadata();
    if (extraMeta) {
      const parsed = JSON.parse(meta);
      Object.assign(parsed, extraMeta);
      meta = JSON.stringify(parsed);
    }
    await fetchMutation(api.analytics.trackEvent, {
      type,
      page: page ?? window.location.pathname,
      locale: locale ?? (document.documentElement.lang || "it"),
      sessionId: getOrCreateSessionId(),
      metadata: meta,
    });
  } catch {
    // silently fail
  }
}

function getPageLabel(path: string): string {
  if (path === "/" || path === "/it" || path === "/en") return "homepage";
  const parts = path.split("/").filter(Boolean);
  if (parts.length >= 2 && (parts[0] === "it" || parts[0] === "en")) parts.shift();
  return parts.join("/") || "homepage";
}

export function usePageviewTracking(locale?: string) {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    const page = getPageLabel(pathname);
    track("pageview", page, locale);
  }, [pathname, locale]);
}

export function useClickTracking() {
  const handlerRef = useRef<((e: MouseEvent) => void) | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const button = target.closest("button");

      if (link) {
        const href = link.getAttribute("href") || "";
        const label = link.textContent?.trim().substring(0, 100) || "";
        track("click", getPageLabel(window.location.pathname), undefined, {
          target: href,
          label,
          tag: "a",
        });
      } else if (button) {
        const label = button.textContent?.trim().substring(0, 100) || button.getAttribute("aria-label") || "";
        const form = button.closest("form");
        if (form) return;
        track("click", getPageLabel(window.location.pathname), undefined, {
          target: "",
          label,
          tag: "button",
        });
      }
    };

    document.addEventListener("click", handler);
    handlerRef.current = handler;
    return () => {
      if (handlerRef.current) {
        document.removeEventListener("click", handlerRef.current);
      }
    };
  }, []);
}

export function trackFormSubmit(formName: string, locale?: string) {
  track("form_submit", getPageLabel(window.location.pathname), locale, {
    formName,
  });
}

export function trackCustomEvent(type: string, page?: string, locale?: string, extraMeta?: Record<string, string>) {
  track(type, page, locale, extraMeta);
}

export function trackConfiguratorAction(action: string, productName?: string) {
  track("configurator_action", "configuratore", undefined, {
    action,
    product: productName || "",
  });
}

export function trackRegistration(locale?: string) {
  track("registration", "registrati", locale);
}

export function trackLogin(type: "admin" | "customer", locale?: string) {
  track("login", "accedi", locale, { userType: type });
}
