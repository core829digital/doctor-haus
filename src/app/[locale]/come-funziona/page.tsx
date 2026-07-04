import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import ComeFunzionaContent from "./ComeFunzionaContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Come Funziona | Doctor Haus" : "How It Works | Doctor Haus",
    description:
      locale === "it"
        ? "Scopri il processo di acquisto e installazione della Apple Cabin in 4 semplici passi."
        : "Discover the Apple Cabin purchase and installation process in 4 simple steps.",
  };
}

export default async function ComeFunzionaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComeFunzionaContent locale={locale} />;
}
