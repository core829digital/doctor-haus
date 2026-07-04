import { setRequestLocale } from "next-intl/server";
import ConfiguratoreClientWrapper from "./ConfiguratoreClientWrapper";

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
      ? "Configura la tua struttura modulare Doctor Haus. Scegli prodotto, finiture e personalizzazioni, poi richiedi un preventivo gratuito."
      : "Configure your Doctor Haus modular structure. Choose product, finishes and customizations, then request a free quote.";
  return {
    title,
    description,
    robots: { index: false, follow: true },
  };
}

export default async function ConfiguratorePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { prodotto } = await searchParams;
  setRequestLocale(locale);
  return <ConfiguratoreClientWrapper locale={locale} preselectedSlug={prodotto} />;
}
