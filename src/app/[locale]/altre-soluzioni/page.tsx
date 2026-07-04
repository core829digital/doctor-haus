import { setRequestLocale } from "next-intl/server";
import AltreSoluzioniContent from "./AltreSoluzioniContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title =
    locale === "it"
      ? "Altre Soluzioni Modulari | Box Container, Cabina Spaziale, Modulo Abitativo — Doctor Haus"
      : "Other Modular Solutions | Container Box, Space Cabin, Living Module — Doctor Haus";
  const description =
    locale === "it"
      ? "Oltre alla Apple Cabin, Doctor Haus seleziona, fornisce e installa box espandibili, box container, moduli abitativi e cabine spaziali per cantiere, ufficio e ricettività."
      : "Beyond the Apple Cabin, Doctor Haus selects, supplies and installs expandable boxes, container boxes, living modules and space cabins for construction sites, offices and hospitality.";
  return { title, description };
}

export default async function AltreSoluzioniPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AltreSoluzioniContent locale={locale} />;
}
