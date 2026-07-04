import { setRequestLocale } from "next-intl/server";
import CookiePreferencesContent from "./CookiePreferencesContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Preferenze Cookie | Doctor Haus" : "Cookie Preferences | Doctor Haus",
  };
}

export default async function CookiePreferencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookiePreferencesContent locale={locale} />;
}
