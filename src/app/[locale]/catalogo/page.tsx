import { setRequestLocale } from "next-intl/server";
import CatalogoContent from "./CatalogoContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Catalogo | Doctor Haus" : "Catalog | Doctor Haus",
    description: locale === "it"
      ? "Esplora il catalogo completo Doctor Haus: Apple Cabin, box espandibili, box container e tutte le soluzioni modulari. Scarica i cataloghi PDF e scopri i nostri prodotti."
      : "Browse the complete Doctor Haus catalog: Apple Cabin, expandable boxes, container boxes and all modular solutions. Download PDF catalogs and discover our products.",
  };
}

export default async function CatalogoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CatalogoContent locale={locale} />;
}
