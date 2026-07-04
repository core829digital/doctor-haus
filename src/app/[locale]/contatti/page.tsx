import { setRequestLocale } from "next-intl/server";
import ContattiContent from "./ContattiContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Contatti | Doctor Haus" : "Contact | Doctor Haus",
    description:
      locale === "it"
        ? "Contatta Doctor Haus per richiedere un preventivo o ricevere informazioni sulla Apple Cabin."
        : "Contact Doctor Haus to request a quote or get information about Apple Cabin.",
  };
}

export default async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContattiContent locale={locale} />;
}
