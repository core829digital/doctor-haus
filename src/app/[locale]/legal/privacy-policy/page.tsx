import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Privacy Policy | Doctor Haus" : "Privacy Policy | Doctor Haus",
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "it" ? {
    title: "Privacy Policy",
    sections: [
      { title: "Titolare del trattamento", content: "Il titolare del trattamento dei dati è Montaggi Srl, con sede legale in Via Mario Giuntini 95, 56121 Cascina (PI), P.IVA 02293340507. Per esercitare i tuoi diritti puoi scrivere a info@doctor-haus.com." },
      { title: "Dati raccolti", content: "Raccogliamo i dati personali che ci fornisci volontariamente tramite il form contatti (nome, email, telefono, messaggio) e dati tecnici di navigazione (cookie tecnici e analytics)." },
      { title: "Finalità del trattamento", content: "I tuoi dati vengono trattati per: rispondere alle tue richieste di informazioni e preventivi; finalità amministrative e contabili; adempimento di obblighi di legge; invio di comunicazioni marketing previo tuo consenso esplicito." },
      { title: "Base giuridica", content: "Il trattamento si basa sul tuo consenso (art. 6 par. 1 lett. a GDPR), sull'esecuzione di misure precontrattuali (art. 6 par. 1 lett. b GDPR) e sugli obblighi legali (art. 6 par. 1 lett. c GDPR)." },
      { title: "Conservazione dei dati", content: "I dati vengono conservati per il tempo necessario alle finalità indicate e comunque non oltre 10 anni dalla raccolta per finalità amministrative, salvo diverso obbligo di legge." },
      { title: "Diritti dell'interessato", content: "Hai diritto di: accedere ai tuoi dati, rettificarli, cancellarli, limitarne il trattamento, opporti al trattamento, richiedere la portabilità, revocare il consenso in qualsiasi momento." },
      { title: "Comunicazione dei dati", content: "I tuoi dati potranno essere comunicati a soggetti terzi (consulenti, autorità) solo per adempimento di obblighi di legge o per la corretta esecuzione del rapporto contrattuale." },
      { title: "Trasferimento dati", content: "I dati non vengono trasferiti al di fuori dello Spazio Economico Europeo. Qualora ciò fosse necessario, verranno adottate le garanzie adeguate previste dal GDPR." },
    ],
  } : {
    title: "Privacy Policy",
    sections: [
      { title: "Data Controller", content: "The data controller is Montaggi Srl, with registered office at Via Mario Giuntini 95, 56121 Cascina (PI), Italy, VAT 02293340507. To exercise your rights you can write to info@doctor-haus.com." },
      { title: "Data collected", content: "We collect personal data that you voluntarily provide through the contact form (name, email, phone, message) and technical browsing data (technical and analytics cookies)." },
      { title: "Purpose of processing", content: "Your data is processed for: responding to your information and quote requests; administrative and accounting purposes; compliance with legal obligations; sending marketing communications with your explicit consent." },
      { title: "Legal basis", content: "Processing is based on your consent (Art. 6 para. 1(a) GDPR), performance of pre-contractual measures (Art. 6 para. 1(b) GDPR), and legal obligations (Art. 6 para. 1(c) GDPR)." },
      { title: "Data retention", content: "Data is retained for the time necessary for the indicated purposes and in any case no longer than 10 years from collection for administrative purposes, unless otherwise required by law." },
      { title: "Your rights", content: "You have the right to: access your data, rectify it, delete it, restrict processing, object to processing, request portability, withdraw consent at any time." },
      { title: "Data disclosure", content: "Your data may be disclosed to third parties (consultants, authorities) only for compliance with legal obligations or for the correct execution of the contractual relationship." },
      { title: "Data transfer", content: "Data is not transferred outside the European Economic Area. Should this be necessary, appropriate safeguards under GDPR will be adopted." },
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
