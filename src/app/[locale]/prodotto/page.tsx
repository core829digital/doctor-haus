import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import ProdottoContent from "./ProdottoContent";
import { buildAlternates, buildBreadcrumbList } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "product" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: buildAlternates(locale, "prodotto"),
  };
}

export default async function ProdottoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const breadcrumb = buildBreadcrumbList(locale, [
    { name: locale === "it" ? "Prodotto" : "Product", path: "prodotto" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ProdottoContent locale={locale} />
    </>
  );
}
