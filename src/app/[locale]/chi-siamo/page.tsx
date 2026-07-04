import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import AboutContent from "./AboutContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: locale === "it" ? "Chi Siamo" : "About Us",
    description:
      locale === "it"
        ? "Scopri la storia e la missione di Doctor Haus."
        : "Discover the story and mission of Doctor Haus.",
  };
}

export default async function ChiSiamoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent locale={locale} />;
}
