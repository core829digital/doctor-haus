"use client";

import { motion } from "framer-motion";
import { House, Leaf, Heart, Star } from "lucide-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const values = [
  { icon: House, key: "design" },
  { icon: Leaf, key: "sostenibilita" },
  { icon: Heart, key: "cura" },
  { icon: Star, key: "innovazione" },
];

const content = {
  it: {
    title: "Chi Siamo",
    subtitle: "Da oltre 20 anni trasformiamo spazi in soluzioni abitative.",
    story: [
      "Da oltre 20 anni lavoriamo nel montaggio e nell'installazione di strutture mobili: uffici temporanei, presidi operativi, depositi, punti informativi, soluzioni per giardini e spazi esterni. Ogni progetto ci ha insegnato qualcosa di nuovo.",
      "Con il tempo siamo passati da semplici installatori a fornitori completi. Oggi selezioniamo, forniamo e installiamo box mobili, seguendo ogni fase — dalla scelta del prodotto alla consegna chiavi in mano. È stata l'esperienza diretta dei nostri clienti a guidarci in questa evoluzione: cercavano un interlocutore unico, che li accompagnasse dall'acquisto all'installazione finale.",
      "Nasce così Doctor Haus: una risposta all'esigenza di qualità, affidabilità e competenza tecnica. La Apple Cabin è il nostro prodotto principale, ma il nostro vero mestiere è ascoltare, consigliare e realizzare la soluzione giusta per ogni persona.",
    ],
    values: [
      { title: "Affidabilità", desc: "Oltre 20 anni di esperienza sul campo ci hanno insegnato che la parola data è il fondamento di ogni rapporto professionale." },
      { title: "Competenza tecnica", desc: "Selezioniamo personalmente ogni materiale e componente, garantendo standard costruttivi elevati in ogni installazione." },
      { title: "Attenzione al cliente", desc: "Ogni progetto è seguito dall'inizio alla fine con lo stesso interlocutore. Nessun passaggio di consegne, nessuna sorpresa." },
      { title: "Visione completa", desc: "Dalla consulenza iniziale all'installazione finale: un unico referente per tutto il processo." },
    ],
    mission: "La nostra missione",
    missionText: "Offrire soluzioni abitative modulari di qualità, sostenibili e flessibili, senza i costi e i tempi della costruzione tradizionale — accompagnando ogni cliente con competenza e trasparenza, dall'acquisto alla consegna chiavi in mano.",
  },
  en: {
    title: "About Us",
    subtitle: "Over 20 years turning spaces into living solutions.",
    story: [
      "For over 20 years we have been working in the assembly and installation of mobile structures: temporary offices, operational facilities, storage units, information points, garden and outdoor solutions. Every project taught us something new.",
      "Over time, we evolved from simple installers to complete suppliers. Today we select, supply and install mobile boxes, following every phase — from product choice to turnkey delivery. It was our clients' direct experience that guided this evolution: they were looking for a single point of contact to accompany them from purchase to final installation.",
      "Thus Doctor Haus was born: an answer to the need for quality, reliability and technical expertise. The Apple Cabin is our main product, but our real skill is listening, advising and building the right solution for each person.",
    ],
    values: [
      { title: "Reliability", desc: "Over 20 years of field experience taught us that keeping our word is the foundation of every professional relationship." },
      { title: "Technical expertise", desc: "We personally select every material and component, ensuring high construction standards in every installation." },
      { title: "Customer care", desc: "Every project is followed from start to finish by the same contact. No handovers, no surprises." },
      { title: "Complete vision", desc: "From initial consultation to final installation: one single point of contact for the entire process." },
    ],
    mission: "Our mission",
    missionText: "To offer quality modular living solutions, sustainable and flexible, without the costs and times of traditional construction — accompanying every client with expertise and transparency, from purchase to turnkey delivery.",
  },
};

export default function AboutContent({ locale }: { locale: string }) {
  const c = locale === "it" ? content.it : content.en;

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
        <div className="max-w-3xl mx-auto space-y-6 text-base lg:text-lg text-text-muted leading-relaxed">
          {c.story.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper alt>
        <SectionTitle title={c.mission} subtitle={c.missionText} />
      </SectionWrapper>

      <SectionWrapper>
        <SectionTitle title={c.values[0].title.split(" ")[0] + "..."} subtitle="" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {c.values.map((val, i) => {
            const Icon = values[i].icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <Icon size={22} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold text-text mb-2">{val.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
}
