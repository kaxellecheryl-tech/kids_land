import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Heart, Sparkles, ShieldCheck,
  Truck, Users, Star, MapPin, Package,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre Histoire",
  description: "Découvrez l'histoire de Kids Land, la boutique de vêtements enfants premium en Côte d'Ivoire.",
};

const MILESTONES = [
  {
    year: "2021",
    title: "L'idée naît",
    desc: "Frustrés de ne pas trouver en Côte d'Ivoire les marques enfants qu'ils admiraient à l'étranger, les fondateurs de Kids Land décident de changer les choses.",
    bg: "#F6E5E5",
  },
  {
    year: "2022",
    title: "Les premières commandes",
    desc: "Kids Land ouvre ses portes avec un catalogue de 50 références soigneusement sélectionnées. Les premières livraisons sont assurées à la main, à Abidjan.",
    bg: "#99C5FF",
  },
  {
    year: "2023",
    title: "La boutique en ligne",
    desc: "Face à la demande croissante, le site e-commerce est lancé. Les commandes affluent de tout Abidjan, puis de l'intérieur du pays.",
    bg: "#d8f5c0",
  },
  {
    year: "2024",
    title: "500+ références",
    desc: "Le catalogue dépasse les 500 articles. De nouvelles marques comme Babybol, George et Zara Mini rejoignent la sélection Kids Land.",
    bg: "#fff3bb",
  },
  {
    year: "2025",
    title: "Aujourd'hui",
    desc: "Kids Land livre dans toute la Côte d'Ivoire et prépare son expansion vers les pays voisins. La mission reste la même : rendre le style premium accessible à tous.",
    bg: "#ffe8d4",
  },
];

const VALUES = [
  {
    Icon: ShieldCheck,
    title: "Authenticité",
    desc: "Chaque article provient directement des marques officielles ou de distributeurs agréés. Zéro compromis, zéro contrefaçon.",
    bg: "#d8f5c0",
  },
  {
    Icon: Heart,
    title: "Bienveillance",
    desc: "Nous sélectionnons chaque pièce comme si elle était destinée à nos propres enfants. La qualité n'est pas négociable.",
    bg: "#F6E5E5",
  },
  {
    Icon: Truck,
    title: "Proximité",
    desc: "Livraison rapide, service client humain, retours sans tracas. Nous sommes là à chaque étape de votre commande.",
    bg: "#99C5FF",
  },
  {
    Icon: Sparkles,
    title: "Style",
    desc: "Le style n'a pas d'âge. Nous croyons que chaque enfant mérite des vêtements qui reflètent sa personnalité.",
    bg: "#fff3bb",
  },
];

const STATS = [
  { value: "500+",  label: "Références",      Icon: Package },
  { value: "12+",   label: "Marques",          Icon: Star    },
  { value: "48h",   label: "Livraison max",    Icon: Truck   },
  { value: "2 000+",label: "Familles servies", Icon: Users   },
];

export default function AboutPage() {
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
            <div className="mb-4"><Heart size={48} className="text-gray-700" /></div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Notre histoire
            </h1>
            <p className="text-base text-gray-700 leading-relaxed">
              Kids Land est née d&apos;une conviction simple : les enfants ivoiriens méritent
              les mêmes marques et la même qualité que partout ailleurs dans le monde.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-brand-blue-dark py-12">
        <div className="container-shop">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label, Icon }) => (
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

      {/* STORY */}
      <section className="container-shop py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Tout a commencé par une frustration
            </h2>
            <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
              <p>
                En 2021, les fondateurs de Kids Land revenaient d&apos;un voyage en Europe avec
                des valises pleines de vêtements pour leurs enfants. Des pièces Primark Kids,
                H&amp;M, Zara Mini — introuvables à Abidjan, ou disponibles uniquement à des
                prix prohibitifs dans quelques boutiques du Plateau.
              </p>
              <p>
                Ils se sont demandé pourquoi. Pourquoi les parents ivoiriens devaient-ils
                se contenter de copies, payer des prix exorbitants ou attendre le prochain
                voyage pour habiller leurs enfants bien ? La réponse : personne n&apos;avait
                encore décidé de s&apos;en occuper sérieusement.
              </p>
              <p>
                Kids Land a été créée pour combler ce vide. Avec une promesse simple :
                des marques authentiques, des prix justes, une livraison rapide — partout
                en Côte d&apos;Ivoire.
              </p>
            </div>
          </div>

          {/* Pull quote */}
          <div className="lg:pt-10">
            <blockquote className="rounded-3xl bg-[#99C5FF] px-8 py-10 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/20" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/20" />
              <div className="relative z-10">
                <div className="text-5xl font-black text-white/30 leading-none mb-4">"</div>
                <p className="text-xl font-bold leading-snug tracking-tight text-gray-800 mb-6">
                  Chaque enfant mérite de s&apos;habiller avec style,
                  peu importe où il grandit.
                </p>
                <div className="text-[12px] font-bold uppercase tracking-widest text-gray-600">
                  — Les fondateurs de Kids Land
                </div>
              </div>
            </blockquote>

            {/* Location */}
            <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FDF8F8] border border-gray-100">
              <MapPin size={16} className="text-brand-orange shrink-0" />
              <span className="text-sm text-gray-600">
                Fondée à <strong className="text-black">Abidjan, Côte d&apos;Ivoire</strong> — livraison dans tout le pays
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-[#FDF8F8] py-20">
        <div className="container-shop">
          <h2 className="text-3xl font-bold tracking-tight mb-12">Notre parcours</h2>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gray-200 hidden sm:block" />
            <div className="space-y-6">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className="flex gap-6 items-start">
                  {/* dot */}
                  <div
                    className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center shrink-0 relative z-10 text-[11px] font-black"
                    style={{ backgroundColor: m.bg }}
                  >
                    {i === MILESTONES.length - 1
                      ? <Star size={16} className="text-gray-700" />
                      : <span className="text-gray-700">{m.year.slice(2)}</span>
                    }
                  </div>
                  {/* card */}
                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{ backgroundColor: m.bg }}
                      >
                        {m.year}
                      </span>
                      <h3 className="text-[15px] font-bold">{m.title}</h3>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="container-shop py-20">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Ce qui nous guide</h2>
        <p className="text-sm text-gray-500 mb-12">
          Quatre valeurs qui orientent chacune de nos décisions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ Icon, title, desc, bg }) => (
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

      {/* CTA */}
      <section className="bg-brand-blue-dark py-20">
        <div className="container-shop flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-3">
              Rejoignez l&apos;aventure Kids Land
            </h2>
            <p className="text-base text-white/60 max-w-md">
              Plus de 2 000 familles nous font déjà confiance. Découvrez notre sélection
              et faites plaisir à vos enfants.
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
              href="/brands"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-white/20 transition-colors"
            >
              Nos marques
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
