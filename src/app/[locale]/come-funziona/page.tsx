import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import ComeFunzionaContent from "./ComeFunzionaContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Acquisto e Installazione Mini Casa Modulare | Doctor Haus" : "Modular Mini House Purchase & Installation | Doctor Haus",
    description:
      locale === "it"
        ? "Scopri come acquistare e installare una Apple Cabin: preventivo gratuito, produzione, trasporto e montaggio. Tempi di consegna e permessi necessari per la tua mini casa modulare da giardino."
        : "Discover how to buy and install an Apple Cabin: free quote, production, transport and assembly. Delivery times and permits needed for your modular garden mini home.",
  };
}

export default async function ComeFunzionaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComeFunzionaContent locale={locale} />;
}
