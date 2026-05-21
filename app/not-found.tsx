import Link from "next/link";
import { ArrowLeft, Search, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page introuvable — Kids Land" };

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#FAFAFA]">
      <div className="max-w-md w-full text-center">
        <div className="text-[120px] font-black text-gray-100 leading-none select-none mb-2">
          404
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-3">
          Cette page n&apos;existe pas
        </h1>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-10">
          L&apos;article que vous cherchez a peut-être été déplacé ou n&apos;est plus disponible.
          Pas de panique — notre boutique est pleine de belles choses.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
          >
            <ShoppingBag size={14} /> Voir la boutique
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:border-gray-400 transition-colors"
          >
            <ArrowLeft size={14} /> Retour à l&apos;accueil
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[12px] text-gray-400">
          <Search size={12} />
          <span>Essayez de chercher ce que vous voulez depuis la barre de recherche</span>
        </div>
      </div>
    </div>
  );
}
