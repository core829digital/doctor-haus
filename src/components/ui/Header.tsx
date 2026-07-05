"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useAnalytics } from "@/lib/use-analytics";

const navItems = [
  { href: "/" as const, labelKey: "home" },
  { href: "/chi-siamo" as const, labelKey: "chiSiamo" },
  { href: "/come-funziona" as const, labelKey: "comeFunziona" },
  { href: "/prodotto" as const, labelKey: "prodotto" },
  { href: "/contatti" as const, labelKey: "contatti" },
  { href: "/configuratore" as const, labelKey: "configuratore" },
  { href: "/altre-soluzioni" as const, labelKey: "altreSoluzioni" },
];

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { trackClick } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setMobileOpen(false);
      setLangOpen(false);
    });
  }, [pathname, startTransition]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const switchLang = (l: string) => {
    setLangOpen(false);
    trackClick("lang-switch", l);
    router.replace(pathname, { locale: l as "it" | "en" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "mt-1.5 mx-2 lg:mx-3 rounded-xl bg-green-500/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(107,143,78,0.15)] border border-green-500/15"
          : "bg-background/30 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto transition-all duration-500 max-w-5xl">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          scrolled ? "h-10 px-3" : "h-14 px-4 lg:px-5"
        }`}>
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className={`font-display font-semibold tracking-tight text-text transition-all duration-500 ${
              scrolled ? "text-sm" : "text-base"
            }`}>
              Doctor Haus
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => trackClick("nav", item.href)}
                className={`relative text-[11px] tracking-wide transition-colors duration-300 whitespace-nowrap px-1.5 ${
                  isActive(item.href)
                    ? "text-green-700 font-semibold"
                    : "text-green-700/70 hover:text-green-700"
                }`}
              >
                {t(item.labelKey)}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-green-500 transition-all duration-300 ${
                    isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
              <Link
                href="/accedi"
                onClick={() => trackClick("accedi", "header")}
                className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 backdrop-blur-md border border-green-500/30 px-3 py-1 text-[11px] font-medium text-green-700 transition-all duration-300 hover:bg-green-500/20 hover:scale-[1.02] whitespace-nowrap"
              >
                {t("accedi")}
              </Link>
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-[11px] font-medium text-green-700/70 hover:text-green-700 transition-colors duration-300 px-2 py-1 rounded-full border border-green-500/20 hover:border-green-500/40"
              >
                <Globe size={10} />
                {locale.toUpperCase()}
                <ChevronDown size={9} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-24 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                  {(["it", "en"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLang(l)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                        locale === l
                          ? "text-green-400 bg-green-500/10"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${locale === l ? "bg-green-400" : "bg-white/10"}`} />
                      {l === "it" ? "Italiano" : "English"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/configuratore"
              onClick={() => trackClick("richiedi-preventivo", "header")}
              className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] whitespace-nowrap"
            >
              {t("richiediPreventivo")}
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative z-50 p-1.5 text-text"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-6 lg:hidden"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className={`text-xl font-display ${
                    isActive(item.href) ? "text-green-700 font-semibold" : "text-green-700/70"
                  }`}
                  onClick={() => { setMobileOpen(false); trackClick("nav-mobile", item.href); }}
                >
                  {t(item.labelKey)}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.08 }}
              className="flex items-center gap-3 mt-2"
            >
              <Link
                href="/accedi"
                className="rounded-full bg-green-500/10 backdrop-blur-md border border-green-500/30 px-5 py-2.5 text-sm font-medium text-green-700"
                onClick={() => setMobileOpen(false)}
              >
                {t("accedi")}
              </Link>
              <div className="flex gap-1">
                {(["it", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setMobileOpen(false); switchLang(l); }}
                    className={`text-sm font-medium px-3 py-2 rounded-full border transition-colors ${
                      locale === l
                        ? "text-green-700 font-semibold border-green-500/30 bg-green-500/10"
                        : "text-green-700/70 border-green-500/20 hover:text-green-700"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <Link
                href="/configuratore"
                className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                {t("richiediPreventivo")}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
