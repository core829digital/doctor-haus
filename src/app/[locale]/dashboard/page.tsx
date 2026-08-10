import { setRequestLocale } from "next-intl/server";
import DashboardContent from "./DashboardContent";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Dashboard | Doctor Haus" : "Dashboard | Doctor Haus",
    alternates: buildAlternates(locale, "dashboard"),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DashboardContent />;
}
