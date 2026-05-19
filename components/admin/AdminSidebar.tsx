"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Ticket,
  FolderOpen,
  LogOut,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions/auth";

type NavItem = { href: string; label: string; Icon: LucideIcon };

const NAV: NavItem[] = [
  { href: "/admin",             label: "Dashboard",   Icon: LayoutDashboard },
  { href: "/admin/orders",      label: "Commandes",   Icon: ShoppingBag },
  { href: "/admin/products",    label: "Produits",    Icon: Package },
  { href: "/admin/categories",  label: "Catégories",  Icon: FolderOpen },
  { href: "/admin/brands",      label: "Marques",     Icon: Tag },
  { href: "/admin/coupons",     label: "Codes promo", Icon: Ticket },
];

type Props = {
  user: { fullName?: string | null; email?: string | null };
  pendingOrdersCount?: number;
};

export function AdminSidebar({ user, pendingOrdersCount = 0 }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const initial = ((user.fullName ?? user.email ?? "A").charAt(0)).toUpperCase();

  return (
    <aside className="w-60 shrink-0 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/admin">
          <Image
            src="/LOGO.png"
            alt="Kids Land"
            width={160}
            height={64}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>
        <span className="block text-[9px] font-black tracking-[3px] uppercase text-gray-400 mt-1 ml-0.5">
          Administration
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors",
              isActive(href)
                ? "bg-brand-orange/10 text-brand-orange font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            )}
          >
            <Icon
              size={16}
              className={isActive(href) ? "text-brand-orange" : "text-gray-400"}
            />
            <span className="flex-1">{label}</span>
            {href === "/admin/orders" && pendingOrdersCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {pendingOrdersCount > 99 ? "99+" : pendingOrdersCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] text-gray-500 hover:bg-gray-50 hover:text-black transition-colors"
        >
          <ExternalLink size={14} className="text-gray-400" />
          Voir la boutique
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[12px] text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={14} />
            Se déconnecter
          </button>
        </form>

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-lg bg-brand-orange text-white text-[11px] font-black flex items-center justify-center shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold truncate">
              {user.fullName ?? "Admin"}
            </p>
            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
