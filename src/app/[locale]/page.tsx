import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/sections/HeroSection";
import ProblemiSection from "@/components/sections/ProblemiSection";
import SoluzioneSection from "@/components/sections/SoluzioneSection";
import ProdottoTeaserSection from "@/components/sections/ProdottoTeaserSection";
import AmbientazioniSection from "@/components/sections/AmbientazioniSection";
import ProcessoSection from "@/components/sections/ProcessoSection";
import SostenibilitaSection from "@/components/sections/SostenibilitaSection";
import FiduciaSection from "@/components/sections/FiduciaSection";
import FAQSection from "@/components/sections/FAQSection";
import CTAFinaleSection from "@/components/sections/CTAFinaleSection";
import TrailCanvas from "@/components/sections/TrailCanvas";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <div className="relative z-10 bg-background">
        <ProblemiSection />
        <SoluzioneSection />
        <ProdottoTeaserSection />
        <AmbientazioniSection />
        <ProcessoSection />
        <SostenibilitaSection />
        <FiduciaSection />
        <FAQSection />
        <CTAFinaleSection />
        <TrailCanvas />
      </div>
    </>
  );
}
