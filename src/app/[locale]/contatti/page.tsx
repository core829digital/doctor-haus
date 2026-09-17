import { setRequestLocale } from "next-intl/server";
import ContattiContent from "./ContattiContent";
import { buildAlternates, buildBreadcrumbList } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const title = locale === "it" ? "Contattaci — Preventivo Mini Casa Modulare | Doctor Haus" : "Contact Us — Modular Mini House Quote | Doctor Haus";
  const description = locale === "it"
    ? "Richiedi un preventivo gratuito per la tua mini casa modulare Apple Cabin, box espandibile o container. Il team Doctor Haus ti risponderà entro 24 ore. Apple Cabin, case modulari prefabbricate design giardino resort."
    : "Request a free quote for your Apple Cabin modular mini home, expandable box or container. The Doctor Haus team will reply within 24 hours. Apple Cabin, designer prefabricated modular houses for garden resort.";
  const keywordsIt = "contatti doctor haus, richiedi preventivo apple cabin, contatto mini casa modulare, apple cabin preventivo, informazioni casa prefabbricata, preventivo gratuito modulare, box prefabbricati coibentati, BOX PREFABBRICATI COIBENTATI".trim();
  const keywordsEn = "doctor haus contact, request apple cabin quote, modular mini house contact, apple cabin information, prefabricated house quote, free quote modular, box prefabricated insulated, BOX PREFABBRICATED INSULATED".trim();
  const keywords = locale === "it" ? keywordsIt : keywordsEn;
  return {
    title,
    description,
    keywords,
    alternates: buildAlternates(locale, "contatti"),
  };
}

export default async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const breadcrumb = buildBreadcrumbList(locale, [
    { name: locale === "it" ? "Contatti" : "Contact", path: "contatti" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <ContattiContent locale={locale} />
    </>
  );
}
