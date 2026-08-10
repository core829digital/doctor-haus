import { setRequestLocale } from "next-intl/server";
import AccediContent from "./AccediContent";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Accedi | Doctor Haus" : "Sign In | Doctor Haus",
    alternates: buildAlternates(locale, "accedi"),
    robots: { index: false, follow: true },
  };
}

export default async function AccediPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AccediContent />;
}
