import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ShieldCheck, Leaf, Heart,
  Users, Truck, Star, Recycle, BadgeCheck,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Engagements",
  description: "Découvrez les engagements de Kids Land : authenticité, qualité, service client et impact local en Côte d'Ivoire.",
};

const COMMITMENTS = [
  {
    Icon: ShieldCheck,
    title: "100 % authentique",
    desc: "Chaque article vendu sur Kids Land provient directement des marques officielles ou de distributeurs agréés. Nous refusons catégoriquement la contrefaçon sous toutes ses formes. Avant chaque référencement, nos équipes vérifient l'origine et la traçabilité du produit.",
    badge: "Authenticité",
    bg: "#d8f5c0",
    badgeBg: "#7ED957",
  },
  {
    Icon: Star,
    title: "Qualité sans compromis",
    desc: "Nous sélectionnons chaque pièce comme si elle était destinée à nos propres enfants. Matières, finitions, coutures — chaque article passe un contrôle qualité avant d'intégrer notre catalogue. Moins de références, mais meilleures.",
    badge: "Qualité",
    bg: "#fff3bb",
    badgeBg: "#FFD21F",
  },
  {
    Icon: Heart,
    title: "Service humain & bienveillant",
    desc: "Derrière Kids Land, il y a une équipe ivoirienne qui répond à vos messages, comprend vos urgences et résout vos problèmes sans script. Pas de bots, pas de formulaires sans suite — une vraie personne, disponible du lundi au samedi de 8h à 19h.",
    badge: "Service",
    bg: "#F6E5E5",
    badgeBg: "#E8A0A0",
  },
  {
    Icon: Truck,
    title: "Livraison fiable & rapide",
    desc: "Nous nous engageons à expédier toute commande confirmée sous 24h ouvrées à Abidjan. En cas de retard, nous vous prévenons avant que vous nous contactiez. La ponctualité est une marque de respect.",
    badge: "Livraison",
    bg: "#99C5FF",
    badgeBg: "#6D86DD",
  },
  {
    Icon: Recycle,
    title: "Retours sans tracas",
    desc: "Nous croyons que l'achat en ligne doit être sans risque. C'est pourquoi nous offrons 30 jours pour changer d'avis, avec récupération à domicile gratuite. Aucune question, aucune mauvaise humeur.",
    badge: "Retours",
    bg: "#ffe8d4",
    badgeBg: "#FF751F",
  },
  {
    Icon: Users,
    title: "Impact local & emploi ivoirien",
    desc: "Chaque commande passée sur Kids Land finance des emplois locaux : livreurs, service client, logistique, communication. Notre ambition est de construire une infrastructure e-commerce 100 % made in Côte d'Ivoire.",
    badge: "Impact local",
    bg: "#d8f5c0",
    badgeBg: "#7ED957",
  },
  {
    Icon: Leaf,
    title: "Vers une mode plus responsable",
    desc: "Nous réduisons progressivement les emballages plastiques au profit d'alternatives biodégradables. Nous privilégions les marques qui publient leurs démarches environnementales et nous traçons notre propre empreinte carbone logistique.",
    badge: "Environnement",
    bg: "#d8f5c0",
    badgeBg: "#7ED957",
  },
  {
    Icon: BadgeCheck,
    title: "Transparence & honnêteté",
    desc: "Prix réels, stocks en temps réel, délais honnêtes. Si un article est en rupture, nous le disons. Si une livraison prend du retard, nous l'annonçons. Nous préférons la vérité inconfortable au silence confortable.",
    badge: "Transparence",
    bg: "#99C5FF",
    badgeBg: "#6D86DD",
  },
];

const NUMBERS = [
  { value: "100 %", label: "Articles authentiques", Icon: ShieldCheck },
  { value: "30j",   label: "Pour retourner un article", Icon: Recycle  },
  { value: "24h",   label: "Délai d'expédition max",   Icon: Truck    },
  { value: "0",     label: "Contrefaçons tolérées",    Icon: BadgeCheck},
];

export default function ValuesPage() {
  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-16 px-6 bg-[#d8f5c0]">
        <div className="container-shop">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Notre histoire
          </Link>
          <div className="max-w-2xl">
            <div className="mb-4"><BadgeCheck size={48} className="text-gray-700" /></div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Nos engagements
            </h1>
            <p className="text-base text-gray-700 leading-relaxed">
              Kids Land n&apos;est pas qu&apos;une boutique en ligne. C&apos;est une promesse renouvelée
              à chaque commande : authenticité, qualité, service humain et impact local.
            </p>
          </div>
        </div>
      </section>

      {/* KEY NUMBERS */}
      <section className="bg-brand-blue-dark py-12">
        <div className="container-shop">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {NUMBERS.map(({ value, label, Icon }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon size={22} className="text-white/40" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {value}
                </div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-white/50 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="container-shop py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Pourquoi des engagements formels ?
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
              <p>
                Dans un marché où la confiance se construit lentement, nous avons choisi
                de formuler des engagements clairs et mesurables plutôt que des promesses vagues.
                Chaque engagement ci-dessous est associé à une pratique concrète, vérifiable
                dans nos processus quotidiens.
              </p>
              <p>
                Si vous estimez que nous ne tenons pas l&apos;un de ces engagements, nous voulons
                le savoir. Contactez-nous directement — nous prenons chaque retour au sérieux
                et publierons nos progrès régulièrement.
              </p>
            </div>
          </div>

          {/* Pull quote */}
          <blockquote className="rounded-3xl bg-[#fff3bb] px-8 py-10 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/20" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/20" />
            <div className="relative z-10">
              <div className="text-5xl font-black text-black/10 leading-none mb-4">"</div>
              <p className="text-xl font-bold leading-snug tracking-tight text-gray-800 mb-6">
                Un engagement non respecté est pire qu&apos;une promesse
                jamais faite. Alors nous n&apos;en faisons que ceux que
                nous pouvons tenir.
              </p>
              <div className="text-[12px] font-bold uppercase tracking-widest text-gray-500">
                — L&apos;équipe Kids Land
              </div>
            </div>
          </blockquote>
        </div>
      </section>

      {/* COMMITMENTS GRID */}
      <section className="bg-[#FDF8F8] py-20">
        <div className="container-shop">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Nos 8 engagements
          </h2>
          <p className="text-sm text-gray-500 mb-12">
            Des engagements concrets, pas des slogans.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMMITMENTS.map(({ Icon, title, desc, badge, bg, badgeBg }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 p-7 flex gap-5"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={22} className="text-gray-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[15px] font-bold">{title}</h3>
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white hidden sm:inline"
                      style={{ backgroundColor: badgeBg }}
                    >
                      {badge}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARTER */}
      <section className="container-shop py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#d8f5c0] flex items-center justify-center mx-auto mb-6">
            <BadgeCheck size={28} className="text-gray-700" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Notre charte client
          </h2>
          <p className="text-[15px] text-gray-600 leading-relaxed mb-10">
            En commandant sur Kids Land, vous bénéficiez de droits clairs et non négociables.
            Pas de petites lignes cachées, pas de surprises.
          </p>
          <div className="text-left space-y-3">
            {[
              "Droit à un remboursement complet dans les 30 jours sans justification",
              "Droit à un article identique à la description et aux photos du site",
              "Droit à une réponse humaine sous 24h en cas de problème",
              "Droit à la transparence sur les délais réels de livraison",
              "Droit à annuler une commande avant expédition sans frais",
              "Droit à la protection de vos données personnelles",
            ].map((right) => (
              <div key={right} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#d8f5c0] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck size={11} className="text-gray-700" />
                </div>
                <span className="text-[14px] text-gray-700">{right}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-blue-dark py-20">
        <div className="container-shop flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">
              Des valeurs concrètes, dès aujourd&apos;hui
            </h2>
            <p className="text-base text-white/60 max-w-md">
              Découvrez notre sélection ou contactez-nous si vous avez
              des questions sur nos engagements.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform"
            >
              Découvrir la collection <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-white/20 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
