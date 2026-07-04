import { internalMutation } from "./_generated/server";

export const seed = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return;

    // ── Products ──────────────────────────────────────────

    const appleCabin = await ctx.db.insert("products", {
      slug: "apple-cabin",
      family: "Apple Cabin",
      name: "Apple Cabin",
      description:
        "La Apple Cabin è una mini casa modulare prefabbricata dal design arrotondato, con grandi vetrate scorrevoli a tutta altezza e materiali sostenibili. Prodotta con struttura in acciaio zincato e legno lamellare, è completamente personalizzabile nei layout interni e nelle finiture.",
      dimensions: { lengthMm: 4200, widthMm: 6500, heightMm: 3200 },
      areaSqm: 12.5,
      weightTons: 3.5,
      capacityPersons: "1-2 persone",
      isFeatured: true,
      sortOrder: 1,
      active: true,
    });

    const boxEsp20 = await ctx.db.insert("products", {
      slug: "box-espandibile-20ft",
      family: "Box Espandibile",
      name: "Box Espandibile 20FT",
      description:
        "Box espandibile 20 piedi: chiuso nelle dimensioni container standard (5900×2300×2430 mm), si apre lateralmente fino a 37,2 m² abitabili.",
      dimensions: { lengthMm: 5900, widthMm: 2300, heightMm: 2430 },
      dimensionsExpandedMm: { lengthMm: 5900, widthMm: 6320, heightMm: 2430 },
      areaSqm: 37.2,
      weightTons: 4.5,
      capacityPersons: "1-4 persone",
      isFeatured: false,
      sortOrder: 2,
      active: true,
    });

    const boxEsp40 = await ctx.db.insert("products", {
      slug: "box-espandibile-40ft",
      family: "Box Espandibile",
      name: "Box Espandibile 40FT",
      description:
        "Box espandibile 40 piedi: chiuso nelle dimensioni container standard (11380×2300×2430 mm), si apre lateralmente fino a 71,9 m² abitabili.",
      dimensions: { lengthMm: 11380, widthMm: 2300, heightMm: 2430 },
      dimensionsExpandedMm: { lengthMm: 11380, widthMm: 6320, heightMm: 2430 },
      areaSqm: 71.9,
      weightTons: 7.9,
      capacityPersons: "2-6 persone",
      isFeatured: false,
      sortOrder: 3,
      active: true,
    });

    const boxKit = await ctx.db.insert("products", {
      slug: "box-kit-fai-da-te",
      family: "Box Container",
      name: "Box in Kit Fai Da Te",
      description:
        "Box in kit componibile con pannelli, struttura e coperture separate. Montaggio diretto dal cliente o assistito. Disponibile anche in versione a 2 piani.",
      dimensions: { lengthMm: 6000, widthMm: 3000, heightMm: 2896 },
      areaSqm: 18,
      isFeatured: false,
      sortOrder: 4,
      active: true,
    });

    const boxSmontabile = await ctx.db.insert("products", {
      slug: "box-smontabile",
      family: "Box Container",
      name: "Box Smontabile",
      description:
        "Struttura pre-assemblata in fabbrica che si monta e smonta rapidamente in loco, senza opere murarie. Disponibile in versione tecnica o con rivestimento legno.",
      dimensions: { lengthMm: 5950, widthMm: 2438, heightMm: 2896 },
      areaSqm: 14.5,
      isFeatured: false,
      sortOrder: 5,
      active: true,
    });

    const boxPieghevole = await ctx.db.insert("products", {
      slug: "box-pieghevole-z-folding",
      family: "Box Container",
      name: "Box Pieghevole (Z-Folding)",
      description:
        "Il box viaggia completamente ripiegato su se stesso 'a soffietto' e si apre in pochi minuti direttamente sul posto. Disponibile in versione grande e compatta.",
      dimensions: { lengthMm: 5850, widthMm: 2438, heightMm: 2620 },
      areaSqm: 14.3,
      isFeatured: false,
      sortOrder: 6,
      active: true,
    });

    const moduloAbitativo = await ctx.db.insert("products", {
      slug: "modulo-abitativo-2-piani",
      family: "Modulo Abitativo",
      name: "Modulo Abitativo a Due Piani",
      description:
        "Modulo compatto a sviluppo verticale con zona giorno al piano terra e zona notte al primo piano. Balcone e terrazza al superiore. Tetto a falda.",
      dimensions: { lengthMm: 5850, widthMm: 2438, heightMm: 5240 },
      areaSqm: 14.5,
      isFeatured: false,
      sortOrder: 7,
      active: true,
    });

    const cabinG5 = await ctx.db.insert("products", {
      slug: "cabina-spaziale-g5",
      family: "Cabina Spaziale",
      name: "Capsula Spaziale G5",
      description:
        "Cabina dal design tecnologico e scenico con grandi vetrate curve, profili aerodinamici e illuminazione LED perimetrale. Pensata per ospitalità di fascia alta.",
      dimensions: { lengthMm: 8500, widthMm: 3300, heightMm: 3300 },
      areaSqm: 28,
      weightTons: 7,
      capacityPersons: "2 persone",
      isFeatured: false,
      sortOrder: 8,
      active: true,
    });

    const cabinG7 = await ctx.db.insert("products", {
      slug: "cabina-spaziale-g7",
      family: "Cabina Spaziale",
      name: "Cabina Spaziale G7",
      description:
        "Versione più grande della Cabina Spaziale con zona living separata e angolo cottura. Progettata per soggiorni più lunghi in contesti ricettivi.",
      dimensions: { lengthMm: 11500, widthMm: 3300, heightMm: 3300 },
      areaSqm: 38,
      weightTons: 9,
      capacityPersons: "2 persone",
      isFeatured: false,
      sortOrder: 9,
      active: true,
    });

    const foodTrailer = await ctx.db.insert("products", {
      slug: "food-trailer-mobile",
      family: "Food Trailer Mobile",
      name: "Food Trailer Mobile",
      description:
        "Unità su ruote pronta all'uso per ristorazione mobile, catering e vendita ambulante. Allestibile come punto vendita food & beverage o chiosco. Disponibile anche in versione fissa.",
      dimensions: { lengthMm: 5900, widthMm: 2300, heightMm: 2430 },
      areaSqm: 13.5,
      isFeatured: false,
      sortOrder: 10,
      active: true,
    });

    // ── Option Categories ─────────────────────────────────

    const catRivEsterno = await ctx.db.insert("optionCategories", {
      slug: "rivestimento-esterno",
      label: "Rivestimento esterno",
      description: "Scegli la finitura esterna della tua struttura.",
      applicableToFamilies: [
        "Apple Cabin",
        "Box Espandibile",
        "Box Container",
        "Modulo Abitativo",
        "Cabina Spaziale",
      ],
      sortOrder: 1,
    });

    const catPannelloParete = await ctx.db.insert("optionCategories", {
      slug: "pannello-parete",
      label: "Pannello per pareti",
      description: "Il materiale isolante per le pareti della struttura.",
      applicableToFamilies: [
        "Apple Cabin",
        "Box Espandibile",
        "Box Container",
        "Modulo Abitativo",
        "Cabina Spaziale",
        "Food Trailer Mobile",
      ],
      sortOrder: 2,
    });

    const catRivPareti = await ctx.db.insert("optionCategories", {
      slug: "rivestimento-pareti",
      label: "Rivestimento pareti",
      description: "La finitura estetica delle pareti interne ed esterne.",
      applicableToFamilies: [
        "Apple Cabin",
        "Box Espandibile",
        "Box Container",
        "Modulo Abitativo",
        "Cabina Spaziale",
        "Food Trailer Mobile",
      ],
      sortOrder: 3,
    });

    const catFinestre = await ctx.db.insert("optionCategories", {
      slug: "finestre",
      label: "Finestre",
      description: "Il tipo di infisso per le finestre della struttura.",
      applicableToFamilies: [
        "Apple Cabin",
        "Box Espandibile",
        "Box Container",
        "Modulo Abitativo",
        "Cabina Spaziale",
      ],
      sortOrder: 4,
    });

    const catPorte = await ctx.db.insert("optionCategories", {
      slug: "porte",
      label: "Porte",
      description: "Il tipo di porta per la struttura.",
      applicableToFamilies: [
        "Apple Cabin",
        "Box Espandibile",
        "Box Container",
        "Modulo Abitativo",
        "Cabina Spaziale",
      ],
      sortOrder: 5,
    });

    const catPavimentazione = await ctx.db.insert("optionCategories", {
      slug: "pavimentazione",
      label: "Pavimentazione",
      description: "Il materiale e il colore del pavimento.",
      applicableToFamilies: [
        "Apple Cabin",
        "Box Espandibile",
        "Box Container",
        "Modulo Abitativo",
        "Cabina Spaziale",
        "Food Trailer Mobile",
      ],
      sortOrder: 6,
    });

    const catBagno = await ctx.db.insert("optionCategories", {
      slug: "bagno",
      label: "Configurazione bagno",
      description: "Scegli il tipo di bagno per la tua struttura.",
      applicableToFamilies: [
        "Apple Cabin",
        "Box Espandibile",
        "Modulo Abitativo",
        "Cabina Spaziale",
      ],
      sortOrder: 7,
    });

    // ── Option Choices ────────────────────────────────────

    await ctx.db.insert("optionChoices", {
      categoryId: catRivEsterno,
      label: "Doghe legno chiaro",
      description: "Rivestimento esterno in doghe di legno naturale chiaro.",
      technicalSpecs: ["Legno naturale certificato", "Finitura chiara", "Trattamento impregnante"],
      subOptions: [{ label: "Legno chiaro", description: "Tonalità naturale chiara" }],
      sortOrder: 1,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivEsterno,
      label: "Doghe rovere scuro",
      description: "Rivestimento esterno in doghe di rovere scuro.",
      technicalSpecs: ["Legno di rovere", "Finitura scura", "Trattamento impregnante"],
      subOptions: [{ label: "Rovere scuro", description: "Tonalità scura elegante" }],
      sortOrder: 2,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivEsterno,
      label: "Bianco",
      description: "Finitura esterna bianca.",
      sortOrder: 3,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivEsterno,
      label: "Grigio",
      description: "Finitura esterna grigia.",
      sortOrder: 4,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivEsterno,
      label: "Blu scuro",
      description: "Finitura esterna blu scuro.",
      sortOrder: 5,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivEsterno,
      label: "Effetto legno",
      description: "Finitura esterna con effetto legno.",
      sortOrder: 6,
    });

    // ── Pannello parete ───────────────────────────────────

    await ctx.db.insert("optionChoices", {
      categoryId: catPannelloParete,
      label: "Lana di roccia",
      description:
        "Isolamento termico eccellente, forte riduzione del rumore, materiale incombustibile con ottima resistenza al fuoco.",
      technicalSpecs: [
        "Isolamento termico eccellente",
        "Forte riduzione del rumore",
        "Materiale incombustibile",
        "Ottima resistenza al fuoco",
      ],
      subOptions: [
        { label: "50 mm", description: "Spessore 50 mm" },
        { label: "75 mm", description: "Spessore 75 mm" },
        { label: "100 mm", description: "Spessore 100 mm" },
      ],
      sortOrder: 1,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPannelloParete,
      label: "EPS (poliestere espanso)",
      description:
        "Buone prestazioni di isolamento, struttura leggera a bassa densità che riduce il peso complessivo, buona resistenza alla compressione.",
      technicalSpecs: [
        "Buon isolamento termico",
        "Struttura leggera",
        "Buona resistenza alla compressione",
        "Bassa densità",
      ],
      sortOrder: 2,
    });

    // ── Rivestimento pareti ───────────────────────────────

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Bambù — Bianco",
      description: "Pannello in fibra di bambù, tinta bianca.",
      sortOrder: 1,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Bambù — Grigio chiaro",
      description: "Pannello in fibra di bambù, tinta grigio chiaro.",
      sortOrder: 2,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Bambù — Beige",
      description: "Pannello in fibra di bambù, tinta beige.",
      sortOrder: 3,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Bambù — Effetto legno chiaro",
      description: "Pannello in fibra di bambù, effetto legno chiaro.",
      sortOrder: 4,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Bambù — Effetto legno scuro",
      description: "Pannello in fibra di bambù, effetto legno scuro.",
      sortOrder: 5,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Bambù — Effetto tessuto grigio",
      description: "Pannello in fibra di bambù, effetto tessuto grigio.",
      sortOrder: 6,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Tinta unita chiara",
      description: "Pannello isolante in metallo, tinta unita chiara.",
      sortOrder: 7,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Tinta unita scura",
      description: "Pannello isolante in metallo, tinta unita scura.",
      sortOrder: 8,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Tinta unita crema",
      description: "Pannello isolante in metallo, tinta unita crema.",
      sortOrder: 9,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Effetto legno chiaro",
      description: "Pannello isolante in metallo, effetto legno chiaro.",
      sortOrder: 10,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Effetto legno scuro",
      description: "Pannello isolante in metallo, effetto legno scuro.",
      sortOrder: 11,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Effetto legno rosso",
      description: "Pannello isolante in metallo, effetto legno rosso.",
      sortOrder: 12,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Effetto mattone grigio",
      description: "Pannello isolante in metallo, effetto mattone grigio.",
      sortOrder: 13,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Effetto mattone bianco",
      description: "Pannello isolante in metallo, effetto mattone bianco.",
      sortOrder: 14,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Effetto mattone multicolor",
      description: "Pannello isolante in metallo, effetto mattone multicolor.",
      sortOrder: 15,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Effetto pietra",
      description: "Pannello isolante in metallo, effetto pietra.",
      sortOrder: 16,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catRivPareti,
      label: "Metallo — Effetto marmo grigio-bianco",
      description: "Pannello isolante in metallo, effetto marmo grigio-bianco.",
      sortOrder: 17,
    });

    // ── Finestre ──────────────────────────────────────────

    await ctx.db.insert("optionChoices", {
      categoryId: catFinestre,
      label: "PVC rinforzato",
      description: "Finestre in PVC rinforzato, buon isolamento termico e acustico.",
      technicalSpecs: ["Buon isolamento termico", "Buon isolamento acustico", "Manutenzione ridotta"],
      sortOrder: 1,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catFinestre,
      label: "Lega di alluminio",
      description: "Finestre in lega di alluminio, leggere e resistenti.",
      technicalSpecs: ["Leggere", "Resistenti", "Design moderno"],
      sortOrder: 2,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catFinestre,
      label: "Alluminio a taglio termico",
      description:
        "Finestre in alluminio a taglio termico: la soluzione premium per efficienza energetica.",
      technicalSpecs: [
        "Massima efficienza energetica",
        "Taglio termico",
        "Design premium",
        "Massimo isolamento",
      ],
      sortOrder: 3,
    });

    // ── Porte ─────────────────────────────────────────────

    await ctx.db.insert("optionChoices", {
      categoryId: catPorte,
      label: "Porta in acciaio",
      description: "Porta in acciaio, robusta e sicura.",
      technicalSpecs: ["Robusta", "Sicura", "Resistente"],
      sortOrder: 1,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPorte,
      label: "Porta a doppio vetro",
      description: "Porta a doppio vetro, elegante e luminosa.",
      technicalSpecs: ["Elegante", "Luminosa", "Isolamento acustico"],
      sortOrder: 2,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPorte,
      label: "Porta scorrevole",
      description: "Porta scorrevole, ideale per risparmiare spazio.",
      technicalSpecs: ["Risparmio spazio", "Design moderno", "Scorrimento silenzioso"],
      sortOrder: 3,
    });

    // ── Pavimentazione ────────────────────────────────────

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "PVC — Bianco/chiaro",
      description: "Pavimento in PVC, colore bianco/chiaro.",
      sortOrder: 1,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "PVC — Rovere naturale",
      description: "Pavimento in PVC, effetto rovere naturale.",
      sortOrder: 2,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "PVC — Grigio",
      description: "Pavimento in PVC, colore grigio.",
      sortOrder: 3,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "PVC — Grigio chiaro",
      description: "Pavimento in PVC, colore grigio chiaro.",
      sortOrder: 4,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "PVC — Naturale caldo",
      description: "Pavimento in PVC, tonalità naturale calda.",
      sortOrder: 5,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "SPC — Bianco/chiaro",
      description: "Pavimento SPC, colore bianco/chiaro.",
      sortOrder: 6,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "SPC — Naturale",
      description: "Pavimento SPC, colore naturale.",
      sortOrder: 7,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "SPC — Rosso scuro/mogano",
      description: "Pavimento SPC, colore rosso scuro/mogano.",
      sortOrder: 8,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "SPC — Grigio",
      description: "Pavimento SPC, colore grigio.",
      sortOrder: 9,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catPavimentazione,
      label: "SPC — Marrone scuro",
      description: "Pavimento SPC, colore marrone scuro.",
      sortOrder: 10,
    });

    // ── Bagno ─────────────────────────────────────────────

    await ctx.db.insert("optionChoices", {
      categoryId: catBagno,
      label: "Bagno integrato",
      description: "Blocco doccia + sanitari compatto. Soluzione salvaspazio essenziale.",
      technicalSpecs: ["Blocco compatto", "Doccia integrata", "Sanitari compatti"],
      sortOrder: 1,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catBagno,
      label: "Bagno unico",
      description: "Doccia, WC e lavabo in un unico ambiente. Soluzione completa e funzionale.",
      technicalSpecs: ["Ambiente unico", "Doccia separata", "WC e lavabo", "Funzionale"],
      sortOrder: 2,
    });

    await ctx.db.insert("optionChoices", {
      categoryId: catBagno,
      label: "Bagno con zona doccia separata",
      description:
        "Soluzione più curata con rivestimenti effetto marmo e doccia in zona dedicata.",
      technicalSpecs: ["Zona doccia separata", "Rivestimenti effetto marmo", "Design premium"],
      sortOrder: 3,
    });

    // ── Box Espandibile Layouts ───────────────────────────

    const layouts = [
      "Un soggiorno, un bagno, una cucina a vista",
      "Un soggiorno, una camera da letto, un bagno, una cucina a vista",
      "Un soggiorno, due camere da letto, un bagno, una cucina a vista",
      "Un soggiorno, tre camere da letto, un bagno, una cucina a vista",
      "Un soggiorno, una camera da letto, un bagno, una cucina separata",
      "Un soggiorno, due camere da letto, un bagno, una cucina separata",
      "Monolocale con cucina a vista e bagno",
      "Monolocale con angolo cottura e bagno",
      "Soggiorno con cucina a vista, bagno",
      "Soggiorno, camera, bagno, cucina",
    ];

    for (let i = 0; i < layouts.length; i++) {
      await ctx.db.insert("productLayouts", {
        productId: boxEsp20,
        name: layouts[i],
        sortOrder: i + 1,
      });
      await ctx.db.insert("productLayouts", {
        productId: boxEsp40,
        name: layouts[i],
        sortOrder: i + 1,
      });
    }
  },
});
