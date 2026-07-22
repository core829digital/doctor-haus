"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { useConfiguratorStore } from "@/lib/configurator-store";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAnalytics } from "@/lib/use-analytics";

const formSchema = z.object({
  name: z.string().min(2, "Il nome è obbligatorio"),
  email: z.string().email("Inserisci un'email valida"),
  phone: z.string().min(6, "Inserisci un numero di telefono valido"),
  message: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: "Devi accettare la privacy policy per continuare",
  }),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  locale: string;
  onSuccess: () => void;
};

export default function QuoteRequestForm({ locale, onSuccess }: Props) {
  const { selectedProductId, selectedOptions, sessionId } = useConfiguratorStore();
  const createQuote = useMutation(api.quoteRequests.create);
  const { trackClick } = useAnalytics();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedProductId) return;
    setError(null);
    setSubmitting(true);

    try {
      const optionDetails = selectedOptions.map((opt) => ({
        categoryId: opt.categoryId,
        choiceId: opt.choiceId,
        categoryLabel: opt.categoryLabel,
        choiceLabel: opt.choiceLabel,
      }));

      await createQuote({
        productId: selectedProductId,
        selectedOptions: optionDetails,
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerMessage: data.message,
        preferredLanguage: locale,
        gdprConsent: data.gdprConsent,
      });

      trackClick("form_submit", data.email);
      setSuccess(true);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante l'invio. Riprova."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-text mb-3">
          {locale === "it"
            ? "Richiesta ricevuta!"
            : "Request received!"}
        </h2>
        <p className="text-text-muted max-w-md mx-auto leading-relaxed">
          {locale === "it"
            ? "Ti contatteremo entro 24-48 ore lavorative con un preventivo personalizzato. Riceverai una conferma via email."
            : "We'll contact you within 24-48 business hours with a personalized quote. You'll receive a confirmation via email."}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-text-muted hover:text-text transition-colors"
          >
            {locale === "it" ? "Torna alla home" : "Back to home"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-display font-semibold text-text mb-2">
        {locale === "it" ? "I tuoi dati" : "Your details"}
      </h2>
      <p className="text-sm text-text-muted mb-8">
        {locale === "it"
          ? "Lasciaci i tuoi recapiti e ti invieremo un preventivo personalizzato."
          : "Leave us your contact details and we'll send you a personalized quote."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">
            {locale === "it" ? "Nome e cognome" : "Full name"} *
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
            placeholder={locale === "it" ? "Mario Rossi" : "John Doe"}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500" role="alert">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
            Email *
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
            placeholder="mario@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500" role="alert">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text mb-1.5">
            {locale === "it" ? "Telefono" : "Phone"} *
          </label>
          <input
            id="phone"
            {...register("phone")}
            type="tel"
            className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors"
            placeholder="+39 333 1234567"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500" role="alert">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text mb-1.5">
            {locale === "it" ? "Messaggio (opzionale)" : "Message (optional)"}
          </label>
          <textarea
            id="message"
            {...register("message")}
            rows={3}
            className="w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors resize-none"
            placeholder={
              locale === "it"
                ? "Vorrei installarla su un terreno agricolo in Toscana, quando potreste fare un sopralluogo?"
                : "I'd like to install it on agricultural land in Tuscany, when could you do a site visit?"
            }
          />
        </div>

        <fieldset className="border-0 p-0 m-0">
          <legend className="sr-only">
            {locale === "it" ? "Consenso al trattamento dati" : "Data processing consent"}
          </legend>
          <div className="flex items-start gap-3">
            <input
              {...register("gdprConsent")}
              type="checkbox"
              id="gdpr"
              className="mt-1 rounded border-line text-green-500 focus:ring-green-500"
            />
            <label htmlFor="gdpr" className="text-xs text-text-muted leading-relaxed">
            {locale === "it" ? (
              <>
                Ho preso visione dell&apos;{" "}
                <Link href="/legal/privacy-policy" className="text-green-500 underline">
                  Informativa sulla Privacy
                </Link>{" "}
                e acconsento al trattamento dei miei dati personali per ricevere un preventivo. *
              </>
            ) : (
              <>
                I have read the{" "}
                <Link href="/legal/privacy-policy" className="text-green-500 underline">
                  Privacy Policy
                </Link>{" "}
                and consent to the processing of my personal data to receive a quote. *
              </>
            )}
          </label>
          </div>
          {errors.gdprConsent && (
            <p className="text-xs text-red-500" role="alert">{errors.gdprConsent.message}</p>
          )}
        </fieldset>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {locale === "it" ? "Invio in corso..." : "Sending..."}
            </>
          ) : (
            <>
              {locale === "it"
                ? "Invia richiesta di preventivo"
                : "Send quote request"}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
