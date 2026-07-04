"use client";

import dynamic from "next/dynamic";
import ConvexClientProvider from "@/providers/ConvexClientProvider";

const ConfiguratoreContent = dynamic(
  () => import("./ConfiguratoreContent"),
  { ssr: false }
);

type Props = {
  locale: string;
  preselectedSlug?: string;
};

export default function ConfiguratoreClientWrapper({ locale, preselectedSlug }: Props) {
  return (
    <ConvexClientProvider>
      <ConfiguratoreContent locale={locale} preselectedSlug={preselectedSlug} />
    </ConvexClientProvider>
  );
}
