import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import ProdottoContent from "./ProdottoContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "product" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function ProdottoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProdottoContent locale={locale} />;
}
