import { setRequestLocale } from "next-intl/server";
import AboutContent from "./AboutContent";
import { buildAlternates, buildBreadcrumbList } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Chi Siamo — Montaggi Srl | Doctor Haus" : "About Us — Montaggi Srl | Doctor Haus",
    description:
      locale === "it"
        ? "Doctor Haus è il brand di Montaggi Srl, con oltre 20 anni di esperienza nella progettazione e installazione di strutture modulari, box prefabbricati e mini case. Scopri la nostra storia."
        : "Doctor Haus is the brand of Montaggi Srl, with over 20 years of experience in designing and installing modular structures, prefabricated boxes and mini homes. Discover our story.",
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
