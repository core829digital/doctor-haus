import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h1 className="text-6xl font-display font-semibold text-text mb-4">404</h1>
      <p className="text-lg text-text-muted mb-8 max-w-md">
        {t("paginaNonTrovata") || "Pagina non trovata"}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-green-700"
      >
        {t("tornaHome")}
      </Link>
    </div>
  );
}
