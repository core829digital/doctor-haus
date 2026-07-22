"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Download, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionTitle from "@/components/ui/SectionTitle";

const appleCabinPhotos = Array.from({ length: 53 }, (_, i) => ({
  id: String(i + 1),
  src: `/images/apple-cabin/webp/${i + 1}.webp`,
  thumb: `/images/apple-cabin/webp/${i + 1}.webp`,
  category: "apple-cabin",
}));

const expandablePhotos = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  src: `/images/expandable/webp/${i + 1}.webp`,
  thumb: `/images/expandable/webp/${i + 1}.webp`,
  category: "expandable",
}));

const categories = [
  {
    id: "apple-cabin",
    label: { it: "Apple Cabin", en: "Apple Cabin" },
    photos: appleCabinPhotos,
  },
  {
    id: "expandable",
    label: { it: "Box Espandibili", en: "Expandable Boxes" },
    photos: expandablePhotos,
  },
];

export default function CatalogoContent({ locale }: { locale: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [allPhotos, setAllPhotos] = useState<{ src: string; id: string }[]>([]);

  const openLightbox = (photos: { src: string; id: string }[], index: number) => {
    setAllPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const isIt = locale === "it";

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
            Doctor Haus
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-display font-semibold text-text leading-tight"
          >
            {isIt ? "Catalogo" : "Catalog"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-base lg:text-lg text-text-muted max-w-3xl mx-auto leading-relaxed"
          >
            {isIt
              ? "Sfoglia tutte le nostre soluzioni in alta risoluzione. Scarica i cataloghi PDF o contattaci per ricevere materiale personalizzato."
              : "Browse all our solutions in high resolution. Download PDF catalogs or contact us for personalized material."}
          </motion.p>
        </div>
      </section>

      <SectionWrapper alt>
        <SectionTitle
          title={isIt ? "Cataloghi disponibili" : "Available catalogs"}
          subtitle={isIt ? "Scarica i cataloghi in formato PDF" : "Download catalogs in PDF format"}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: isIt ? "Apple Cabin" : "Apple Cabin",
              desc: isIt ? "Catalogo completo della mini casa modulare" : "Complete modular mini house catalog",
              gradient: "from-green-400 to-emerald-600",
              icon: "AC",
              href: "#apple-cabin",
            },
            {
              title: isIt ? "Box Espandibili" : "Expandable Boxes",
              desc: isIt ? "Box espandibili 20FT e 40FT" : "20FT and 40FT expandable boxes",
              gradient: "from-blue-400 to-indigo-600",
              icon: "BE",
              href: "#expandable",
            },
            {
              title: isIt ? "Catalogo PDF" : "PDF Catalog",
              desc: isIt ? "Scarica il catalogo completo Doctor Haus" : "Download the complete Doctor Haus catalog",
              gradient: "from-orange-400 to-amber-600",
              icon: "PDF",
              href: "/catalogs/DoctorHaus2.pdf",
              download: true,
            },
            {
              title: isIt ? "Richiedi catalogo" : "Request catalog",
              desc: isIt ? "Catalogo personalizzato per il tuo progetto" : "Personalized catalog for your project",
              gradient: "from-stone-400 to-stone-600",
              icon: "PDF",
              href: "/contatti",
            },
          ].map((cat, i) => (
            <motion.a
              key={i}
              href={cat.href}
              {...("download" in cat && cat.download ? { download: "DoctorHaus-Catalogo.pdf" } : {})}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br aspect-[4/3] flex flex-col items-center justify-center text-white p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300"
              style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90`} />
              <div className="relative z-10 text-center">
                <div className="text-2xl font-bold mb-2">{cat.icon}</div>
                <h3 className="text-base font-semibold">{cat.title}</h3>
                <p className="text-xs text-white/70 mt-1">{cat.desc}</p>
              </div>
              <div className="relative z-10 mt-4 flex items-center gap-1.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                {"download" in cat && cat.download ? (
                  <><Download size={12} /> {isIt ? "Scarica PDF" : "Download PDF"}</>
                ) : cat.href.startsWith("http") || cat.href.startsWith("/contatti") ? (
                  <><ArrowRight size={12} /> {isIt ? "Vai" : "Go"}</>
                ) : (
                  <><Download size={12} /> {isIt ? "Sfoglia" : "Browse"}</>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </SectionWrapper>

      {categories.map((cat, catIdx) => (
        <SectionWrapper key={cat.id} alt={catIdx % 2 === 1}>
          <div id={cat.id} className="scroll-mt-24">
            <SectionTitle
              title={isIt ? cat.label.it : cat.label.en}
              subtitle={isIt
                ? `Clicca su una foto per ingrandirla — ${cat.photos.length} foto disponibili`
                : `Click a photo to enlarge — ${cat.photos.length} photos available`}
            />
          </div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 max-w-6xl mx-auto space-y-3">
            {cat.photos.map((photo, i) => (
              <motion.button
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.02, 0.3) }}
                onClick={() => openLightbox(cat.photos, i)}
                className="break-inside-avoid overflow-hidden rounded-xl bg-background-alt border border-line group cursor-pointer w-full text-left"
              >
                <div className="relative">
                  <img
                    src={photo.src}
                    alt={`${isIt ? cat.label.it : cat.label.en} ${photo.id}`}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <Eye size={24} className="text-white/0 group-hover:text-white/80 transition-all duration-300" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </SectionWrapper>
      ))}

      <SectionWrapper alt={categories.length % 2 === 1}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-b from-green-50/50 to-transparent rounded-3xl p-12 lg:p-16 border border-line"
        >
          <Download size={32} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-text mb-4">
            {isIt ? "Non trovi quello che cerchi?" : "Can't find what you're looking for?"}
          </h2>
          <p className="text-text-muted mb-8 max-w-lg mx-auto leading-relaxed">
            {isIt
              ? "Richiedi un catalogo personalizzato con le soluzioni su misura per il tuo progetto. Il nostro team ti invierà materiale dedicato."
              : "Request a personalized catalog with solutions tailored to your project. Our team will send you dedicated material."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
            >
              {isIt ? "Richiedi catalogo personalizzato" : "Request personalized catalog"}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/configuratore"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              {isIt ? "Configura il tuo prodotto" : "Configure your product"}
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </SectionWrapper>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>

          {allPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === 0 ? allPhotos.length - 1 : prev - 1));
                }}
                className="absolute left-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev === allPhotos.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <motion.img
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            src={allPhotos[lightboxIndex]?.src ?? ""}
            alt={`Photo ${lightboxIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/40 px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {allPhotos.length}
          </div>
        </div>
      )}
    </>
  );
}
