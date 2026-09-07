import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { buildAlternates, buildBreadcrumbList } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === "it" ? "Chi Siamo — Montaggi Srl | Doctor Haus" : "About Us — Montaggi Srl | Doctor Haus";
  const description = locale === "it"
    ? "Doctor Haus è il brand di Montaggi Srl, con oltre 20 anni di esperienza nella progettazione e installazione di strutture modulari, box prefabbricati e mini case Apple Cabin. Scopri la nostra storia, la nostra filosofia e il nostro team di esperti nel settore delle case modulari di design."
    : "Doctor Haus is the brand of Montaggi Srl, with over 20 years of experience in designing and installing modular structures, prefabricated boxes and Apple Cabin mini homes. Discover our story, our philosophy and our team of experts in the modular home design sector.";
  const keywordsIt = "chi siamo doctor haus, storia montaggi srl, esperienza case modulari, brand apple cabin italia, progettazione strutture modulari, team esperti case prefabbricate".trim();
  const keywordsEn = "doctor haus story, montaggi srl experience, modular house design, apple cabin italy brand, prefabricated house design, modular home experts team".trim();
  const keywords = locale === "it" ? keywordsIt : keywordsEn;
  return {
    title,
    description,
    keywords,
    alternates: buildAlternates(locale, "chi-siamo"),
  };
}

export default async function ChiSiamoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const breadcrumb = buildBreadcrumbList(locale, [
    { name: locale === "it" ? "Chi Siamo" : "About Us", path: "chi-siamo" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <AboutContent locale={locale} />
    </>
  );
}
