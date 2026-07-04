import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Garanzia e Recesso | Doctor Haus" : "Warranty & Returns | Doctor Haus",
  };
}

export default async function GaranziaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "it" ? {
    title: "Garanzia e Recesso",
    sections: [
      { title: "Garanzia sulla struttura", content: "La struttura portante della Apple Cabin è coperta da garanzia di 10 anni. La garanzia copre i vizi strutturali e i difetti di fabbricazione." },
      { title: "Garanzia sui componenti", content: "I componenti tecnici (impianto elettrico, idraulico, climatizzazione) sono coperti da garanzia del produttore di 2 anni. I materiali e le finiture sono coperti da garanzia di 2 anni." },
      { title: "Condizioni di garanzia", content: "La garanzia è valida a condizione che l'installazione sia effettuata dal personale autorizzato Doctor Haus e che la manutenzione ordinaria sia regolarmente eseguita secondo il manuale fornito." },
      { title: "Diritto di recesso", content: "Per gli acquisti effettuati da consumatori, il diritto di recesso può essere esercitato entro 14 giorni dalla conclusione del contratto, ai sensi del D.Lgs. 206/2005 (Codice del Consumo). Trattandosi di beni realizzati su misura, il recesso potrebbe essere soggetto a limitazioni previste dall'art. 59 del Codice del Consumo." },
      { title: "Procedura di recesso", content: "Per esercitare il diritto di recesso, è necessario inviare una comunicazione scritta via email a [INSERIRE EMAIL] o tramite PEC a [INSERIRE PEC], utilizzando il modulo tipo di recesso disponibile su richiesta." },
      { title: "Esclusioni", content: "La garanzia non copre: danni derivanti da uso improprio, manutenzione inadeguata, modifiche non autorizzate, eventi atmosferici eccezionali, normale usura." },
    ],
  } : {
    title: "Warranty & Returns",
    sections: [
      { title: "Structural warranty", content: "The load-bearing structure of Apple Cabin is covered by a 10-year warranty. The warranty covers structural defects and manufacturing faults." },
      { title: "Component warranty", content: "Technical components (electrical, plumbing, climate control) are covered by a 2-year manufacturer's warranty. Materials and finishes are covered by a 2-year warranty." },
      { title: "Warranty conditions", content: "The warranty is valid provided that installation is carried out by Doctor Haus authorized personnel and that ordinary maintenance is regularly performed according to the provided manual." },
      { title: "Right of withdrawal", content: "For purchases made by consumers, the right of withdrawal may be exercised within 14 days from the conclusion of the contract, pursuant to Legislative Decree 206/2005 (Consumer Code). Since these are custom-made goods, withdrawal may be subject to limitations under Article 59 of the Consumer Code." },
      { title: "Withdrawal procedure", content: "To exercise the right of withdrawal, you must send a written communication via email to [INSERT EMAIL] or via PEC to [INSERT PEC], using the standard withdrawal form available upon request." },
      { title: "Exclusions", content: "The warranty does not cover: damages resulting from improper use, inadequate maintenance, unauthorized modifications, exceptional weather events, normal wear and tear." },
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
