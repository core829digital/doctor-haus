"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-display font-semibold text-text mb-4">
          Qualcosa è andato storto
        </h1>
        <p className="text-text-muted mb-8">
          Si è verificato un errore imprevisto. Riprova o torna alla home.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-700"
          >
            Torna alla home
          </a>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-text transition-all hover:bg-white/5"
          >
            Riprova
          </button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-8 text-sm text-red-400 font-mono text-left bg-red-950/30 rounded-xl p-4 overflow-auto max-h-48">
            {error.message}
          </p>
        )}
      </div>
    </main>
  );
}
