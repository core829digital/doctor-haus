import { setRequestLocale } from "next-intl/server";
import ContattiContent from "./ContattiContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Contattaci — Preventivo Mini Casa Modulare | Doctor Haus" : "Contact Us — Modular Mini House Quote | Doctor Haus",
    description:
      locale === "it"
        ? "Richiedi un preventivo gratuito per la tua mini casa modulare Apple Cabin, box espandibile o container. Il team Doctor Haus ti risponderà entro 24 ore."
        : "Request a free quote for your Apple Cabin modular mini home, expandable box or container. The Doctor Haus team will reply within 24 hours.",
  };
}

export default async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContattiContent locale={locale} />;
}
