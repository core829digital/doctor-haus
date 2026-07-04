"use client";

import { motion } from "framer-motion";
import { MessageSquareText, FilePenLine, Factory, Truck } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const steps = [
  { icon: MessageSquareText, key: "consulenza" },
  { icon: FilePenLine, key: "progetto" },
  { icon: Factory, key: "produzione" },
  { icon: Truck, key: "installazione" },
];

const content = {
  it: {
    title: "Come Funziona",
    subtitle: "Dal progetto alla consegna, ti accompagniamo in ogni passo.",
    steps: [
      {
        title: "Consulenza iniziale",
        desc: "Parlaci del tuo progetto. Ti aiutiamo a scegliere la configurazione giusta, valutiamo il terreno e ti forniamo un preventivo chiaro e trasparente.",
        detail: "Puoi contattarci via form, telefono o email. Organizziamo una videochiamata per capire le tue esigenze e rispondere a ogni domanda.",
      },
      {
        title: "Progettazione personalizzata",
        desc: "I nostri architetti trasformano le tue idee in un progetto esecutivo. Scegli layout, finiture, colori e allestimenti interni.",
        detail: "Ogni Apple Cabin viene progettata su misura. Puoi personalizzare la disposizione degli spazi, i materiali, gli impianti e gli arredi.",
      },
      {
        title: "Produzione in stabilimento",
        desc: "La tua Apple Cabin viene costruita a regola d'arte nel nostro stabilimento con materiali certificati e processi a secco a basso impatto ambientale.",
        detail: "La produzione richiede 4-6 settimane. Ogni modulo viene sottoposto a controlli qualità prima della spedizione.",
      },
      {
        title: "Trasporto e installazione",
        desc: "Trasportiamo e installiamo la tua Apple Cabin nel sito prescelto. Consegna chiavi in mano in 6-8 settimane dall'ordine.",
        detail: "Il nostro team si occupa di tutto: trasporto, posizionamento, allacciamenti e collaudo finale. La tua casa è pronta per essere abitata.",
      },
    ],
  },
  en: {
    title: "How It Works",
    subtitle: "From project to delivery, we guide you through every step.",
    steps: [
      {
        title: "Initial Consultation",
        desc: "Tell us about your project. We help you choose the right configuration, evaluate the land and provide a clear and transparent quote.",
        detail: "You can contact us via form, phone or email. We organize a video call to understand your needs and answer every question.",
      },
      {
        title: "Custom Design",
        desc: "Our architects turn your ideas into an executive project. Choose layout, finishes, colors and interior fittings.",
        detail: "Each Apple Cabin is custom designed. You can customize the space layout, materials, systems and furniture.",
      },
      {
        title: "Factory Production",
        desc: "Your Apple Cabin is expertly built in our factory with certified materials and dry processes with low environmental impact.",
        detail: "Production takes 4-6 weeks. Each module undergoes quality checks before shipping.",
      },
      {
        title: "Transport & Installation",
        desc: "We transport and install your Apple Cabin at your chosen site. Turnkey delivery in 6-8 weeks from order.",
        detail: "Our team handles everything: transport, positioning, connections and final testing. Your home is ready to live in.",
      },
    ],
  },
};

export default function ComeFunzionaContent({ locale }: { locale: string }) {
  const c = content[locale === "it" ? "it" : "en"];

  return (
    <>
      <section className="relative pt-40 pb-24 lg:pb-32 bg-background">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-display font-semibold text-text leading-tight"
          >
            {c.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg text-text-muted max-w-xl mx-auto"
          >
            {c.subtitle}
          </motion.p>
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-line hidden sm:block" />
          <div className="space-y-16 lg:space-y-24">
            {c.steps.map((step, i) => {
              const Icon = steps[i].icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex flex-col sm:flex-row gap-6 sm:gap-10 items-start ${
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className="flex-shrink-0 relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border-2 border-green-500 sm:mx-auto">
                    <Icon size={20} className="text-green-500" />
                  </div>
                  <div className={`flex-1 ${isEven ? "sm:text-left" : "sm:text-right"}`}>
                    <span className="text-xs font-mono text-green-500 tracking-widest uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-xl lg:text-2xl font-display font-semibold text-text">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-text-muted leading-relaxed">{step.desc}</p>
                    <p className="mt-3 text-sm text-text-muted/70 leading-relaxed">{step.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
