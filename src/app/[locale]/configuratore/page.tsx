import { setRequestLocale } from "next-intl/server";
import ConfiguratoreClientWrapper from "./ConfiguratoreClientWrapper";
import { buildAlternates } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ prodotto?: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title =
    locale === "it"
      ? "Configuratore | Doctor Haus"
      : "Configurator | Doctor Haus";
  const description =
    locale === "it"
      ? "Configura la tua struttura modulare Doctor Haus. Scegli prodotto, finiture e personalizzazioni, poi richiedi un preventivo gratuito. Apple Cabin, case modulari prefabbricate di design con vetrate arrotondate."
      : "Configure your Doctor Haus modular structure. Choose product, finishes and customizations, then request a free quote. Apple Cabin, designer prefabricated modular houses with rounded windows.";
  const keywordsIt = "configuratore apple cabin, designer house modulare, personalizza mini casa, preventivo casa modulare, apple cabin finiture, casa modulare personalizzata, moduli abitativi configurazione".trim();
  const keywordsEn = "apple cabin configurator, design modular house, customize mini house, modular house quote, apple cabin finishes, customized modular home, modular unit configuration".trim();
  const keywords = locale === "it" ? keywordsIt : keywordsEn;
  return {
    title,
    description,
    keywords,
    alternates: buildAlternates(locale, "configuratore"),
    robots: { index: false, follow: true },
  };
}

export default async function ConfiguratorePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { prodotto } = await searchParams;
  setRequestLocale(locale);
  return <ConfiguratoreClientWrapper locale={locale} preselectedSlug={prodotto} />;
}
