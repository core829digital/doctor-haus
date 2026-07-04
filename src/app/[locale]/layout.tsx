import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<import("next").Metadata> {
  const { locale } = await params;
  
  return {
    title: {
      default: "Doctor Haus — Apple Cabin",
      template: "%s | Doctor Haus",
    },
    description: locale === "it"
      ? "Apple Cabin: mini casa modulare prefabbricata dal design arrotondato, vetrate a tutta altezza e materiali sostenibili."
      : "Apple Cabin: prefabricated modular mini house with rounded design, full-height windows and sustainable materials.",
    metadataBase: new URL("https://doctor-haus.com"),
    alternates: {
      canonical: "/",
      languages: {
        it: "/it",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
      siteName: "Doctor Haus",
      title: "Doctor Haus — Apple Cabin",
      description: locale === "it"
        ? "Apple Cabin: mini casa modulare prefabbricata dal design arrotondato."
        : "Apple Cabin: prefabricated modular mini house with rounded design.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Doctor Haus — Apple Cabin",
      description: locale === "it"
        ? "Apple Cabin: mini casa modulare prefabbricata."
        : "Apple Cabin: prefabricated modular mini house.",
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: "[INSERIRE CODICE VERIFICA GOOGLE SEARCH CONSOLE]",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "it" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ConvexClientProvider>
        <AnalyticsTracker locale={locale} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </ConvexClientProvider>
    </NextIntlClientProvider>
  );
}
