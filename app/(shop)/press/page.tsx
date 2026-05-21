import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Newspaper, Download, Mail,
  ExternalLink, Quote, Radio, Tv, FileText,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presse",
  description: "Espace presse de Kids Land : communiqués, visuels, chiffres clés et contact médias.",
};

const PRESS_MENTIONS = [
  {
    outlet: "Abidjan.net",
    date: "Mars 2025",
    title: "Kids Land, la boutique qui veut démocratiser la mode enfant en Côte d'Ivoire",
    type: "Web",
    Icon: FileText,
    bg: "#d8f5c0",
  },
  {
    outlet: "Pulse CI",
    date: "Janvier 2025",
    title: "Les 10 startups ivoiriennes à suivre en 2025",
    type: "Web",
    Icon: FileText,
    bg: "#99C5FF",
  },
  {
    outlet: "RTI 1",
    date: "Novembre 2024",
    title: "Le boom de l'e-commerce en Côte d'Ivoire — reportage",
    type: "TV",
    Icon: Tv,
    bg: "#fff3bb",
  },
  {
    outlet: "Frat Mat",
    date: "Septembre 2024",
    title: "Kids Land : commander des vêtements enfants depuis son canapé",
    type: "Presse écrite",
    Icon: Newspaper,
    bg: "#F6E5E5",
  },
  {
    outlet: "Jeune Afrique Business",
    date: "Juin 2024",
    title: "Retail & mode : les nouveaux acteurs de l'Afrique francophone",
    type: "Magazine",
    Icon: Radio,
    bg: "#ffe8d4",
  },
];

const KEY_FIGURES = [
  { value: "2021",   label: "Année de création" },
  { value: "500+",   label: "Références au catalogue" },
  { value: "12+",    label: "Marques partenaires" },
  { value: "2 000+", label: "Familles clientes" },
  { value: "24h",    label: "Délai de livraison Abidjan" },
  { value: "30j",    label: "Politique de retour" },
];

const ASSETS = [
  {
    title: "Logo Kids Land (SVG + PNG)",
    desc: "Versions fond blanc, fond sombre et couleurs de marque",
    Icon: Download,
    bg: "#d8f5c0",
  },
  {
    title: "Charte graphique",
    desc: "Couleurs, typographies, usages autorisés et interdits",
    Icon: Download,
    bg: "#99C5FF",
  },
  {
    title: "Photos produits haute définition",
    desc: "Sélection de 20 visuels libres de droits pour la presse",
    Icon: Download,
    bg: "#fff3bb",
  },
  {
    title: "Communiqué de presse — Lancement 2025",
    desc: "Présentation de la nouvelle plateforme et du catalogue étendu",
    Icon: FileText,
    bg: "#F6E5E5",
  },
];

export default function PressPage() {
  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-16 px-6 bg-[#F6E5E5]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div className="max-w-2xl">
            <div className="mb-4"><Newspaper size={48} className="text-gray-700" /></div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Espace presse
            </h1>
            <p className="text-base text-gray-700 leading-relaxed">
              Bienvenue dans l&apos;espace presse de Kids Land. Retrouvez ici nos communiqués,
              chiffres clés, visuels et le contact de notre équipe relations médias.
            </p>
          </div>
        </div>
      </section>

      {/* KEY FIGURES */}
      <section className="bg-brand-blue-dark py-14">
        <div className="container-shop">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {KEY_FIGURES.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-white/50 mt-1 leading-tight">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="container-shop py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Kids Land en quelques mots
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
              <p>
                Kids Land est la première boutique en ligne ivoirienne spécialisée dans
                les vêtements et accessoires enfants de grandes marques internationales.
                Fondée à Abidjan en 2021, elle propose plus de 500 références authentiques
                issues de marques comme Zara Mini, H&amp;M Kids, Primark, Babybol ou encore George.
              </p>
              <p>
                La mission de Kids Land est simple : rendre le style premium accessible à
                toutes les familles de Côte d&apos;Ivoire, avec une livraison rapide partout dans le pays.
              </p>
              <p>
                En 2025, Kids Land prépare son expansion vers les pays voisins de la sous-région
                CEDEAO, avec l&apos;ambition de devenir la référence e-commerce mode enfant en
                Afrique de l&apos;Ouest francophone.
              </p>
            </div>
          </div>

          {/* Pull quote */}
          <blockquote className="rounded-3xl bg-[#99C5FF] px-8 py-10 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/20" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/20" />
            <div className="relative z-10">
              <Quote size={40} className="text-white/30 mb-4" />
              <p className="text-xl font-bold leading-snug tracking-tight text-gray-800 mb-6">
                Kids Land prouve qu&apos;il est possible de bâtir un acteur
                e-commerce sérieux depuis Abidjan, pour Abidjan.
              </p>
              <div className="text-[12px] font-bold uppercase tracking-widest text-gray-600">
                — Pulse CI, Janvier 2025
              </div>
            </div>
          </blockquote>
        </div>
      </section>

      {/* PRESS MENTIONS */}
      <section className="bg-[#FDF8F8] py-20">
        <div className="container-shop">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Ils parlent de nous</h2>
          <p className="text-sm text-gray-500 mb-12">
            Une sélection de nos apparitions dans les médias.
          </p>
          <div className="space-y-4">
            {PRESS_MENTIONS.map(({ outlet, date, title, type, Icon, bg }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-stretch"
              >
                <div className="w-1.5 shrink-0" style={{ backgroundColor: bg }} />
                <div className="flex items-center gap-4 px-5 py-4 flex-1">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon size={18} className="text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                        {outlet}
                      </span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[11px] text-gray-400">{date}</span>
                      <span
                        className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: bg }}
                      >
                        {type}
                      </span>
                    </div>
                    <p className="text-[14px] font-semibold leading-snug truncate">{title}</p>
                  </div>
                  <button className="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ExternalLink size={15} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS KIT */}
      <section className="container-shop py-20">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Kit presse</h2>
        <p className="text-sm text-gray-500 mb-12">
          Tous les éléments dont vous avez besoin pour parler de Kids Land.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {ASSETS.map(({ title, desc, Icon, bg }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-4 hover:border-gray-200 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon size={18} className="text-gray-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-bold mb-1 group-hover:text-brand-orange transition-colors">
                  {title}
                </h3>
                <p className="text-[12px] text-gray-500">{desc}</p>
              </div>
              <Download size={15} className="text-gray-300 group-hover:text-brand-orange transition-colors shrink-0 mt-1" />
            </div>
          ))}
        </div>
        <p className="text-[12px] text-gray-400 mt-6">
          Les assets du kit presse sont disponibles sur demande. Écrivez-nous à{" "}
          <a href="mailto:info@kidsland.africa" className="text-brand-orange hover:underline font-medium">
            info@kidsland.africa
          </a>{" "}
          pour obtenir l&apos;accès complet.
        </p>
      </section>

      {/* CONTACT PRESS */}
      <section className="bg-[#FDF8F8] py-16">
        <div className="container-shop max-w-2xl">
          <div className="rounded-2xl bg-white border border-gray-100 p-8 flex gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-[#F6E5E5] flex items-center justify-center shrink-0">
              <Mail size={22} className="text-gray-700" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold mb-1">Contact relations médias</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                Pour toute demande d&apos;interview, partenariat éditorial, demande de visuels
                ou informations complémentaires, notre équipe presse répond sous 24h.
              </p>
              <div className="space-y-2 mb-5">
                <div className="text-[13px] text-gray-700">
                  <span className="font-semibold">Email :</span>{" "}
                  <a href="mailto:info@kidsland.africa" className="text-brand-orange hover:underline">
                    info@kidsland.africa
                  </a>
                </div>
                <div className="text-[13px] text-gray-700">
                  <span className="font-semibold">Disponibilité :</span> Lundi – Vendredi, 8h – 18h
                </div>
              </div>
              <a
                href="mailto:info@kidsland.africa"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[12px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
              >
                <Mail size={13} /> Contacter le service presse
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
              En savoir plus sur Kids Land
            </h2>
            <p className="text-base text-white/60 max-w-md">
              Découvrez notre histoire, nos valeurs et notre catalogue.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform"
            >
              Notre histoire <ArrowRight size={15} />
            </Link>
            <Link
              href="/about/values"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-white/20 transition-colors"
            >
              Nos engagements
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
