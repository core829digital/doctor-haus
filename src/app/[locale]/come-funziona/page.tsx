import { setRequestLocale } from "next-intl/server";
import ComeFunzionaContent from "./ComeFunzionaContent";
import { buildAlternates, buildBreadcrumbList } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === "it" ? "Acquisto e Installazione Mini Casa Modulare | Doctor Haus" : "Modular Mini House Purchase & Installation | Doctor Haus";
  const description = locale === "it"
    ? "Scopri come acquistare e installare una Apple Cabin: preventivo gratuito, produzione, trasporto e montaggio. Tempi di consegna e permessi necessari per la tua mini casa modulare da giardino. Apple Cabin consegna 6-8 settimane installazione chiavi in mano."
    : "Discover how to buy and install an Apple Cabin: free quote, production, transport and assembly. Delivery times and permits needed for your modular garden mini home. Apple Cabin 6-8 weeks delivery turnkey installation.";
  const keywordsIt = "acquisto installazione apple cabin, come comprare mini casa modulare, preventivo gratuito produzione trasporto, tempi consegna apple cabin, permessi installazione cabin, casa modulare chiavi in mano, box prefabbricati coibentati, BOX PREFABBRICATI COIBENTATI".trim();
  const keywordsEn = "apple cabin purchase installation, buy modular mini house, free quote production transport, apple cabin delivery times, installation permits, modular home turnkey, box prefabricated insulated, BOX PREFABBRICATED INSULATED".trim();
  const keywords = locale === "it" ? keywordsIt : keywordsEn;
  return {
    title,
    description,
    keywords,
    alternates: buildAlternates(locale, "come-funziona"),
  };
}

export default async function ComeFunzionaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const breadcrumb = buildBreadcrumbList(locale, [
    { name: locale === "it" ? "Come Funziona" : "How It Works", path: "come-funziona" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ComeFunzionaContent locale={locale} />
    </>
  );
}
