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
      default: locale === "it"
        ? "Doctor Haus — Mini Casa Modulare Prefabbricata e Apple Cabin"
        : "Doctor Haus — Prefabricated Modular Mini House & Apple Cabin",
      template: "%s | Doctor Haus",
    },
    description: locale === "it"
      ? "Apple Cabin: mini casa modulare prefabbricata dal design arrotondato con vetrate a tutta altezza. Scopri prezzi, misure e personalizzazioni per la tua mini casa da giardino."
      : "Apple Cabin: prefabricated modular mini house with rounded design and full-height windows. Discover prices, sizes and customizations for your garden mini home.",
    metadataBase: new URL("https://doctor-haus.com"),
    alternates: {
      languages: {
        it: "/it",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "it" ? "it_IT" : "en_US",
      siteName: "Doctor Haus",
      title: locale === "it"
        ? "Doctor Haus — Mini Casa Modulare Prefabbricata e Apple Cabin"
        : "Doctor Haus — Prefabricated Modular Mini House & Apple Cabin",
      description: locale === "it"
        ? "Apple Cabin: mini casa modulare prefabbricata dal design arrotondato. Scopri prezzi e personalizzazioni per la tua mini casa da giardino."
        : "Apple Cabin: prefabricated modular mini house with rounded design. Discover prices and customizations for your garden mini home.",
      images: [
        {
          url: "/og-image.webp",
          width: 1200,
          height: 630,
          alt: "Doctor Haus",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: locale === "it"
        ? "Doctor Haus — Mini Casa Modulare Prefabbricata"
        : "Doctor Haus — Prefabricated Modular Mini House",
      description: locale === "it"
        ? "Apple Cabin: mini casa modulare prefabbricata di design. Richiedi un preventivo gratuito."
        : "Apple Cabin: designer prefabricated modular mini house. Request a free quote.",
      images: ["/og-image.webp"],
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

function StructuredData({ locale }: { locale: string }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Doctor Haus",
    alternateName: "Montaggi Srl",
    url: "https://doctor-haus.com",
    logo: "https://doctor-haus.com/doctorhauslogo.webp",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Via Mario Giuntini 95",
      addressLocality: "Cascina",
      addressRegion: "PI",
      postalCode: "56121",
      addressCountry: "IT",
    },
    vatID: "02293340507",
    email: "info@doctor-haus.com",
    telephone: "+39-370-164-1622",
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Apple Cabin",
    description: locale === "it"
      ? "Mini casa modulare prefabbricata di 12,5 m² dal design arrotondato con vetrate a tutta altezza"
      : "Prefabricated modular mini house of 12.5 m² with rounded design and full-height windows",
    brand: {
      "@type": "Brand",
      name: "Doctor Haus",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "EUR",
      price: "15000",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organizationSchema, productSchema]),
      }}
    />
  );
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
        <StructuredData locale={locale} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-green-700 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-2 focus:outline-green-500"
        >
          {locale === "it" ? "Vai al contenuto principale" : "Skip to main content"}
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </ConvexClientProvider>
    </NextIntlClientProvider>
  );
}
