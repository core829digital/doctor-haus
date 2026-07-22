import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "/" as const, label: tn("home") },
    { href: "/chi-siamo" as const, label: tn("chiSiamo") },
    { href: "/come-funziona" as const, label: tn("comeFunziona") },
    { href: "/prodotto" as const, label: tn("prodotto") },
    { href: "/contatti" as const, label: tn("contatti") },
    { href: "/configuratore" as const, label: tn("configuratore") },
    { href: "/altre-soluzioni" as const, label: tn("altreSoluzioni") },
  ];

  const legalLinks = [
    { href: "/legal/privacy-policy" as const, label: t("privacyPolicy") },
    { href: "/legal/cookie-policy" as const, label: t("cookiePolicy") },
    { href: "/legal/note-legali" as const, label: t("noteLegali") },
    { href: "/legal/termini-di-utilizzo" as const, label: t("termini") },
    { href: "/legal/garanzia-e-recesso" as const, label: t("garanzia") },
    { href: "/cookie-preferences" as const, label: t("cookiePreferences") },
  ];

  return (
    <footer className="bg-background-alt border-t border-line">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          <div>
            <Link href="/" className="flex items-center gap-4 group">
              <img
                src="/logo-120.webp"
                alt="Doctor Haus"
                className="w-20 h-20"
                width={120}
                height={120}
              />
              <span className="text-2xl font-display font-bold text-text">
                Doctor Haus
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-muted leading-relaxed max-w-xs">
              {t("description")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text uppercase tracking-widest mb-4">
              {tn("home")}
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text uppercase tracking-widest mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            {t("tuttiDiritti", { year: currentYear })}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/legal/accessibilita"
              className="text-xs text-text-muted hover:text-text transition-colors"
            >
              {t("accessibilita")}
            </Link>
            <span className="text-xs text-text-muted">·</span>
            <Link
              href="/accedi"
              className="text-xs text-text-muted hover:text-text transition-colors"
            >
              {t("accedi")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
