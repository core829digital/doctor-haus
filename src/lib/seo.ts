const BASE = "https://doctor-haus.com";
const locales = ["it", "en"] as const;

/**
 * Builds canonical + hreflang alternates for a given locale/path.
 * localePrefix is "always" (see src/i18n/routing.ts), so every locale
 * -including it, the default- is served under /it or /en.
 */
export function buildAlternates(locale: string, path: string = "") {
  const suffix = path ? `/${path}` : "";
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${BASE}/${l}${suffix}`;
  }
  languages["x-default"] = `${BASE}/it${suffix}`;

  return {
    canonical: `${BASE}/${locale}${suffix}`,
    languages,
  };
}

/** Builds a BreadcrumbList JSON-LD schema for a page. `items` excludes Home. */
export function buildBreadcrumbList(
  locale: string,
  items: { name: string; path: string }[]
) {
  const homeLabel = locale === "it" ? "Home" : "Home";
  const listItems = [
    { "@type": "ListItem", position: 1, name: homeLabel, item: `${BASE}/${locale}` },
    ...items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: item.name,
      item: `${BASE}/${locale}/${item.path}`,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: listItems,
  };
}
