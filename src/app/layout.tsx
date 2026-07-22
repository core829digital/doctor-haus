import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "@/app/globals.css";
import ImageProtection from "@/components/ImageProtection";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://doctor-haus.com"),
  title: "Doctor Haus — Mini Casa Modulare Prefabbricata e Apple Cabin",
  description: "Apple Cabin: mini casa modulare prefabbricata dal design arrotondato. Scopri prezzi, misure e personalizzazioni per la tua mini casa da giardino.",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${nunito.variable} ${inter.variable}`} style={{ colorScheme: "light" }}>

      <body className="min-h-screen flex flex-col bg-background text-text antialiased">
        <ImageProtection />
        {children}
      </body>
    </html>
  );
}
