import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "@/app/globals.css";

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
  title: "Doctor Haus — Apple Cabin",
  description: "Apple Cabin: mini casa modulare prefabbricata dal design arrotondato.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${nunito.variable} ${inter.variable}`} style={{ colorScheme: "light" }}>

      <body className="min-h-screen flex flex-col bg-background text-text antialiased">
        {children}
      </body>
    </html>
  );
}
