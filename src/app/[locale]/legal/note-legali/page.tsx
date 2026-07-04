import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Note Legali | Doctor Haus" : "Legal Notes | Doctor Haus",
  };
}

export default async function NoteLegaliPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "it" ? {
    title: "Note Legali",
    sections: [
      { title: "Identificazione del Titolare", content: "Doctor Haus [Inserire forma giuridica]\nSede legale: [INSERIRE INDIRIZZO COMPLETO]\nPartita IVA: [INSERIRE P.IVA]\nCodice Fiscale: [INSERIRE CODICE FISCALE]\nREA: [INSERIRE NUMERO REA]\nPEC: [INSERIRE PEC]\nEmail: info@doctor-haus.com" },
      { title: "Proprietà intellettuale", content: "Tutti i contenuti del sito (testi, immagini, loghi, marchi, design) sono di proprietà esclusiva di Doctor Haus e sono protetti dalle norme sul diritto d'autore e proprietà industriale." },
      { title: "Responsabilità", content: "Doctor Haus non è responsabile per eventuali danni derivanti dall'utilizzo del sito o dall'affidamento sulle informazioni in esso contenute. Le informazioni sono fornite a scopo informativo e possono essere soggette a modifiche senza preavviso." },
      { title: "Privacy", content: "Il trattamento dei dati personali è effettuato in conformità con il GDPR 2016/679 e la normativa nazionale applicabile. Per maggiori informazioni consulta la nostra Privacy Policy." },
      { title: "Cookie", content: "Questo sito utilizza cookie tecnici e analytics. Per maggiori informazioni consulta la nostra Cookie Policy e le Preferenze Cookie." },
      { title: "Contatti", content: "Per qualsiasi richiesta o segnalazione riguardante il sito o i contenuti, contattaci all'indirizzo email info@doctor-haus.com." },
    ],
  } : {
    title: "Legal Notes",
    sections: [
      { title: "Company Information", content: "Doctor Haus [Insert legal form]\nRegistered office: [INSERT FULL ADDRESS]\nVAT Number: [INSERT VAT NUMBER]\nTax Code: [INSERT TAX CODE]\nREA: [INSERT REA NUMBER]\nPEC: [INSERT PEC]\nEmail: info@doctor-haus.com" },
      { title: "Intellectual Property", content: "All content on this site (texts, images, logos, trademarks, designs) is the exclusive property of Doctor Haus and is protected by copyright and industrial property laws." },
      { title: "Liability", content: "Doctor Haus is not liable for any damages arising from the use of the site or reliance on the information contained therein. Information is provided for informational purposes and may be subject to change without notice." },
      { title: "Privacy", content: "The processing of personal data is carried out in accordance with GDPR 2016/679 and applicable national legislation. For more information see our Privacy Policy." },
      { title: "Cookies", content: "This site uses technical and analytics cookies. For more information see our Cookie Policy and Cookie Preferences." },
      { title: "Contact", content: "For any request or report regarding the site or its contents, contact us at info@doctor-haus.com." },
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
              <p className="text-text-muted leading-relaxed whitespace-pre-line">{section.content}</p>
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
