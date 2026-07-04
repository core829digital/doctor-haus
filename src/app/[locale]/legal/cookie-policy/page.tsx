import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Cookie Policy | Doctor Haus" : "Cookie Policy | Doctor Haus",
  };
}

export default async function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "it" ? {
    title: "Cookie Policy",
    sections: [
      { title: "Cosa sono i cookie", content: "I cookie sono piccoli file di testo che i siti visitati inviano al tuo browser, dove vengono memorizzati per essere ritrasmessi durante le visite successive." },
      { title: "Cookie tecnici", content: "Utilizziamo cookie tecnici necessari al funzionamento del sito. Non richiedono il tuo consenso preventivo." },
      { title: "Cookie analytics", content: "Utilizziamo strumenti di analytics per comprendere come i visitatori interagiscono con il sito. Puoi disabilitarli nelle preferenze cookie." },
      { title: "Cookie di terze parti", content: "Il sito potrebbe incorporare contenuti di terze parti (Google Maps, video) che possono impostare propri cookie. Consulta le policy dei rispettivi fornitori." },
      { title: "Gestione dei cookie", content: "Puoi gestire le tue preferenze cookie in qualsiasi momento tramite il nostro Centro Preferenze Cookie o modificando le impostazioni del tuo browser." },
    ],
  } : {
    title: "Cookie Policy",
    sections: [
      { title: "What are cookies", content: "Cookies are small text files that visited websites send to your browser, where they are stored to be retransmitted on subsequent visits." },
      { title: "Technical cookies", content: "We use technical cookies necessary for the functioning of the site. They do not require your prior consent." },
      { title: "Analytics cookies", content: "We use analytics tools to understand how visitors interact with the site. You can disable them in cookie preferences." },
      { title: "Third-party cookies", content: "The site may incorporate third-party content (Google Maps, videos) that may set their own cookies. Consult the respective providers' policies." },
      { title: "Cookie management", content: "You can manage your cookie preferences at any time via our Cookie Preferences Center or by changing your browser settings." },
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
