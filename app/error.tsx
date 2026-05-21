"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#FAFAFA]">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-red-400" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-3">
          Une erreur est survenue
        </h1>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
          Quelque chose s&apos;est mal passé de notre côté. Vous pouvez réessayer
          ou revenir à l&apos;accueil.
        </p>

        {error.digest && (
          <p className="text-[11px] font-mono text-gray-300 mb-6">
            Référence : {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
          >
            <RefreshCcw size={14} /> Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:border-gray-400 transition-colors"
          >
            <ArrowLeft size={14} /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
