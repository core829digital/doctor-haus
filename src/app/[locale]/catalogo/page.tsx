import { setRequestLocale } from "next-intl/server";
import CatalogoContent from "./CatalogoContent";
import { buildAlternates, buildBreadcrumbList } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === "it" ? "Catalogo | Doctor Haus" : "Catalog | Doctor Haus";
  const description = locale === "it"
    ? "Scarica il catalogo PDF Doctor Haus con tutte le foto della Apple Cabin, box espandibili e soluzioni modulari. Galleria completa e richiesta catalogo personalizzato. Apple Cabin prezzi misure modelli disponibili."
    : "Download the Doctor Haus PDF catalog with all photos of Apple Cabin, expandable boxes and modular solutions. Complete gallery and request a personalized catalog. Apple Cabin prices sizes available models.";
  const keywordsIt = "catalogo doctor haus, scarica catalogo apple cabin, pdf catalogo modulare, galleria foto apple cabin, modelli casa prefabbricata, catalogo prezzi misure, box prefabbricati coibentati, BOX PREFABBRICATI COIBENTATI".trim();
  const keywordsEn = "doctor haus catalog, download apple cabin catalog, modular house gallery, prefabricated house models, catalog prices sizes, apple cabin photos, box prefabricated insulated, BOX PREFABBRICATED INSULATED".trim();
  const keywords = locale === "it" ? keywordsIt : keywordsEn;
  return {
    title,
    description,
    keywords,
    alternates: buildAlternates(locale, "catalogo"),
  };
}

export default async function CatalogoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const breadcrumb = buildBreadcrumbList(locale, [
    { name: locale === "it" ? "Catalogo" : "Catalog", path: "catalogo" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <CatalogoContent locale={locale} />
    </>
  );
}
