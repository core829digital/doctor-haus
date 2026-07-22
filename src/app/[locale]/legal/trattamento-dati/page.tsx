import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Trattamento Dati | Doctor Haus" : "Data Processing | Doctor Haus",
  };
}

export default async function TrattamentoDatiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "it" ? {
    title: "Trattamento dei Dati Personali",
    sections: [
      { title: "Informazioni generali", content: "La presente informativa descrive le modalità di trattamento dei dati personali degli utenti che consultano il sito web di Doctor Haus." },
      { title: "Categoria di dati trattati", content: "Dati forniti volontariamente dall'utente (nome, cognome, email, telefono, messaggio) e dati di navigazione raccolti automaticamente (indirizzo IP, browser, pagine visitate)." },
      { title: "Base giuridica e finalità", content: "Il trattamento è basato sul consenso dell'interessato, sull'esecuzione di misure precontrattuali e sull'adempimento di obblighi di legge. I dati sono utilizzati per erogare i servizi richiesti, gestire le richieste di contatto e informare su prodotti e servizi." },
      { title: "Modalità del trattamento", content: "Il trattamento è effettuato con strumenti informatici e telematici, mediante operazioni di raccolta, registrazione, organizzazione, conservazione, consultazione, elaborazione e cancellazione." },
      { title: "Periodo di conservazione", content: "I dati sono conservati per il tempo strettamente necessario al perseguimento delle finalità per cui sono stati raccolti, in conformità con gli obblighi di legge." },
      { title: "Comunicazione e diffusione", content: "I dati non sono soggetti a diffusione pubblica. Possono essere comunicati a soggetti terzi solo per adempimenti contrattuali o obblighi di legge." },
    ],
  } : {
    title: "Personal Data Processing",
    sections: [
      { title: "General information", content: "This notice describes how Doctor Haus processes the personal data of users who visit our website." },
      { title: "Categories of data processed", content: "Data voluntarily provided by the user (name, surname, email, phone, message) and browsing data collected automatically (IP address, browser, visited pages)." },
      { title: "Legal basis and purposes", content: "Processing is based on the consent of the data subject, performance of pre-contractual measures and compliance with legal obligations. Data is used to provide requested services, manage contact requests and inform about products and services." },
      { title: "Processing methods", content: "Processing is carried out using IT and telematic tools, through operations of collection, registration, organization, storage, consultation, processing and deletion." },
      { title: "Retention period", content: "Data is retained for the time strictly necessary to pursue the purposes for which it was collected, in compliance with legal obligations." },
      { title: "Communication and disclosure", content: "Data is not subject to public disclosure. It may be communicated to third parties only for contractual obligations or legal requirements." },
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
          Documento in fase di revisione legale. Per qualsiasi richiesta, contattaci a info@doctor-haus.com.
        </p>
      </div>
    </div>
  );
}
