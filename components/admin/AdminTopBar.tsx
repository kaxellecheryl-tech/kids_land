"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const SECTIONS: { prefix: string; label: string }[] = [
  { prefix: "/admin/orders",     label: "Commandes"  },
  { prefix: "/admin/products",   label: "Produits"   },
  { prefix: "/admin/categories", label: "Catégories" },
  { prefix: "/admin/brands",     label: "Marques"    },
  { prefix: "/admin/coupons",    label: "Codes promo"},
];

const ROOT_LABELS: Record<string, string> = {
  "/admin":            "Dashboard",
  "/admin/orders":     "Commandes",
  "/admin/products":   "Produits",
  "/admin/categories": "Catégories",
  "/admin/brands":     "Marques",
  "/admin/coupons":    "Codes promo",
};

export function AdminTopBar() {
  const pathname = usePathname();

  if (ROOT_LABELS[pathname]) {
    return (
      <div className="h-12 border-b border-gray-100 bg-white/80 backdrop-blur-sm px-8 flex items-center sticky top-0 z-20">
        <span className="text-[14px] font-semibold text-gray-900">
          {ROOT_LABELS[pathname]}
        </span>
      </div>
    );
  }

  const section = SECTIONS.find((s) => pathname.startsWith(s.prefix + "/"));
  if (section) {
    const isNew = pathname.endsWith("/new");
    return (
      <div className="h-12 border-b border-gray-100 bg-white/80 backdrop-blur-sm px-8 flex items-center gap-2 sticky top-0 z-20">
        <Link
          href={section.prefix}
          className="text-[13px] text-gray-400 hover:text-black transition-colors font-medium"
        >
          {section.label}
        </Link>
        <ChevronRight size={13} className="text-gray-300" />
        <span className="text-[13px] font-semibold text-gray-900">
          {isNew ? "Nouveau" : "Éditer"}
        </span>
      </div>
    );
  }

  return <div className="h-12 border-b border-gray-100 bg-white/80" />;
}
