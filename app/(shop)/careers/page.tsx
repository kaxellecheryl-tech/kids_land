import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Briefcase, Heart, Users, Sparkles,
  MapPin, Clock, Send, ShieldCheck, Truck, Star,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recrutement",
  description: "Rejoignez l'équipe Kids Land et participez à la construction du leader de la mode enfant en Côte d'Ivoire.",
};

const OPEN_ROLES = [
  {
    title: "Responsable service client",
    type: "CDI",
    location: "Abidjan",
    dept: "Service client",
    bg: "#F6E5E5",
    Icon: Heart,
    desc: "Vous gérez les demandes clients sur WhatsApp, email et téléphone, traitez les litiges et assurez une expérience irréprochable à chaque interaction.",
    skills: ["Excellent sens de la communication", "Maîtrise du français écrit", "Empathie & réactivité", "Expérience SAV ou call center appréciée"],
  },
  {
    title: "Gestionnaire de stock & logistique",
    type: "CDI",
    location: "Abidjan",
    dept: "Opérations",
    bg: "#99C5FF",
    Icon: Truck,
    desc: "Vous supervisez la réception, le stockage et la préparation des commandes. Vous assurez la fiabilité des stocks et coordonnez les livraisons avec nos partenaires logistiques.",
    skills: ["Organisation & rigueur", "Expérience en gestion de stock", "Maîtrise des outils de suivi", "Permis de conduire apprécié"],
  },
  {
    title: "Community Manager",
    type: "CDI",
    location: "Abidjan (hybride)",
    dept: "Marketing",
    bg: "#fff3bb",
    Icon: Sparkles,
    desc: "Vous animez nos réseaux sociaux (Instagram, TikTok, Facebook), créez du contenu photo et vidéo, gérez notre communauté et pilotez nos campagnes d'influence.",
    skills: ["Maîtrise d'Instagram & TikTok", "Sens du style & de l'image", "Créativité & initiative", "Expérience en contenu de mode appréciée"],
  },
  {
    title: "Développeur·euse Full-Stack (Next.js)",
    type: "CDI ou Freelance",
    location: "Remote",
    dept: "Tech",
    bg: "#d8f5c0",
    Icon: Star,
    desc: "Vous contribuez au développement de notre plateforme e-commerce sous Next.js 15, Prisma, Supabase et Tailwind CSS. Vous avez le sens du produit et aimez livrer vite.",
    skills: ["Next.js / React", "TypeScript", "Prisma / PostgreSQL", "Tailwind CSS"],
  },
];

const PERKS = [
  {
    Icon: Heart,
    title: "Ambiance bienveillante",
    desc: "Une équipe soudée qui avance ensemble, sans politique d'entreprise ni hiérarchie rigide.",
    bg: "#F6E5E5",
  },
  {
    Icon: ShieldCheck,
    title: "Mission qui a du sens",
    desc: "Vous contribuez chaque jour à rendre le style premium accessible aux familles ivoiriennes.",
    bg: "#d8f5c0",
  },
  {
    Icon: Sparkles,
    title: "Croissance rapide",
    desc: "Kids Land est en forte croissance. Les opportunités d'évoluer et de prendre des responsabilités sont réelles.",
    bg: "#fff3bb",
  },
  {
    Icon: Users,
    title: "Équipe locale",
    desc: "100 % ivoirienne, fière de bâtir un acteur e-commerce de référence en Afrique de l'Ouest.",
    bg: "#99C5FF",
  },
];

const PROCESS = [
  { step: "01", title: "Candidature",     desc: "Envoyez CV + message de motivation par email." },
  { step: "02", title: "Prise de contact", desc: "Notre équipe vous répond sous 72h ouvrées." },
  { step: "03", title: "Entretien",        desc: "Un échange téléphonique ou en visio pour mieux nous connaître." },
  { step: "04", title: "Décision",         desc: "Retour clair dans les 5 jours après l'entretien." },
];

export default function CareersPage() {
  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-16 px-6 bg-[#99C5FF]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div className="max-w-2xl">
            <div className="mb-4"><Briefcase size={48} className="text-gray-700" /></div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Rejoignez l&apos;aventure
            </h1>
            <p className="text-base text-gray-700 leading-relaxed">
              Kids Land grandit vite. Nous cherchons des personnes passionnées, rigoureuses
              et fières de contribuer à un projet ivoirien qui compte.
            </p>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="container-shop py-20">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Pourquoi nous rejoindre</h2>
        <p className="text-sm text-gray-500 mb-12">Ce que Kids Land vous offre au-delà du salaire.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERKS.map(({ Icon, title, desc, bg }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 p-7">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: bg }}
              >
                <Icon size={22} className="text-gray-700" />
              </div>
              <h3 className="text-[15px] font-bold mb-2">{title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OPEN ROLES */}
      <section className="bg-[#FDF8F8] py-20">
        <div className="container-shop">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Postes ouverts</h2>
          <p className="text-sm text-gray-500 mb-12">
            {OPEN_ROLES.length} poste{OPEN_ROLES.length > 1 ? "s" : ""} disponible{OPEN_ROLES.length > 1 ? "s" : ""} — Abidjan &amp; remote
          </p>
          <div className="space-y-5">
            {OPEN_ROLES.map(({ title, type, location, dept, bg, Icon, desc, skills }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                {/* Header row */}
                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-50">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon size={20} className="text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold">{title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[12px] text-gray-500">
                        <MapPin size={11} /> {location}
                      </span>
                      <span className="flex items-center gap-1 text-[12px] text-gray-500">
                        <Clock size={11} /> {type}
                      </span>
                      <span
                        className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: bg }}
                      >
                        {dept}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:info@kidsland.africa?subject=Candidature — ${title}`}
                    className="hidden sm:inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors shrink-0"
                  >
                    <Send size={12} /> Postuler
                  </a>
                </div>
                {/* Body */}
                <div className="px-6 py-5">
                  <p className="text-[13px] text-gray-600 leading-relaxed mb-4">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full bg-gray-100 text-[12px] font-medium text-gray-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`mailto:info@kidsland.africa?subject=Candidature — ${title}`}
                    className="sm:hidden mt-4 inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
                  >
                    <Send size={12} /> Postuler
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-shop py-20">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Notre processus</h2>
        <p className="text-sm text-gray-500 mb-12">Simple, rapide et transparent.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS.map(({ step, title, desc }) => (
            <div key={step} className="relative">
              <div className="text-[48px] font-black text-gray-100 leading-none mb-3">{step}</div>
              <h3 className="text-[15px] font-bold mb-2">{title}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPONTANEOUS */}
      <section className="bg-[#FDF8F8] py-16">
        <div className="container-shop max-w-2xl">
          <div className="rounded-2xl bg-white border border-gray-100 p-8 flex gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-[#ffe8d4] flex items-center justify-center shrink-0">
              <Send size={20} className="text-gray-700" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold mb-2">Candidature spontanée</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                Vous ne correspondez à aucun poste mais êtes convaincu·e de pouvoir apporter
                de la valeur à Kids Land ? Envoyez-nous votre CV et une présentation en quelques
                lignes. Nous lisons toutes les candidatures.
              </p>
              <a
                href="mailto:info@kidsland.africa?subject=Candidature spontanée"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
              >
                <Send size={12} /> Envoyer ma candidature
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-blue-dark py-20">
        <div className="container-shop flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">
              Des questions sur nos postes ?
            </h2>
            <p className="text-base text-white/60 max-w-md">
              N&apos;hésitez pas à nous écrire avant de postuler. Nous répondons sous 24h.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="mailto:info@kidsland.africa"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform"
            >
              Écrire à l&apos;équipe RH <ArrowRight size={15} />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-white/20 transition-colors"
            >
              Notre histoire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
