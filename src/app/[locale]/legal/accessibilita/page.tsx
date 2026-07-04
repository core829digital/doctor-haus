import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Accessibilità | Doctor Haus" : "Accessibility | Doctor Haus",
  };
}

export default async function AccessibilitaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "it" ? {
    title: "Dichiarazione di Accessibilità",
    sections: [
      { title: "Il nostro impegno", content: "Doctor Haus si impegna a rendere il proprio sito web accessibile a tutti gli utenti, indipendentemente dalle loro capacità o disabilità. Lavoriamo costantemente per migliorare l'esperienza di navigazione di ogni visitatore." },
      { title: "Conformità", content: "Il nostro sito web è progettato per essere conforme alle Linee guida per l'accessibilità dei contenuti Web (WCAG) 2.1, livello AA. Queste linee guida definiscono come rendere i contenuti web più accessibili per le persone con disabilità." },
      { title: "Caratteristiche di accessibilità", content: "Il sito utilizza: un contrasto cromatico adeguato per garantire la leggibilità; una struttura semantica chiara con titoli e sottotitoli; testi alternativi per le immagini (in fase di implementazione); navigazione tramite tastiera; supporto per screen reader; layout responsive per diversi dispositivi e dimensioni dello schermo." },
      { title: "Limitazioni", content: "Alcune sezioni del sito potrebbero non essere completamente accessibili. Stiamo lavorando per risolvere eventuali problemi e migliorare l'esperienza utente per tutti. [DA COMPILARE CON EVENTUALI LIMITAZIONI SPECIFICHE]" },
      { title: "Contattaci", content: "Se incontri difficoltà nell'accesso ai contenuti del sito o hai suggerimenti per migliorare l'accessibilità, ti preghiamo di contattarci all'indirizzo email info@doctor-haus.com. Faremo il possibile per fornirti le informazioni nel formato più accessibile." },
    ],
  } : {
    title: "Accessibility Statement",
    sections: [
      { title: "Our commitment", content: "Doctor Haus is committed to making its website accessible to all users, regardless of their abilities or disabilities. We constantly work to improve the browsing experience for every visitor." },
      { title: "Conformance", content: "Our website is designed to conform to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. These guidelines define how to make web content more accessible to people with disabilities." },
      { title: "Accessibility features", content: "The site uses: adequate color contrast to ensure readability; clear semantic structure with headings and subheadings; alternative texts for images (under implementation); keyboard navigation; screen reader support; responsive layout for different devices and screen sizes." },
      { title: "Limitations", content: "Some sections of the site may not be fully accessible. We are working to resolve any issues and improve the user experience for everyone. [TO BE COMPLETED WITH ANY SPECIFIC LIMITATIONS]" },
      { title: "Contact us", content: "If you encounter difficulties accessing site content or have suggestions for improving accessibility, please contact us at info@doctor-haus.com. We will do our best to provide you with the information in the most accessible format." },
    ],
  };

  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-3xl lg:text-4xl font-display font-semibold text-text mb-12">{content.title}</h1>
        <div className="space-y-10">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-display font-semibold text-text mb-3">{section.title}</h2>
              <p className="text-text-muted leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
        <p className="mt-16 text-xs text-text-muted border-t border-line pt-6">
          [DA COMPILARE CON AVVOCATO O COMMERCIALISTA DEL CLIENTE]
        </p>
      </div>
    </div>
  );
}
