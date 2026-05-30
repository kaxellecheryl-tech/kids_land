import Link from "next/link";
import {
  ArrowLeft, Truck, MapPin, Clock, Package, CheckCircle,
  MessageCircle, Phone, ShieldCheck, RotateCcw,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livraison",
  description: "Tout savoir sur la livraison Kids Land — délais, tarifs et zones couvertes.",
};

async function getShippingZones() {
  try {
    return await prisma.shippingZone.findMany({
      where: { isActive: true },
      orderBy: { fee: "asc" },
    });
  } catch {
    return [];
  }
}

const STEPS = [
  {
    Icon: CheckCircle,
    title: "Commande validée",
    desc: "Vous recevez un SMS et un email de confirmation dès que votre paiement est accepté.",
  },
  {
    Icon: Package,
    title: "Préparation",
    desc: "Votre commande est préparée et emballée avec soin dans nos 24h ouvrées.",
  },
  {
    Icon: Truck,
    title: "Expédition",
    desc: "Un livreur est assigné et vous recevez un SMS avec son numéro de téléphone.",
  },
  {
    Icon: MapPin,
    title: "Livraison",
    desc: "Le livreur vous contacte avant d'arriver. Vous choisissez l'heure qui vous convient.",
  },
];

const FAQS = [
  {
    q: "Puis-je modifier mon adresse après commande ?",
    a: "Oui, tant que votre commande n'a pas été expédiée. Contactez-nous via WhatsApp ou par téléphone au plus vite.",
  },
  {
    q: "Que se passe-t-il si je suis absent à la livraison ?",
    a: "Le livreur vous contacte avant son passage. En cas d'absence, une seconde tentative est organisée gratuitement.",
  },
  {
    q: "Livrez-vous le week-end ?",
    a: "Oui, nos livraisons s'effectuent du lundi au samedi, de 8h à 19h.",
  },
  {
    q: "Comment suivre ma commande ?",
    a: "Connectez-vous à votre compte Kids Land et rendez-vous dans la section « Mes commandes ». Vous pouvez aussi nous contacter directement.",
  },
  {
    q: "Livrez-vous en dehors de la Côte d'Ivoire ?",
    a: "Nous livrons actuellement en Côte d'Ivoire. La livraison vers d'autres pays de la sous-région est en cours de déploiement.",
  },
];

type Zone = {
  id: string;
  name: string;
  fee: number;
  cities: string[];
};

const ZONE_STYLES: Record<string, { bg: string; accent: string; delay: string }> = {
  abidjan:   { bg: "#99C5FF", accent: "#6D86DD", delay: "24–48h" },
  interieur: { bg: "#d8f5c0", accent: "#7ED957", delay: "2–4 jours" },
};
const FALLBACK_STYLE = { bg: "#fff3bb", accent: "#FFD21F", delay: "3–5 jours" };

export default async function ShippingPage() {
  const zones = await getShippingZones() as Zone[];

  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6 bg-[#99C5FF]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3"><Truck size={48} className="text-gray-700" /></div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">Livraison</h1>
              <p className="text-sm text-gray-700">
                Rapide, fiable et suivie — partout en Côte d&apos;Ivoire
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/60 rounded-2xl px-6 py-4">
              <Clock size={20} className="text-gray-600 shrink-0" />
              <div>
                <div className="text-lg font-bold tracking-tight">24–48h</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-gray-500">
                  Abidjan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ZONES */}
      <section className="container-shop py-16">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Zones et tarifs</h2>
        <p className="text-sm text-gray-500 mb-10">
          Tarifs fixes, sans surprise. La livraison est offerte à partir de 25&nbsp;000&nbsp;F d&apos;achat.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => {
            const style = ZONE_STYLES[zone.id] ?? FALLBACK_STYLE;
            return (
              <div
                key={zone.id}
                className="rounded-2xl overflow-hidden border border-gray-100"
              >
                {/* Header */}
                <div
                  className="px-8 py-6 flex items-center justify-between"
                  style={{ backgroundColor: style.bg }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                      <MapPin size={18} className="text-gray-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-600">
                        Zone
                      </div>
                      <div className="text-xl font-bold tracking-tight">{zone.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold tracking-tight">
                      {formatPrice(zone.fee)}
                    </div>
                    <div className="text-[11px] font-medium uppercase tracking-widest text-gray-600 mt-0.5">
                      par commande
                    </div>
                  </div>
                </div>

                {/* Délai */}
                <div className="bg-white px-8 py-4 flex items-center gap-2 border-b border-gray-100">
                  <Clock size={15} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600">
                    Délai estimé :{" "}
                    <span className="font-semibold text-black">{style.delay}</span>
                  </span>
                </div>

                {/* Villes */}
                <div className="bg-white px-8 py-5">
                  <div className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 mb-3">
                    Villes couvertes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {zone.cities.map((city: string) => (
                      <span
                        key={city}
                        className="text-[12px] font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Livraison offerte */}
        <div className="mt-6 rounded-2xl bg-brand-blue-dark text-white px-8 py-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <Truck size={22} />
          </div>
          <div>
            <div className="font-bold text-base">Livraison offerte</div>
            <div className="text-sm text-white/70 mt-0.5">
              Pour toute commande à partir de <strong className="text-white">25&nbsp;000&nbsp;F CFA</strong>, la livraison est gratuite partout en Côte d&apos;Ivoire.
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#FDF8F8] py-16">
        <div className="container-shop">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Comment ça marche ?</h2>
          <p className="text-sm text-gray-500 mb-10">
            De votre commande à votre porte, on s&apos;occupe de tout.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.title} className="bg-white rounded-2xl border border-gray-100 p-6 relative">
                <div className="absolute top-4 right-5 text-[11px] font-bold text-gray-200 tabular-nums">
                  0{i + 1}
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#99C5FF] flex items-center justify-center mb-4">
                  <step.Icon size={20} className="text-gray-700" />
                </div>
                <h3 className="text-[14px] font-bold mb-1.5">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shop py-16">
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
      </section>

      {/* CONTACT CTA */}
      <section className="bg-brand-blue-dark py-16 mb-0">
        <div className="container-shop">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                Une question sur votre livraison ?
              </h2>
              <p className="text-sm text-white/60">
                Notre équipe est disponible 7j/7 pour vous aider.
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

      {/* REASSURANCE STRIP */}
      <section className="bg-[#FDF8F8] py-8">
        <div className="container-shop">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {[
              { Icon: ShieldCheck, label: "Articles authentiques" },
              { Icon: RotateCcw,   label: "Retours sous 30 jours" },
              { Icon: Truck,       label: "Livraison suivie" },
              { Icon: MessageCircle, label: "Support 7j/7" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[13px] font-medium text-gray-600">
                <Icon size={16} className="text-gray-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
