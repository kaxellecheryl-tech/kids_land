import Link from "next/link";
import { CheckCircle, Package, ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Commande confirmée" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#d8f5c0] flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[#7ED957]" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Commande enregistrée !
        </h1>
        {order && (
          <p className="text-[13px] font-mono font-bold text-gray-500 mb-4">
            {order}
          </p>
        )}
        <p className="text-[15px] text-gray-600 leading-relaxed mb-8">
          Votre commande a bien été reçue. Notre équipe va vous contacter sur WhatsApp pour finaliser le paiement et préparer votre livraison.
        </p>

        <div className="bg-[#FDF8F8] rounded-2xl border border-gray-100 p-6 mb-8 text-left space-y-3">
          {[
            { n: "1", text: "Envoyez votre récapitulatif sur WhatsApp (fenêtre déjà ouverte)" },
            { n: "2", text: "Réglez via Wave, Orange Money, Momo ou Djamo" },
            { n: "3", text: "Livraison à votre adresse sous 24–48h (Abidjan)" },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 rounded-full bg-brand-orange text-white text-[11px] font-black flex items-center justify-center shrink-0">
                {n}
              </div>
              {text}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/2250777063646"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle size={15} /> Ouvrir WhatsApp
          </a>
          <Link
            href="/orders/track"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
          >
            <Package size={15} /> Suivre ma commande
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:border-gray-400 transition-colors"
          >
            Continuer <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
