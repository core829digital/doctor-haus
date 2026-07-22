import { setRequestLocale } from "next-intl/server";
import AltreSoluzioniContent from "./AltreSoluzioniContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title =
    locale === "it"
      ? "Box Espandibili, Container e Moduli Abitativi | Doctor Haus"
      : "Expandable Boxes, Containers & Living Modules | Doctor Haus";
  const description =
    locale === "it"
      ? "Box espandibili 20FT e 40FT, box container per cantiere, moduli abitativi due piani e cabine spaziali. Soluzioni modulari per ufficio prefabbricato, ricettività e abitazione. Richiedi un preventivo."
      : "20FT and 40FT expandable boxes, container boxes for construction sites, two-story living modules and space cabins. Modular solutions for prefab office, hospitality and housing. Request a quote.";
  return { title, description };
}

export default async function AltreSoluzioniPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AltreSoluzioniContent locale={locale} />;
}
