import Link from "next/link";
import {
  ArrowLeft, RotateCcw, MessageCircle, Phone, Clock,
  AlertCircle, CheckCircle, XCircle, Package, Truck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retours",
  description: "Politique de retours Kids Land — retour sous 10 jours uniquement en cas de défaut de l'article.",
};

const STEPS = [
  {
    Icon: MessageCircle,
    title: "Contactez-nous",
    desc: "Signalez le défaut via WhatsApp avec des photos claires de l'article et votre numéro de commande.",
  },
  {
    Icon: Package,
    title: "Emballez l'article",
    desc: "Remettez l'article dans son emballage d'origine ou dans un emballage protecteur équivalent.",
  },
  {
    Icon: Truck,
    title: "Remise au livreur",
    desc: "Nous convenons ensemble d'un créneau pour que notre livreur récupère l'article chez vous.",
  },
  {
    Icon: CheckCircle,
    title: "Échange",
    desc: "Après vérification du défaut, nous vous envoyons un article de remplacement identique ou équivalent.",
  },
];

const CONDITIONS: { label: string; ok: boolean }[] = [
  { label: "Article présentant un défaut de fabrication",             ok: true  },
  { label: "Signalement dans les 10 jours suivant la réception",      ok: true  },
  { label: "Photos du défaut fournies lors du signalement",           ok: true  },
  { label: "Article non porté ou non lavé",                           ok: true  },
  { label: "Changement d'avis ou mauvais choix de taille",           ok: false },
  { label: "Article porté, lavé ou abîmé après réception",           ok: false },
  { label: "Signalement au-delà de 10 jours",                        ok: false },
  { label: "Demande de remboursement (aucun remboursement accordé)", ok: false },
];

const FAQS = [
  {
    q: "Que faire si j'ai reçu un article défectueux ?",
    a: "Contactez-nous immédiatement sur WhatsApp avec des photos du défaut et votre numéro de commande. Nous examinons la situation et procédons à un échange si le défaut est confirmé.",
  },
  {
    q: "Puis-je retourner un article si la taille ne convient pas ?",
    a: "Non. Les retours ne sont acceptés qu'en cas de défaut de fabrication. Nous vous conseillons de consulter notre guide des tailles avant de commander.",
  },
  {
    q: "Y a-t-il des remboursements ?",
    a: "Non. Kids Land ne procède à aucun remboursement. En cas de défaut avéré, l'article est remplacé par un article identique ou équivalent.",
  },
  {
    q: "Les frais de retour sont-ils à ma charge ?",
    a: "Non. En cas de défaut confirmé, la récupération de l'article est prise en charge par Kids Land.",
  },
  {
    q: "Quel délai pour signaler un problème ?",
    a: "Vous disposez de 10 jours à compter de la réception de votre commande pour signaler tout défaut. Passé ce délai, aucun retour ne pourra être accepté.",
  },
];

export default function ReturnsPage() {
  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6 bg-[#fff3bb]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3"><RotateCcw size={48} className="text-gray-700" /></div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">Retours</h1>
              <p className="text-sm text-gray-700">
                Retour accepté uniquement en cas de défaut de l&apos;article — sous 10 jours
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/60 rounded-2xl px-6 py-4">
              <Clock size={20} className="text-gray-600 shrink-0" />
              <div>
                <div className="text-lg font-bold tracking-tight">10 jours</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-gray-500">
                  Délai de signalement
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALERTE POLITIQUE */}
      <section className="container-shop py-10">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 px-8 py-6 flex items-start gap-4">
          <AlertCircle size={22} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-bold text-amber-700 mb-1">
              Politique de retour Kids Land
            </p>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              Kids Land accepte les retours <strong>uniquement en cas de défaut de fabrication</strong> de l&apos;article,
              dans un délai de <strong>10 jours maximum</strong> après réception.
              Aucun retour pour changement d&apos;avis ou mauvais choix de taille ne sera accepté.{" "}
              <strong>Aucun remboursement</strong> n&apos;est accordé — les articles défectueux sont remplacés.
            </p>
          </div>
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="bg-[#FDF8F8] py-16">
        <div className="container-shop">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Conditions de retour</h2>
          <p className="text-sm text-gray-500 mb-10">
            Un retour est accepté uniquement si toutes les conditions suivantes sont réunies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {CONDITIONS.map(({ label, ok }) => (
              <div
                key={label}
                className={`flex items-start gap-3 rounded-xl border px-5 py-4 ${
                  ok ? "bg-white border-gray-100" : "bg-red-50/50 border-red-100"
                }`}
              >
                {ok ? (
                  <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                )}
                <span className={`text-[13px] leading-snug ${ok ? "text-gray-700" : "text-red-500"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-shop py-16">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Comment signaler un défaut ?</h2>
        <p className="text-sm text-gray-500 mb-10">
          La procédure est simple — contactez-nous directement sur WhatsApp.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="bg-[#FDF8F8] rounded-2xl border border-gray-100 p-6 relative">
              <div className="absolute top-4 right-5 text-[11px] font-bold text-gray-200 tabular-nums">
                0{i + 1}
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#fff3bb] flex items-center justify-center mb-4">
                <step.Icon size={20} className="text-gray-700" />
              </div>
              <h3 className="text-[14px] font-bold mb-1.5">{step.title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FDF8F8] py-16">
        <div className="container-shop">
          <h2 className="text-3xl font-bold tracking-tight mb-10">Questions fréquentes</h2>
          <div className="max-w-2xl flex flex-col gap-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                <div className="px-6 py-4 flex items-start gap-3">
                  <CheckCircle size={16} className="text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-semibold mb-1">{faq.q}</p>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-brand-blue-dark py-16">
        <div className="container-shop">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                Vous avez reçu un article défectueux ?
              </h2>
              <p className="text-sm text-white/60">
                Contactez-nous immédiatement avec des photos — nous trouvons une solution rapidement.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://wa.me/2250777063646"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href="tel:+2250777063646"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform"
              >
                <Phone size={16} /> Appeler
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* LINKS */}
      <section className="container-shop py-10">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/help/shipping"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-black transition-colors border border-gray-200 rounded-full px-5 py-2.5"
          >
            <Truck size={14} /> Informations de livraison
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-black transition-colors border border-gray-200 rounded-full px-5 py-2.5"
          >
            Continuer mes achats →
          </Link>
        </div>
      </section>
    </>
  );
}
