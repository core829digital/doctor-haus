import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-background">
      <h1 className="text-6xl font-display font-semibold text-text mb-4">404</h1>
      <p className="text-lg text-text-muted mb-8 max-w-md">
        Pagina non trovata
      </p>
      <Link
        href="/it"
        className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-green-700"
      >
        Torna alla home
      </Link>
    </div>
  );
}
