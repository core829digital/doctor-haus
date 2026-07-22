import { setRequestLocale } from "next-intl/server";
import CatalogoContent from "./CatalogoContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Catalogo | Doctor Haus" : "Catalog | Doctor Haus",
    description: locale === "it"
      ? "Scarica il catalogo PDF Doctor Haus con tutte le foto della Apple Cabin, box espandibili e soluzioni modulari. Galleria completa e richiesta catalogo personalizzato."
      : "Download the Doctor Haus PDF catalog with all photos of Apple Cabin, expandable boxes and modular solutions. Complete gallery and request a personalized catalog.",
  };
}

export default async function CatalogoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CatalogoContent locale={locale} />;
}
