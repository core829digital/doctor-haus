import { setRequestLocale } from "next-intl/server";
import CookiePreferencesContent from "./CookiePreferencesContent";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Preferenze Cookie | Doctor Haus" : "Cookie Preferences | Doctor Haus",
    alternates: buildAlternates(locale, "cookie-preferences"),
    robots: { index: false, follow: true },
  };
}

export default async function CookiePreferencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookiePreferencesContent locale={locale} />;
}
