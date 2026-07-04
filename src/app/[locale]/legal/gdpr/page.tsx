import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "GDPR | Doctor Haus" : "GDPR | Doctor Haus",
  };
}

export default async function GDPRPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "it" ? {
    title: "Regolamento Generale sulla Protezione dei Dati (GDPR)",
    sections: [
      { title: "Introduzione", content: "Doctor Haus si impegna a proteggere la privacy e i dati personali dei propri utenti in conformità con il Regolamento (UE) 2016/679 (GDPR)." },
      { title: "Principi del trattamento", content: "I dati personali sono trattati in modo lecito, corretto e trasparente; raccolti per finalità determinate, esplicite e legittime; adeguati, pertinenti e limitati a quanto necessario; esatti e aggiornati; conservati per un periodo non superiore a quello necessario; trattati in modo da garantire un'adeguata sicurezza." },
      { title: "Diritti degli interessati", content: "Ai sensi degli artt. 15-22 GDPR, l'interessato ha diritto di accesso, rettifica, cancellazione, limitazione, portabilità, opposizione e revoca del consenso in qualsiasi momento." },
      { title: "Misure di sicurezza", content: "Adottiamo misure tecniche e organizzative adeguate per garantire un livello di sicurezza proporzionato al rischio, inclusa la pseudonimizzazione, la crittografia e la gestione degli accessi." },
      { title: "Data Protection Officer (DPO)", content: "[DA COMPILARE] Il DPO può essere contattato all'indirizzo [INSERIRE EMAIL DPO]." },
      { title: "Reclami", content: "L'interessato ha diritto di proporre reclamo all'autorità di controllo competente (Garante per la Protezione dei Dati Personali) qualora ritenga che il trattamento violi il GDPR." },
    ],
  } : {
    title: "General Data Protection Regulation (GDPR)",
    sections: [
      { title: "Introduction", content: "Doctor Haus is committed to protecting the privacy and personal data of its users in accordance with Regulation (EU) 2016/679 (GDPR)." },
      { title: "Processing principles", content: "Personal data is processed lawfully, fairly and transparently; collected for specified, explicit and legitimate purposes; adequate, relevant and limited to what is necessary; accurate and kept up to date; kept for no longer than necessary; processed in a manner ensuring appropriate security." },
      { title: "Data subject rights", content: "Under Articles 15-22 GDPR, the data subject has the right to access, rectification, erasure, restriction, portability, objection and withdrawal of consent at any time." },
      { title: "Security measures", content: "We implement appropriate technical and organizational measures to ensure a level of security proportionate to the risk, including pseudonymization, encryption and access management." },
      { title: "Data Protection Officer (DPO)", content: "[TO BE COMPLETED] The DPO can be contacted at [INSERT DPO EMAIL]." },
      { title: "Complaints", content: "The data subject has the right to lodge a complaint with the competent supervisory authority if they believe that the processing violates the GDPR." },
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
