import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import RegistratiContent from "./RegistratiContent";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Registrati | Doctor Haus" : "Sign Up | Doctor Haus",
    alternates: buildAlternates(locale, "registrati"),
    robots: { index: false, follow: true },
  };
}

export default async function RegistratiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={null}>
      <RegistratiContent />
    </Suspense>
  );
}
