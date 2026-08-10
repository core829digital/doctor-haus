import type { MetadataRoute } from "next";

const DISALLOW = ["/api/", "/_next/", "/admin/", "/accedi", "/it/accedi", "/en/accedi", "/registrati", "/it/registrati", "/en/registrati", "/dashboard", "/it/dashboard", "/en/dashboard"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: "https://doctor-haus.com/sitemap.xml",
    host: "https://doctor-haus.com",
  };
}
