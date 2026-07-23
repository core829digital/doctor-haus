"use client";

import { Link } from "@/i18n/navigation";
import { MessageCircle } from "lucide-react";

export default function StickyQuoteButton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="mx-auto max-w-lg px-4 pb-4">
        <Link
          href="/configuratore"
          className="flex items-center justify-center gap-2 w-full rounded-full bg-orange-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02]"
        >
          <MessageCircle size={18} />
          Richiedi preventivo gratuito
        </Link>
      </div>
    </div>
  );
}
