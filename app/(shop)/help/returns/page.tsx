import Link from "next/link";
import {
  ArrowLeft, RotateCcw, CheckCircle, XCircle, Package,
  MessageCircle, Phone, Clock, ShieldCheck, Truck, AlertCircle,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retours",
  description: "Politique de retours Kids Land — 30 jours pour changer d'avis, sans condition.",
};

const STEPS = [
  {
    Icon: MessageCircle,
    title: "Contactez-nous",
    desc: "Signalez votre retour via WhatsApp ou par email en indiquant votre numéro de commande.",
  },
  {
    Icon: Package,
    title: "Emballez l'article",
    desc: "Remettez l'article dans son emballage d'origine ou dans un emballage protecteur équivalent.",
  },
  {
    Icon: Truck,
    title: "Remise au livreur",
    desc: "Un livreur passe récupérer l'article chez vous à l'heure convenue.",
  },
  {
    Icon: CheckCircle,
    title: "Remboursement",
    desc: "Après vérification, votre remboursement est traité sous 3 à 5 jours ouvrés.",
  },
];

const ACCEPTED: { label: string; ok: boolean }[] = [
  { label: "Article non porté et non lavé",                          ok: true  },
  { label: "Étiquettes d'origine toujours attachées",               ok: true  },
  { label: "Emballage d'origine présent (ou équivalent)",           ok: true  },
  { label: "Retour dans les 30 jours suivant la réception",         ok: true  },
  { label: "Article porté, lavé ou abîmé",                          ok: false },
  { label: "Sous-vêtements ou maillots de bain (hygiène)",          ok: false },
  { label: "Article personnalisé ou sur commande spéciale",         ok: false },
  { label: "Retour au-delà de 30 jours",                            ok: false },
];

const FAQS = [
  {
    q: "Les frais de retour sont-ils gratuits ?",
    a: "Oui. La récupération à domicile est entièrement prise en charge par Kids Land, sans frais supplémentaires.",
  },
  {
    q: "Sous quel délai suis-je remboursé ?",
    a: "Le remboursement est effectué sous 3 à 5 jours ouvrés après réception et vérification de l'article retourné.",
  },
  {
    q: "Puis-je échanger un article plutôt que le rembourser ?",
    a: "Oui, nous proposons l'échange contre une autre taille ou un autre article de valeur équivalente, sous réserve de disponibilité.",
  },
  {
    q: "Comment se passe le remboursement ?",
    a: "Le remboursement est effectué via le même mode de paiement utilisé lors de la commande (Wave, Orange Money, MTN, carte).",
  },
  {
    q: "Que faire si j'ai reçu un article défectueux ?",
    a: "Contactez-nous immédiatement avec des photos de l'article. Un remplacement ou un remboursement complet est accordé sans délai.",
  },
  {
    q: "Puis-je retourner un article acheté en solde ?",
    a: "Oui, les articles soldés bénéficient de la même politique de retour que les articles à prix plein.",
  },
];

export default function ReturnsPage() {
  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6 bg-[#d8f5c0]">
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
                30 jours pour changer d&apos;avis — retour à domicile, sans frais
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/60 rounded-2xl px-6 py-4">
              <Clock size={20} className="text-gray-600 shrink-0" />
              <div>
                <div className="text-lg font-bold tracking-tight">30 jours</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-gray-500">
                  Délai de retour
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="container-shop py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { Icon: RotateCcw,   bg: "#d8f5c0", title: "30 jours",       desc: "Pour changer d'avis sans justification" },
            { Icon: Truck,       bg: "#99C5FF", title: "Gratuit",         desc: "Récupération à domicile offerte" },
            { Icon: ShieldCheck, bg: "#fff3bb", title: "Remboursement",   desc: "Intégral sous 3–5 jours ouvrés" },
          ].map(({ Icon, bg, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-6 flex items-center gap-4"
              style={{ backgroundColor: bg }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-gray-700" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-tight">{title}</div>
                <div className="text-[13px] text-gray-600 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONDITIONS */}
      <section className="bg-[#FDF8F8] py-16">
        <div className="container-shop">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Conditions de retour</h2>
          <p className="text-sm text-gray-500 mb-10">
            Pour être accepté, l&apos;article retourné doit respecter les critères suivants.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {ACCEPTED.map(({ label, ok }) => (
              <div
                key={label}
                className={`flex items-start gap-3 rounded-xl border px-5 py-4 ${
                  ok
                    ? "bg-white border-gray-100"
                    : "bg-red-50/50 border-red-100"
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
        <h2 className="text-3xl font-bold tracking-tight mb-2">Comment retourner un article ?</h2>
        <p className="text-sm text-gray-500 mb-10">
          La procédure est simple et entièrement prise en charge.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.title} className="bg-[#FDF8F8] rounded-2xl border border-gray-100 p-6 relative">
              <div className="absolute top-4 right-5 text-[11px] font-bold text-gray-200 tabular-nums">
                0{i + 1}
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#d8f5c0] flex items-center justify-center mb-4">
                <step.Icon size={20} className="text-gray-700" />
              </div>
              <h3 className="text-[14px] font-bold mb-1.5">{step.title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALERT DEFECTUEUX */}
      <section className="container-shop pb-10">
        <div className="rounded-2xl bg-brand-orange/10 border border-brand-orange/20 px-8 py-6 flex items-start gap-4">
          <AlertCircle size={22} className="text-brand-orange shrink-0 mt-0.5" />
          <div>
            <p className="text-[14px] font-bold text-brand-orange mb-1">
              Article défectueux ou erreur de commande ?
            </p>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              Si vous avez reçu un article endommagé ou différent de votre commande, contactez-nous
              immédiatement avec des photos. Nous procédons à un remplacement ou un remboursement
              complet <strong>sans délai et sans condition</strong>.
            </p>
          </div>
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
                Besoin d&apos;aide pour un retour ?
              </h2>
              <p className="text-sm text-white/60">
                Notre équipe vous accompagne du lundi au samedi, de 8h à 19h.
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
