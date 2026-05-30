"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SearchModal } from "@/components/shop/SearchModal";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/products?filter=new", label: "Nouveautés" },
  { href: "/products?gender=girl", label: "Filles" },
  { href: "/products?gender=boy", label: "Garçons" },
  { href: "/products?category=bebe", label: "Bébé" },
  { href: "/products?category=accessoires", label: "Accessoires" },
];

export function Header() {
  const totalItems = useCart((s) => s.getTotalItems());
  const openCart = useCart((s) => s.open);
  const wishlistCount = useWishlist((s) => s.count());
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setAuthUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) =>
      setAuthUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    const [path, qs] = href.split("?");
    if (pathname !== path) return false;
    if (!qs) return true;
    const [key, val] = qs.split("=");
    return searchParams.get(key) === val;
  }

  const accountHref = authUser ? "/account" : "/login";
  const accountLabel = authUser ? "Mon compte" : "Se connecter";

  return (
    <>
      <nav
        className={`fixed inset-x-0 z-50 h-[96px] transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-[0_2px_24px_rgba(0,0,0,0.07)]"
            : "bg-white/95 backdrop-blur-md border-b border-brand-blue-light/40"
        }`}
        style={{ top: "var(--announcement-h, 0px)" }}
      >
        <div className="container-shop h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/LOGO.png"
              alt="Kids Land"
              width={300}
              height={120}
              className="h-24 w-auto object-contain"
              priority
            />
          </Link>

          {/* Nav links — hidden on mobile */}
          <ul className="hidden lg:flex items-center gap-9 list-none">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-[13px] font-medium uppercase tracking-wider transition-colors duration-200 pb-0.5
                    after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-brand-orange after:transition-all after:duration-200
                    ${
                      isActive(link.href)
                        ? "text-black after:w-full"
                        : "text-gray-600 hover:text-black after:w-0 hover:after:w-full"
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-brand-orange hover:bg-orange-50 transition-colors"
            >
              <Search size={16} />
            </button>

            {/* Account / login */}
            <Link
              href={accountHref}
              aria-label={accountLabel}
              className="relative flex w-10 h-10 rounded-xl border border-gray-200 bg-white items-center justify-center hover:border-brand-orange hover:bg-orange-50 transition-colors"
            >
              {mounted && authUser ? (
                <span className="w-7 h-7 rounded-lg bg-brand-orange text-white text-[11px] font-black flex items-center justify-center">
                  {(
                    authUser.user_metadata?.full_name as string | undefined ??
                    authUser.email ??
                    "?"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </span>
              ) : (
                <User size={16} />
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Favoris"
              className="hidden sm:relative sm:flex w-10 h-10 rounded-xl border border-gray-200 bg-white items-center justify-center hover:border-brand-orange hover:bg-orange-50 transition-colors"
            >
              <Heart size={16} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label="Panier"
              className="relative w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:border-brand-orange hover:bg-orange-50 transition-colors"
            >
              <ShoppingBag size={16} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
