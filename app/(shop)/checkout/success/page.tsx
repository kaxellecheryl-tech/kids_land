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
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#d8f5c0] flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[#7ED957]" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Commande confirmée !
        </h1>
        {order && (
          <p className="text-[13px] font-mono font-bold text-gray-500 mb-4">
            {order}
          </p>
        )}
        <p className="text-[15px] text-gray-600 leading-relaxed mb-8">
          Merci pour votre commande. Vous recevrez un SMS de confirmation dès que
          votre paiement sera validé. Notre équipe prépare votre colis avec soin.
        </p>

        {/* Steps */}
        <div className="bg-[#FDF8F8] rounded-2xl border border-gray-100 p-6 mb-8 text-left space-y-3">
          {[
            { n: "1", text: "Validation du paiement (quelques minutes)" },
            { n: "2", text: "Préparation de votre commande (24h)" },
            { n: "3", text: "Livraison à votre adresse (24–48h Abidjan)" },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-6 h-6 rounded-full bg-brand-orange text-white text-[11px] font-black flex items-center justify-center shrink-0">
                {n}
              </div>
              {text}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
            Continuer mes achats <ArrowRight size={15} />
          </Link>
        </div>

        {/* WhatsApp help */}
        <p className="text-[12px] text-gray-400 mt-8">
          Un problème avec votre commande ?{" "}
          <a
            href="https://wa.me/2250000000000"
            className="text-brand-orange font-medium hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle size={12} /> Contactez-nous sur WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
