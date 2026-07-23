"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Expand,
  Container,
  Building2,
  Satellite,
  Truck,
  Shield,
  Ruler,
  Weight,
  Layout,
  Check,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const content = {
  it: {
    eyebrow: "Oltre la Apple Cabin",
    heroTitle: "Altre soluzioni Doctor Haus",
    heroDesc:
      "La Apple Cabin nasce dalla stessa competenza che per oltre vent'anni ci ha permesso di installare uffici temporanei, cantieri, depositi e strutture modulari per aziende e privati in tutta Italia. Se hai un'esigenza diversa da una mini casa abitativa — uno spazio per il cantiere, un ufficio provvisorio, un punto vendita mobile — trovi qui le altre linee che selezioniamo, forniamo e installiamo.",
    sections: [
      {
        badge: "Uffici e spazi abitativi rapidi da montare",
        title: "Box espandibili: più spazio, stesso ingombro di trasporto",
        intro:
          "Il box espandibile arriva chiuso, nelle dimensioni compatte di un container standard, e si apre lateralmente una volta posizionato — guadagnando fino a quasi il triplo della superficie interna senza bisogno di ulteriori lavorazioni in cantiere. È la soluzione giusta quando serve uno spazio abitabile completo (soggiorno, camere, bagno, cucina) con tempi di consegna e installazione molto ridotti rispetto a una costruzione tradizionale.",
        products: [
          {
            name: "Box Espandibile 20FT",
            specs: [
              { label: "Dimensioni chiuso", value: "5900 × 2300 × 2430 mm" },
              { label: "Dimensioni aperto", value: "5900 × 6320 × 2430 mm" },
              { label: "Superficie abitabile", value: "37,2 m²" },
              { label: "Peso", value: "4,5 t" },
            ],
            layout:
              "Da monolocale con cucina a vista fino a soggiorno + 2 camere da letto + bagno",
          },
          {
            name: "Box Espandibile 40FT",
            specs: [
              { label: "Dimensioni chiuso", value: "11380 × 2300 × 2430 mm" },
              { label: "Dimensioni aperto", value: "11380 × 6320 × 2430 mm" },
              { label: "Superficie abitabile", value: "71,9 m²" },
              { label: "Peso", value: "7,9 t" },
            ],
            layout:
              "Soggiorno + fino a 3 camere da letto + bagno + cucina a vista, ideale anche per uso ricettivo o come alloggio per più persone",
          },
        ],
        closing:
          "Entrambe le versioni sono disponibili in diverse finiture esterne (bianco, grigio, effetto legno, blu scuro) e possono essere completate con tetto a falda, veranda coperta e terrazza perimetrale su richiesta.",
        microCta: "Richiedi le planimetrie complete",
      },
      {
        badge: "Soluzioni rapide per cantiere, ufficio, deposito",
        title: "Box container: solidità e velocità di installazione",
        intro:
          "Quando la priorità è avere uno spazio funzionante nel minor tempo possibile — un ufficio di cantiere, un deposito attrezzi, un presidio temporaneo — la linea box container offre tre modalità di montaggio diverse, per adattarsi a esigenze di trasporto, budget e tempistiche differenti.",
        products: [
          {
            name: "Box in Kit Fai Da Te",
            specs: [
              { label: "Dimensioni", value: "3000 × 6000 × 2896 mm" },
              { label: "Superficie", value: "18 m²" },
              {
                label: "Montaggio",
                value:
                  "Arriva in kit componibile con pannelli, struttura e coperture separate; il montaggio può essere seguito direttamente dal cliente o assistito dal nostro team",
              },
            ],
            note: "Disponibile anche in versione a 2 piani, con scala esterna e struttura sovrapponibile per raddoppiare la superficie a parità di ingombro a terra",
          },
          {
            name: "Box Smontabile",
            specs: [
              { label: "Dimensioni", value: "2438 × 5950 × 2896 mm" },
              { label: "Superficie", value: "14,5 m²" },
              {
                label: "Montaggio",
                value:
                  "Struttura pre-assemblata in fabbrica che si monta e smonta rapidamente in loco, senza opere murarie",
              },
            ],
            note: "Dalla versione tecnica in pannello bianco/grigio alla versione con rivestimento in legno scuro e vetrate, per un uso anche rappresentativo (ufficio ricevimento, sala campionario)",
          },
          {
            name: "Box Pieghevole (Z-Folding)",
            specs: [
              {
                label: "Versione grande",
                value: "L 2438 × 5850 × H 2620 mm — 14,3 m²",
              },
              {
                label: "Versione compatta",
                value: "L 2438 × 3850 × H 2620 mm — 9,4 m²",
              },
              {
                label: "Montaggio",
                value:
                  "Il box viaggia completamente ripiegato su se stesso \"a soffietto\" e si apre in pochi minuti direttamente sul posto — la soluzione più rapida quando il trasporto è la variabile critica",
              },
            ],
          },
        ],
        microCta: "Confronta le tre modalità di montaggio con noi",
      },
      {
        badge: "Soluzione compatta multi-livello",
        title: "Modulo abitativo: sviluppo verticale, minimo ingombro a terra",
        intro:
          "Dove lo spazio a terra è limitato ma serve comunque un ambiente abitativo completo, il modulo a due piani distribuisce zona giorno e zona notte su due livelli collegati da una scala esterna, con balcone e terrazza al piano superiore.",
        products: [
          {
            name: "Modulo a Due Piani",
            specs: [
              {
                label: "Dimensioni pianta",
                value:
                  "2438 × 2438 mm per piano (5850 mm lato totale)",
              },
              {
                label: "Piano terra",
                value: "Bagno, zona living / camera",
              },
              {
                label: "Primo piano",
                value:
                  "Camera da letto con accesso diretto al balcone esterno",
              },
              {
                label: "Copertura",
                value: "Tetto a falda con sporto che ripara la terrazza",
              },
            ],
          },
        ],
        microCta: "È la soluzione giusta per il tuo terreno? Scrivici",
      },
      {
        badge: "Design avanzato per ricettività e ospitalità",
        title:
          "Cabina Spaziale: quando il design diventa parte dell'esperienza",
        intro:
          "Nata dalla stessa filosofia costruttiva della Apple Cabin ma con un linguaggio estetico più tecnologico e scenico — grandi vetrate curve, profili aerodinamici, illuminazione LED perimetrale — la Cabina Spaziale è pensata soprattutto per progetti di ospitalità e ricettività dove l'unità stessa diventa un'attrazione: glamping di fascia alta, resort, strutture ricettive vista lago, montagna o campagna.",
        products: [
          {
            name: "Capsula Spaziale G5",
            specs: [
              { label: "Dimensioni", value: "8500 × 3300 × 3300 mm" },
              { label: "Superficie", value: "28 m²" },
              { label: "Capacità", value: "2 persone" },
              { label: "Peso stimato", value: "7 t" },
              {
                label: "Layout",
                value:
                  "Zona bagno, zona notte con letto matrimoniale, angolo relax",
              },
            ],
          },
          {
            name: "Cabina Spaziale G7",
            specs: [
              { label: "Dimensioni", value: "11500 × 3300 × 3300 mm" },
              { label: "Superficie", value: "38 m²" },
              { label: "Capacità", value: "2 persone" },
              { label: "Peso stimato", value: "9 t" },
              {
                label: "Layout",
                value:
                  "Zona living separata con angolo cottura, bagno, zona notte con letto matrimoniale — la versione pensata per soggiorni più lunghi",
              },
            ],
          },
        ],
        closing:
          "Entrambe le versioni sono già state utilizzate in progetti di ospitalità in contesti naturalistici molto diversi tra loro — dalla prateria alla costa, dalla montagna innevata al bordo lago — a conferma della versatilità del sistema costruttivo anche in condizioni climatiche impegnative.",
        microCta:
          "Stai progettando una struttura ricettiva? Parliamone",
      },
      {
        badge: "Attività commerciale su ruote",
        title: "Food Trailer Mobile: la tua attività, ovunque tu voglia portarla",
        intro:
          "Per chi lavora nella ristorazione mobile, nel catering o nella vendita ambulante, offriamo unità su ruote pronte all'uso, allestibili come punto vendita food & beverage, chiosco o postazione commerciale itinerante.",
        products: [
          {
            name: "Food Trailer Mobile",
            specs: [
              {
                label: "Versione mobile",
                value:
                  "Su ruote / rimorchio per uso completamente itinerante",
              },
              {
                label: "Versione fissa",
                value:
                  "Disponibile anche non su ruote, nelle stesse taglie 20FT e 40FT della linea box espandibile, per uso stanziale come punto vendita o chiosco su strada",
              },
            ],
          },
        ],
        microCta: "Configura il tuo food trailer",
      },
    ],
    materialsTitle:
      "Ogni soluzione condivide gli stessi standard costruttivi",
    materialsIntro:
      "Indipendentemente dalla linea scelta, tutte le nostre strutture nascono dagli stessi materiali tecnici selezionati per isolamento, durata e sicurezza.",
    materialCategories: [
      {
        title: "Pannello per pareti",
        items: [
          {
            label: "Lana di roccia",
            desc: "Isolamento termico eccellente, forte riduzione del rumore, materiale incombustibile con ottima resistenza al fuoco. Disponibile in spessori 50/75/100 mm.",
          },
          {
            label: "EPS (poliestere espanso)",
            desc: "Buone prestazioni di isolamento, struttura leggera a bassa densità che riduce il peso complessivo, buona resistenza alla compressione.",
          },
        ],
      },
      {
        title: "Rivestimento per pareti",
        items: [
          {
            label: "Pannello in fibra di bambù",
            desc: "Realizzato con fibre naturali di bambù e legno, ecologico, esteticamente elegante, anticorrosivo e impermeabile: adatto anche ad ambienti umidi. Disponibile in 9 varianti (tinte chiare, grigie, beige, effetto legno chiaro/scuro, effetto tessuto).",
          },
          {
            label: "Pannello isolante in metallo",
            desc: "Resistente al freddo e termoisolante, antisismico e resistente alle crepe, impermeabile con buon effetto ignifugo. Disponibile in 12 varianti (tinte unite, effetto legno, effetto mattone/pietra, effetto marmo).",
          },
        ],
      },
      {
        title: "Porte e finestre",
        items: [
          {
            label: "Finestre",
            desc: "PVC rinforzato · lega di alluminio · alluminio a taglio termico",
          },
          {
            label: "Porte",
            desc: "Acciaio · doppio vetro · scorrevole",
          },
        ],
      },
      {
        title: "Pavimentazione",
        items: [
          {
            label: "PVC",
            desc: "Alta resistenza a usura e urti, ecologico e atossico, ottima resistenza ad acqua e umidità. 5 varianti colore.",
          },
          {
            label: "SPC",
            desc: "Buone prestazioni antiscivolo, posa a incastro senza colla, eccellente resistenza all'abrasione. 5 varianti colore.",
          },
        ],
      },
      {
        title: "Bagno",
        items: [
          {
            label: "Configurazioni disponibili",
            desc: "Bagno integrato (blocco doccia + sanitari compatto), bagno unico (doccia, wc e lavabo in un solo ambiente) e bagno con zona doccia separata (soluzione più curata, con rivestimenti anche effetto marmo).",
          },
        ],
      },
    ],
    finalCtaTitle: "Non hai trovato la configurazione giusta?",
    finalCtaDesc:
      "Ogni progetto che seguiamo parte da un confronto diretto: dimensioni del terreno, uso previsto, tempistiche, budget. Raccontaci cosa ti serve e ti aiutiamo a capire quale soluzione — Apple Cabin compresa — è quella giusta per te.",
    finalCtaPrimary: "Contattaci per una consulenza gratuita",
    finalCtaSecondary: "Torna alla Apple Cabin",
  },
  en: {
    eyebrow: "Beyond the Apple Cabin",
    heroTitle: "Other Doctor Haus Solutions",
    heroDesc:
      "The Apple Cabin is born from the same expertise that for over twenty years has allowed us to install temporary offices, construction sites, storage units and modular structures for companies and private clients across Italy. If you need something different from a mini residential home — a space for a construction site, a temporary office, a mobile retail point — you will find here the other lines we select, supply and install.",
    sections: [
      {
        badge: "Rapid-assembly living and office spaces",
        title: "Expandable boxes: more space, same transport footprint",
        intro:
          "The expandable box arrives closed, in the compact dimensions of a standard container, and opens laterally once positioned — gaining up to nearly triple the internal surface area without the need for additional on-site work. It is the right solution when you need a complete living space (living room, bedrooms, bathroom, kitchen) with much shorter delivery and installation times compared to traditional construction.",
        products: [
          {
            name: "20FT Expandable Box",
            specs: [
              { label: "Closed dimensions", value: "5900 × 2300 × 2430 mm" },
              { label: "Open dimensions", value: "5900 × 6320 × 2430 mm" },
              { label: "Living area", value: "37.2 m²" },
              { label: "Weight", value: "4.5 t" },
            ],
            layout:
              "From studio with open kitchen to living room + 2 bedrooms + bathroom",
          },
          {
            name: "40FT Expandable Box",
            specs: [
              { label: "Closed dimensions", value: "11380 × 2300 × 2430 mm" },
              { label: "Open dimensions", value: "11380 × 6320 × 2430 mm" },
              { label: "Living area", value: "71.9 m²" },
              { label: "Weight", value: "7.9 t" },
            ],
            layout:
              "Living room + up to 3 bedrooms + bathroom + open kitchen, ideal also for hospitality or multi-person accommodation",
          },
        ],
        closing:
          "Both versions are available in different exterior finishes (white, grey, wood effect, dark blue) and can be completed with pitched roof, covered veranda and perimeter terrace on request.",
        microCta: "Request complete floor plans",
      },
      {
        badge: "Quick solutions for construction site, office, storage",
        title: "Container boxes: solidity and installation speed",
        intro:
          "When the priority is to have a functioning space in the shortest possible time — a site office, a tool storage, a temporary outpost — the container box line offers three different assembly methods to suit transport needs, budget and timing.",
        products: [
          {
            name: "DIY Kit Box",
            specs: [
              { label: "Dimensions", value: "3000 × 6000 × 2896 mm" },
              { label: "Surface area", value: "18 m²" },
              {
                label: "Assembly",
                value:
                  "Arrives as a component kit with separate panels, structure and roofing; assembly can be carried out directly by the customer or assisted by our team",
              },
            ],
            note: "Also available in a 2-story version, with external staircase and stackable structure to double the surface area with the same ground footprint",
          },
          {
            name: "Demountable Box",
            specs: [
              { label: "Dimensions", value: "2438 × 5950 × 2896 mm" },
              { label: "Surface area", value: "14.5 m²" },
              {
                label: "Assembly",
                value:
                  "Pre-assembled factory structure that can be quickly assembled and disassembled on site, without masonry work",
              },
            ],
            note: "From the technical version in white/grey panel to the version with dark wood cladding and glazing, suitable also for representative use (reception office, showroom)",
          },
          {
            name: "Folding Box (Z-Folding)",
            specs: [
              {
                label: "Large version",
                value: "L 2438 × 5850 × H 2620 mm — 14.3 m²",
              },
              {
                label: "Compact version",
                value: "L 2438 × 3850 × H 2620 mm — 9.4 m²",
              },
              {
                label: "Assembly",
                value:
                  'The box travels completely folded on itself "accordion-style" and opens in minutes directly on site — the fastest solution when transport is the critical variable',
              },
            ],
          },
        ],
        microCta: "Compare the three assembly methods with us",
      },
      {
        badge: "Compact multi-level solution",
        title: "Living module: vertical development, minimum ground footprint",
        intro:
          "Where ground space is limited but a complete living environment is still needed, the two-story module distributes the living and sleeping areas over two levels connected by an external staircase, with balcony and terrace on the upper floor.",
        products: [
          {
            name: "Two-Story Module",
            specs: [
              {
                label: "Floor plan",
                value: "2438 × 2438 mm per floor (5850 mm total side)",
              },
              {
                label: "Ground floor",
                value: "Bathroom, living area / bedroom",
              },
              {
                label: "First floor",
                value: "Bedroom with direct access to the external balcony",
              },
              {
                label: "Roof",
                value: "Pitched roof with overhang that shelters the terrace",
              },
            ],
          },
        ],
        microCta: "Is this the right solution for your land? Write us",
      },
      {
        badge: "Advanced design for hospitality",
        title:
          "Space Cabin: when design becomes part of the experience",
        intro:
          "Born from the same construction philosophy as the Apple Cabin but with a more technological and scenic aesthetic language — large curved windows, aerodynamic profiles, perimeter LED lighting — the Space Cabin is designed especially for hospitality projects where the unit itself becomes an attraction: high-end glamping, resorts, lakeside, mountain or countryside retreats.",
        products: [
          {
            name: "Space Capsule G5",
            specs: [
              { label: "Dimensions", value: "8500 × 3300 × 3300 mm" },
              { label: "Surface area", value: "28 m²" },
              { label: "Capacity", value: "2 people" },
              { label: "Estimated weight", value: "7 t" },
              {
                label: "Layout",
                value:
                  "Bathroom area, bedroom with double bed, relaxation corner",
              },
            ],
          },
          {
            name: "Space Cabin G7",
            specs: [
              { label: "Dimensions", value: "11500 × 3300 × 3300 mm" },
              { label: "Surface area", value: "38 m²" },
              { label: "Capacity", value: "2 people" },
              { label: "Estimated weight", value: "9 t" },
              {
                label: "Layout",
                value:
                  "Separate living area with kitchenette, bathroom, bedroom with double bed — the version designed for longer stays",
              },
            ],
          },
        ],
        closing:
          "Both versions have already been used in hospitality projects in very different natural settings — from prairie to coastline, from snowy mountains to lakeside — confirming the versatility of the construction system even in challenging climatic conditions.",
        microCta: "Planning a hospitality structure? Let's talk",
      },
      {
        badge: "Mobile commercial business",
        title:
          "Food Trailer Mobile: your business, wherever you want to take it",
        intro:
          "For those working in mobile catering, food service or street vending, we offer ready-to-use wheeled units that can be set up as a food & beverage point of sale, kiosk or itinerant commercial station.",
        products: [
          {
            name: "Food Trailer Mobile",
            specs: [
              {
                label: "Mobile version",
                value: "On wheels / trailer for fully itinerant use",
              },
              {
                label: "Fixed version",
                value:
                  "Also available without wheels, in the same 20FT and 40FT sizes as the expandable box line, for stationary use as a point of sale or roadside kiosk",
              },
            ],
          },
        ],
        microCta: "Configure your food trailer",
      },
    ],
    materialsTitle:
      "Every solution shares the same construction standards",
    materialsIntro:
      "Regardless of the line chosen, all our structures are built from the same technical materials selected for insulation, durability and safety.",
    materialCategories: [
      {
        title: "Wall panel",
        items: [
          {
            label: "Rock wool",
            desc: "Excellent thermal insulation, strong noise reduction, non-combustible material with good fire resistance. Available in thicknesses 50/75/100 mm.",
          },
          {
            label: "EPS (expanded polystyrene)",
            desc: "Good insulation performance, lightweight low-density structure that reduces overall weight, good compression resistance.",
          },
        ],
      },
      {
        title: "Wall cladding",
        items: [
          {
            label: "Bamboo fiber panel",
            desc: "Made from natural bamboo and wood fibers, eco-friendly, aesthetically elegant, anti-corrosion and waterproof: suitable even for humid environments. Available in 9 variants (light tones, grey, beige, light/dark wood effect, fabric effect).",
          },
          {
            label: "Insulating metal panel",
            desc: "Cold-resistant and thermally insulating, anti-seismic and crack-resistant, waterproof with good fire-retardant properties. Available in 12 variants (solid colors, wood effect, brick/stone effect, marble effect).",
          },
        ],
      },
      {
        title: "Doors and windows",
        items: [
          {
            label: "Windows",
            desc: "Reinforced PVC · aluminum alloy · thermal break aluminum",
          },
          {
            label: "Doors",
            desc: "Steel · double glazing · sliding",
          },
        ],
      },
      {
        title: "Flooring",
        items: [
          {
            label: "PVC",
            desc: "High resistance to wear and impact, eco-friendly and non-toxic, excellent resistance to water and humidity. 5 color variants.",
          },
          {
            label: "SPC",
            desc: "Good anti-slip performance, click-lock glue-free installation, excellent abrasion resistance. 5 color variants.",
          },
        ],
      },
      {
        title: "Bathroom",
        items: [
          {
            label: "Available configurations",
            desc: "Integrated bathroom (compact shower + sanitary block), single bathroom (shower, WC and washbasin in one room) and bathroom with separate shower area (the more refined solution, with marble-effect finishes also available).",
          },
        ],
      },
    ],
    finalCtaTitle: "Didn't find the right configuration?",
    finalCtaDesc:
      "Every project we follow starts from a direct conversation: land dimensions, intended use, timing, budget. Tell us what you need and we will help you figure out which solution — Apple Cabin included — is right for you.",
    finalCtaPrimary: "Contact us for a free consultation",
    finalCtaSecondary: "Back to the Apple Cabin",
  },
};

const productSlugs: Record<string, string> = {
  "Box Espandibile 20FT": "box-espandibile-20ft",
  "Box Espandibile 40FT": "box-espandibile-40ft",
  "Box in Kit Fai Da Te": "box-kit-fai-da-te",
  "Box Smontabile": "box-smontabile",
  "Box Pieghevole (Z-Folding)": "box-pieghevole-z-folding",
  "Modulo a Due Piani": "modulo-abitativo-2-piani",
  "Modulo abitativo a due piani": "modulo-abitativo-2-piani",
  "Capsula Spaziale G5": "cabina-spaziale-g5",
  "Cabina Spaziale G7": "cabina-spaziale-g7",
  "Food Trailer Mobile": "food-trailer-mobile",
  "20FT Expandable Box": "box-espandibile-20ft",
  "40FT Expandable Box": "box-espandibile-40ft",
  "DIY Kit Box": "box-kit-fai-da-te",
  "Demountable Box": "box-smontabile",
  "Folding Box (Z-Folding)": "box-pieghevole-z-folding",
  "Two-Story Module": "modulo-abitativo-2-piani",
  "Space Capsule G5": "cabina-spaziale-g5",
  "Space Cabin G7": "cabina-spaziale-g7",
};

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block text-xs font-mono text-green-500 tracking-[0.2em] uppercase mb-4">
      {label}
    </span>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-line last:border-0">
      <span className="text-sm text-text-muted flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-text text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function AltreSoluzioniContent({ locale }: { locale: string }) {
  const c = locale === "it" ? content.it : content.en;

  return (
    <>
      <section className="relative pt-40 pb-24 lg:pb-32 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-mono text-green-500 tracking-[0.2em] uppercase mb-6"
          >
            {c.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-display font-semibold text-text leading-tight"
          >
            {c.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-base lg:text-lg text-text-muted max-w-3xl mx-auto leading-relaxed"
          >
            {c.heroDesc}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/contatti"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
            >
              Parliamo del tuo progetto
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {c.sections.map((section, sIdx) => (
        <SectionWrapper key={sIdx} alt={sIdx % 2 === 1}>
          <Badge label={section.badge} />
          <SectionTitle
            title={section.title}
            align="left"
            subtitle={
              section.intro.length > 200 ? undefined : section.intro
            }
            className="!mb-8"
          />
          {section.intro.length > 200 && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-base lg:text-lg text-text-muted leading-relaxed max-w-4xl mb-12"
            >
              {section.intro}
            </motion.p>
          )}
          {sIdx === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mb-12">
              {["1", "2", "7", "25"].map((id, i) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="overflow-hidden rounded-xl bg-background-alt border border-line aspect-[4/3]"
                >
                  <img
                    src={`/images/expandable/webp/${id}.webp`}
                    alt={`Box espandibile Doctor Haus ${id} — modulo prefabbricato espandibile`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 pointer-events-none select-none"
                    loading="lazy"
                    draggable={false}
                  />
                </motion.div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl">
            {section.products.map((product, pIdx) => (
              <motion.div
                key={pIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: pIdx * 0.1 }}
                className="bg-background rounded-2xl border border-line p-6 lg:p-8"
              >
                <h3 className="text-lg lg:text-xl font-display font-semibold text-text mb-4">
                  {product.name}
                </h3>
                <div className="space-y-0">
                  {product.specs.map((spec, j) => (
                    <SpecRow
                      key={j}
                      label={spec.label}
                      value={spec.value}
                    />
                  ))}
                </div>
                {"layout" in product && product.layout && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <span className="text-xs font-mono text-green-500 tracking-wider uppercase">
                      {locale === "it" ? "Layout" : "Layout"}
                    </span>
                    <p className="mt-1.5 text-sm text-text-muted leading-relaxed">
                      {product.layout}
                    </p>
                  </div>
                )}
                {"note" in product && product.note && (
                  <div className="mt-4 pt-4 border-t border-line">
                    <p className="text-sm text-text-muted leading-relaxed">
                      <span className="font-medium text-text">
                        {locale === "it" ? "Nota:" : "Note:"}
                      </span>{" "}
                      {product.note}
                    </p>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-line">
                  <Link
                    href={`/configuratore?prodotto=${productSlugs[product.name] ?? ""}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-green-500 hover:text-green-600 transition-colors"
                  >
                    {locale === "it" ? "Configura" : "Configure"}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          {section.closing && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-sm text-text-muted leading-relaxed max-w-4xl italic"
            >
              {section.closing}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link
              href="/contatti"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              {section.microCta}
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </SectionWrapper>
      ))}

      <SectionWrapper alt={c.sections.length % 2 === 1}>
        <Badge label={locale === "it" ? "La stessa qualità costruttiva su tutta la gamma" : "The same build quality across the range"} />
        <SectionTitle title={c.materialsTitle} subtitle={c.materialsIntro} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {c.materialCategories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-background rounded-2xl border border-line p-6 lg:p-8"
            >
              <h3 className="text-base font-display font-semibold text-text mb-4">
                {cat.title}
              </h3>
              <div className="space-y-4">
                {cat.items.map((item, j) => (
                  <div key={j} className="pb-3 border-b border-line last:border-0 last:pb-0">
                    <span className="text-sm font-medium text-text block">
                      {item.label}
                    </span>
                    <span className="text-sm text-text-muted mt-0.5 block leading-relaxed">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-b from-green-50/50 to-transparent rounded-3xl p-12 lg:p-16 border border-line"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/doctorhauslogo.webp" alt="Doctor Haus" className="w-10 h-10 pointer-events-none select-none" width={1350} height={1350} draggable={false} />
            <span className="text-xl font-display font-bold text-text">Doctor Haus</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-text mb-4">
            {c.finalCtaTitle}
          </h2>
          <p className="text-text-muted mb-8 max-w-lg mx-auto leading-relaxed">
            {c.finalCtaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
            >
              {c.finalCtaPrimary}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/prodotto"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              {c.finalCtaSecondary}
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </SectionWrapper>
    </>
  );
}
