"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { trackClick } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const switchLocale = locale === "it" ? "en" : "it";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "mt-2 mx-2 lg:mx-4 rounded-xl bg-green-500/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(107,143,78,0.15)] border border-green-500/15"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto transition-all duration-500 max-w-7xl">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          scrolled ? "h-11 px-4" : "h-16 px-6 lg:px-8"
        }`}>
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className={`font-display font-semibold tracking-tight text-text transition-all duration-500 ${
              scrolled ? "text-sm" : "text-lg"
            }`}>
              Doctor Haus
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => trackClick("nav", item.href)}
                className={`relative text-xs tracking-wide transition-colors duration-300 ${
                  isActive(item.href)
                    ? "text-text"
                    : "text-text-muted hover:text-text"
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
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-medium text-text transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]"
            >
              {t("accedi")}
            </Link>
            <Link
              href={`/${switchLocale}`}
              onClick={() => trackClick("lang-switch", switchLocale)}
              className="text-xs font-medium text-text-muted hover:text-text transition-colors duration-300 px-2.5 py-1 rounded-full border border-line hover:border-text-muted"
            >
              {switchLocale.toUpperCase()}
            </Link>
            <Link
              href="/configuratore"
              onClick={() => trackClick("richiedi-preventivo", "header")}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
            >
              {t("richiediPreventivo")}
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative z-50 p-1.5 text-text"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
                    isActive(item.href) ? "text-green-500" : "text-text"
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
                className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 text-sm font-medium text-text"
                onClick={() => setMobileOpen(false)}
              >
                {t("accedi")}
              </Link>
              <Link
                href={`/${switchLocale}`}
                className="text-sm font-medium text-text-muted hover:text-text transition-colors px-3 py-2 rounded-full border border-line"
                onClick={() => setMobileOpen(false)}
              >
                {switchLocale.toUpperCase()}
              </Link>
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
