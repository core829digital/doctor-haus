import type { MetadataRoute } from "next";

const locales = ["it", "en"] as const;
const BASE = "https://doctor-haus.com";

const routes: Record<(typeof locales)[number], Record<string, number>> = {
  it: {
    "": 1,
    "chi-siamo": 0.8,
    "come-funziona": 0.8,
    "prodotto": 0.9,
    "configuratore": 0.8,
    "catalogo": 0.8,
    "altre-soluzioni": 0.7,
    "contatti": 0.7,
    "legal/privacy-policy": 0.4,
    "legal/cookie-policy": 0.3,
    "legal/gdpr": 0.3,
    "legal/trattamento-dati": 0.3,
    "legal/termini-di-utilizzo": 0.3,
    "legal/note-legali": 0.3,
    "legal/garanzia-e-recesso": 0.3,
    "legal/accessibilita": 0.2,
  },
  en: {
    "": 1,
    "chi-siamo": 0.8,
    "come-funziona": 0.8,
    "prodotto": 0.9,
    "configuratore": 0.8,
    "catalogo": 0.8,
    "altre-soluzioni": 0.7,
    "contatti": 0.7,
    "legal/privacy-policy": 0.4,
    "legal/cookie-policy": 0.3,
    "legal/gdpr": 0.3,
    "legal/trattamento-dati": 0.3,
    "legal/termini-di-utilizzo": 0.3,
    "legal/note-legali": 0.3,
    "legal/garanzia-e-recesso": 0.3,
    "legal/accessibilita": 0.2,
  },
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const localeRoutes = routes[locale];
    for (const [path, priority] of Object.entries(localeRoutes)) {
      const url = `${BASE}/${locale}${path ? `/${path}` : ""}`;

      const alternates: Record<string, string> = {};
      for (const altLocale of locales) {
        alternates[altLocale] = `${BASE}/${altLocale}${path ? `/${path}` : ""}`;
      }

      const isContent = path !== "" && !path.startsWith("legal/");

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: isContent ? ("weekly" as const) : ("monthly" as const),
        priority,
        alternates: {
          languages: {
            ...alternates,
            "x-default": `${BASE}/it${path ? `/${path}` : ""}`,
          },
        },
      });
    }
  }

  return entries;
}
