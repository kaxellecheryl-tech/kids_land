import Link from "next/link";
import Image from "next/image";
import { Camera, Users, X, MessageCircle } from "lucide-react";

const FOOTER_COLS = [
  {
    title: "Boutique",
    links: [
      { href: "/products?filter=new", label: "Nouveautés" },
      { href: "/products?gender=girl", label: "Filles" },
      { href: "/products?gender=boy", label: "Garçons" },
      { href: "/products?category=bebe", label: "Bébé" },
      { href: "/products?category=accessoires", label: "Accessoires" },
      { href: "/products?filter=sale", label: "Soldes" },
    ],
  },
  {
    title: "Service client",
    links: [
      { href: "/help/shipping", label: "Livraison" },
      { href: "/help/returns", label: "Retours" },
      { href: "/orders/track", label: "Suivi commande" },
      { href: "/help/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "À propos",
    links: [
      { href: "/about", label: "Notre histoire" },
      { href: "/brands", label: "Nos marques" },
      { href: "/about/values", label: "Nos engagements" },
      { href: "/careers", label: "Recrutement" },
      { href: "/press", label: "Presse" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-14 pb-9">
      <div className="container-shop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="inline-block mb-3">
              <Image
                src="/LOGO.png"
                alt="Kids Land"
                width={240}
                height={96}
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="text-[13px] text-gray-600 leading-relaxed max-w-[280px]">
              Le meilleur des vêtements et accessoires pour enfants, des grandes
              marques internationales directement chez vous en Côte d&apos;Ivoire.
            </p>
            <div className="flex gap-2.5 mt-6">
              {[Camera, Users, X, MessageCircle].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-brand-blue-dark hover:text-white hover:border-brand-blue-dark transition-colors"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-bold tracking-[2px] uppercase mb-5">
                {col.title}
              </div>
              <ul className="flex flex-col gap-3 list-none">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-gray-600 hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-7 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            © {new Date().getFullYear()} Kids Land — Tous droits réservés
          </span>
          <div className="flex gap-2">
            {[
              "#99C5FF",
              "#6D86DD",
              "#FF751F",
              "#FFD21F",
              "#7ED957",
              "#F6E5E5",
            ].map((color) => (
              <div
                key={color}
                className="w-2.5 h-2.5 rounded-full hover:scale-150 transition-transform cursor-pointer"
                style={{
                  backgroundColor: color,
                  border: color === "#F6E5E5" ? "1px solid #ddd" : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
