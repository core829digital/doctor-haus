import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "it" ? "Termini di Utilizzo | Doctor Haus" : "Terms of Use | Doctor Haus",
  };
}

export default async function TerminiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = locale === "it" ? {
    title: "Termini di Utilizzo",
    sections: [
      { title: "Accettazione dei termini", content: "L'utilizzo del sito web Doctor Haus implica l'accettazione dei presenti termini di utilizzo. Se non accetti questi termini, ti preghiamo di non utilizzare il sito." },
      { title: "Contenuto del sito", content: "Tutti i contenuti presenti sul sito (testi, immagini, loghi, video) sono di proprietà di Doctor Haus o concessi in licenza e sono protetti dalle leggi sul diritto d'autore." },
      { title: "Utilizzo del sito", content: "È vietato utilizzare il sito per scopi illeciti o non autorizzati. Non puoi modificare, copiare, distribuire o creare opere derivate dai contenuti senza autorizzazione." },
      { title: "Limitazione di responsabilità", content: "Doctor Haus non sarà ritenuta responsabile per danni diretti o indiretti derivanti dall'utilizzo o dall'impossibilità di utilizzare il sito web." },
      { title: "Link a siti terzi", content: "Il sito può contenere link a siti web di terze parti. Doctor Haus non ha controllo su tali siti e non è responsabile per i loro contenuti o politiche sulla privacy." },
      { title: "Modifiche", content: "Doctor Haus si riserva il diritto di modificare i presenti termini in qualsiasi momento. Le modifiche saranno efficaci dalla data di pubblicazione sul sito." },
      { title: "Legge applicabile", content: "I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente il foro del luogo in cui ha sede il titolare del trattamento." },
    ],
  } : {
    title: "Terms of Use",
    sections: [
      { title: "Acceptance of terms", content: "By using the Doctor Haus website, you accept these terms of use. If you do not agree to these terms, please do not use the site." },
      { title: "Site content", content: "All content on the site (texts, images, logos, videos) is owned by or licensed to Doctor Haus and is protected by copyright laws." },
      { title: "Use of the site", content: "You may not use the site for any illegal or unauthorized purpose. You may not modify, copy, distribute or create derivative works from the content without authorization." },
      { title: "Limitation of liability", content: "Doctor Haus shall not be liable for any direct or indirect damages arising from the use or inability to use the website." },
      { title: "Links to third-party sites", content: "The site may contain links to third-party websites. Doctor Haus has no control over such sites and is not responsible for their content or privacy policies." },
      { title: "Changes", content: "Doctor Haus reserves the right to modify these terms at any time. Changes will be effective from the date of publication on the site." },
      { title: "Applicable law", content: "These terms are governed by Italian law. Any dispute shall be subject to the jurisdiction of the court where the data controller has its registered office." },
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
