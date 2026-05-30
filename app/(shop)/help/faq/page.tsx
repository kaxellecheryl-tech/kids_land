"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, ChevronDown, Truck, RotateCcw, ShieldCheck,
  CreditCard, Package, MessageCircle, Phone, Search,
  type LucideIcon,
} from "lucide-react";

type FaqItem = { q: string; a: string };
type Category = { id: string; label: string; Icon: LucideIcon; items: FaqItem[] };

const CATEGORIES: Category[] = [
  {
    id: "commandes",
    label: "Commandes",
    Icon: Package,
    items: [
      {
        q: "Comment passer une commande ?",
        a: "Parcourez notre catalogue, ajoutez les articles souhaités au panier, puis suivez les étapes de validation : adresse de livraison, mode de paiement, confirmation. Vous recevrez un SMS et un email de confirmation immédiatement.",
      },
      {
        q: "Puis-je modifier ma commande après confirmation ?",
        a: "Oui, tant que la commande n'a pas été expédiée. Contactez-nous rapidement via WhatsApp ou par téléphone avec votre numéro de commande.",
      },
      {
        q: "Comment annuler une commande ?",
        a: "Une annulation est possible avant l'expédition. Contactez notre service client dès que possible. Si le paiement a déjà été effectué, un remboursement complet est traité sous 3 à 5 jours ouvrés.",
      },
      {
        q: "Puis-je commander sans créer de compte ?",
        a: "Oui. Vous pouvez passer commande en tant qu'invité en renseignant simplement vos coordonnées de livraison et un numéro de téléphone.",
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Rendez-vous sur la page « Suivi commande » et entrez votre numéro de commande ainsi que votre numéro de téléphone. Vous pouvez aussi nous contacter directement sur WhatsApp.",
      },
    ],
  },
  {
    id: "livraison",
    label: "Livraison",
    Icon: Truck,
    items: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "Abidjan et environs : 24 à 48h. Intérieur du pays (Bouaké, Yamoussoukro, etc.) : 2 à 4 jours ouvrés. Les délais courent à partir de la confirmation du paiement.",
      },
      {
        q: "Quels sont les frais de livraison ?",
        a: "Abidjan : 1 500 F CFA. Intérieur : 3 500 F CFA. La livraison est offerte pour toute commande à partir de 25 000 F CFA.",
      },
      {
        q: "Livrez-vous le week-end ?",
        a: "Oui, du lundi au samedi, de 8h à 19h. Aucune livraison le dimanche ni les jours fériés.",
      },
      {
        q: "Que se passe-t-il si je suis absent à la livraison ?",
        a: "Le livreur vous contacte avant son passage. En cas d'absence, une seconde tentative de livraison est organisée gratuitement.",
      },
      {
        q: "Livrez-vous en dehors de la Côte d'Ivoire ?",
        a: "Nous livrons actuellement uniquement en Côte d'Ivoire. La livraison vers les pays de la sous-région CEDEAO est en cours de déploiement.",
      },
    ],
  },
  {
    id: "retours",
    label: "Retours",
    Icon: RotateCcw,
    items: [
      {
        q: "Quel est votre délai de retour ?",
        a: "Vous disposez de 30 jours à compter de la réception pour retourner un article, sans justification.",
      },
      {
        q: "Les retours sont-ils gratuits ?",
        a: "Oui. La récupération à domicile est entièrement prise en charge par Kids Land, sans frais supplémentaires.",
      },
      {
        q: "Quelles sont les conditions pour retourner un article ?",
        a: "L'article doit être non porté, non lavé, avec ses étiquettes d'origine. Les sous-vêtements, maillots de bain et articles personnalisés ne sont pas repris pour des raisons d'hygiène.",
      },
      {
        q: "Puis-je échanger un article plutôt que le rembourser ?",
        a: "Oui. Précisez-le lors de votre demande de retour et nous organisons un échange contre une autre taille ou un autre article de valeur équivalente, sous réserve de disponibilité.",
      },
      {
        q: "Sous quel délai suis-je remboursé ?",
        a: "Le remboursement est effectué sous 3 à 5 jours ouvrés après réception et vérification de l'article, via le même mode de paiement que la commande initiale.",
      },
    ],
  },
  {
    id: "paiement",
    label: "Paiement",
    Icon: CreditCard,
    items: [
      {
        q: "Quels modes de paiement acceptez-vous ?",
        a: "Wave, Orange Money, MTN Money et paiement par carte bancaire (Visa, Mastercard). Tous les paiements sont sécurisés via PayDunya.",
      },
      {
        q: "Mon paiement est-il sécurisé ?",
        a: "Oui. Nous utilisons PayDunya, une plateforme de paiement certifiée. Vos informations bancaires ne sont jamais stockées sur nos serveurs.",
      },
      {
        q: "Puis-je payer à la livraison ?",
        a: "Le paiement à la livraison n'est pas disponible pour le moment. Toutes les commandes sont prépayées en ligne.",
      },
      {
        q: "Comment utiliser un code promo ?",
        a: "Entrez votre code dans le champ prévu à cet effet à l'étape de validation du panier. La réduction est appliquée automatiquement.",
      },
      {
        q: "Que faire si mon paiement échoue ?",
        a: "Vérifiez que votre solde est suffisant et que vous avez saisi les bons identifiants. Si le problème persiste, contactez-nous — nous pouvons générer un nouveau lien de paiement.",
      },
    ],
  },
  {
    id: "produits",
    label: "Produits",
    Icon: ShieldCheck,
    items: [
      {
        q: "Les articles sont-ils authentiques ?",
        a: "Oui, à 100%. Tous nos articles proviennent directement des marques officielles ou de distributeurs agréés. Aucune contrefaçon.",
      },
      {
        q: "Comment choisir la bonne taille ?",
        a: "Chaque fiche produit indique le guide des tailles correspondant. En cas de doute, contactez-nous — nous vous conseillons selon l'âge et les mensurations de votre enfant.",
      },
      {
        q: "Un article affiché en stock peut-il être indisponible ?",
        a: "Dans de rares cas oui, si plusieurs clients commandent simultanément. Vous serez alors contacté rapidement pour un échange ou un remboursement.",
      },
      {
        q: "Comment être averti quand un article est de retour en stock ?",
        a: "Ajoutez l'article à vos favoris et activez les notifications dans votre compte. Vous pouvez aussi nous écrire directement pour qu'on vous prévienne.",
      },
    ],
  },
];

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-100 bg-white overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
          >
            <span className="text-[14px] font-semibold leading-snug">{item.q}</span>
            <ChevronDown
              size={16}
              className={`shrink-0 text-gray-400 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <div className="px-5 pb-5">
              <p className="text-[13px] text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("commandes");
  const [searchQuery, setSearchQuery] = useState("");

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0];

  const filteredItems = searchQuery.trim().length >= 2
    ? CATEGORIES.flatMap((c) =>
        c.items.filter(
          (item) =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((item) => ({ ...item, category: c.label }))
      )
    : null;

  const totalQuestions = CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);

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
              <div className="mb-3">
                <MessageCircle size={48} className="text-gray-700" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">
                Questions fréquentes
              </h1>
              <p className="text-sm text-gray-700">
                {totalQuestions} questions — trouvez une réponse en quelques secondes
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shop py-12">
        {/* Search */}
        <div className="relative max-w-lg mb-10">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question…"
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
          />
        </div>

        {/* Search results */}
        {filteredItems !== null ? (
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              {filteredItems.length} résultat{filteredItems.length !== 1 ? "s" : ""} pour &ldquo;{searchQuery}&rdquo;
            </p>
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center">
                <Search size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Aucune question ne correspond à votre recherche.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Essayez un autre terme ou{" "}
                  <a href="https://wa.me/2250777063646" className="text-brand-orange font-medium hover:underline">
                    contactez-nous directement
                  </a>.
                </p>
              </div>
            ) : (
              <FaqAccordion items={filteredItems} />
            )}
          </div>
        ) : (
          <div className="flex gap-10 items-start">
            {/* Sidebar nav */}
            <nav className="hidden md:flex flex-col gap-1 w-48 shrink-0 sticky top-28">
              {CATEGORIES.map((cat) => {
                const Icon = cat.Icon;
                const active = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-left transition-colors ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={15} className="shrink-0" />
                    {cat.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile category tabs */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-1 mb-6 w-full">
              {CATEGORIES.map((cat) => {
                const active = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors ${
                      active ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Questions */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#fff3bb] flex items-center justify-center">
                  <currentCategory.Icon size={18} className="text-gray-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{currentCategory.label}</h2>
                  <p className="text-[12px] text-gray-400">
                    {currentCategory.items.length} questions
                  </p>
                </div>
              </div>
              <FaqAccordion items={currentCategory.items} />
            </div>
          </div>
        )}
      </section>

      {/* CTA Contact */}
      <section className="bg-brand-blue-dark py-16">
        <div className="container-shop">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                Vous n&apos;avez pas trouvé votre réponse ?
              </h2>
              <p className="text-sm text-white/60">
                Notre équipe répond en moins de 2h, du lundi au samedi de 8h à 19h.
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

      {/* Related links */}
      <section className="container-shop py-10">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/help/shipping"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-black transition-colors border border-gray-200 rounded-full px-5 py-2.5"
          >
            <Truck size={14} /> Livraison
          </Link>
          <Link
            href="/help/returns"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-black transition-colors border border-gray-200 rounded-full px-5 py-2.5"
          >
            <RotateCcw size={14} /> Retours
          </Link>
          <Link
            href="/orders/track"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:text-black transition-colors border border-gray-200 rounded-full px-5 py-2.5"
          >
            <Package size={14} /> Suivi commande
          </Link>
        </div>
      </section>
    </>
  );
}
