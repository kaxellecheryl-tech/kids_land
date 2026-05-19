"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus, Check, Shirt } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { formatPrice, cn } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  basePrice: number;
  comparePrice?: number | null;
  minPrice?: number; // Prix le plus bas parmi les variants (si différent de basePrice)
  imageUrl: string;
  imageBg?: string; // Couleur de fond si pas d'image
  ageLabel?: string;
  badge?: "new" | "sale" | "popular" | null;
};

const BADGES: Record<NonNullable<ProductCardData["badge"]>, { label: string; className: string }> = {
  new: {
    label: "New",
    className: "bg-brand-blue-dark text-white",
  },
  sale: {
    label: "Promo",
    className: "bg-brand-orange text-white",
  },
  popular: {
    label: "Populaire",
    className: "bg-brand-green text-black",
  },
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);
  const toggleWishlist = useWishlist((s) => s.toggle);
  const isFav = useWishlist((s) => s.has(product.id));
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discount =
    product.comparePrice && product.comparePrice > product.basePrice
      ? Math.round(
          ((product.comparePrice - product.basePrice) / product.comparePrice) * 100
        )
      : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.imageUrl,
      unitPrice: product.basePrice,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    setTimeout(() => openCart(), 600);
  };

  const badge = product.badge ?? (discount > 0 ? "sale" : null);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-[22px] overflow-hidden border border-gray-100/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] hover:border-transparent flex flex-col"
    >
      {/* Image wrapper */}
      <div
        className="relative aspect-[3/4] overflow-hidden flex items-center justify-center shrink-0"
        style={{ backgroundColor: product.imageBg ?? "#F6E5E5" }}
      >
        {product.imageUrl && !imgError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            onError={() => setImgError(true)}
          />
        ) : (
          <Shirt size={48} className="text-gray-300" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {badge && (
          <span
            className={cn(
              "absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm",
              BADGES[badge].className
            )}
          >
            {discount > 0 && badge === "sale"
              ? `−${discount}%`
              : BADGES[badge].label}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              image: product.imageUrl,
              basePrice: product.basePrice,
              comparePrice: product.comparePrice,
            });
          }}
          aria-label="Ajouter aux favoris"
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-200",
            isFav ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
          )}
        >
          <Heart
            size={14}
            className={isFav ? "fill-brand-orange text-brand-orange" : "text-gray-500"}
          />
        </button>

        {/* "Voir" hover CTA */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-3.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-white/95 backdrop-blur-sm text-black text-[10px] font-black tracking-wider uppercase px-4 py-1.5 rounded-full shadow-lg">
            Voir le produit →
          </span>
        </div>
      </div>

      {/* Info — chaque zone a une hauteur fixe pour aligner toutes les cartes */}
      <div className="px-4 pt-3.5 pb-4 flex flex-col">
        {/* Brand — hauteur fixe */}
        <div className="h-[22px] flex items-center mb-2">
          <span className="inline-flex items-center bg-gray-100 text-gray-500 text-[9px] font-black tracking-[2px] uppercase px-2.5 py-1 rounded-full">
            {product.brand}
          </span>
        </div>

        {/* Nom — toujours 2 lignes */}
        <div className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 min-h-[42px]">
          {product.name}
        </div>

        {/* Age — hauteur fixe, vide si absent */}
        <div className="h-[20px] flex items-center mt-1">
          {product.ageLabel && (
            <span className="text-[10px] text-gray-400 font-medium">
              {product.ageLabel}
            </span>
          )}
        </div>

        {/* Prix + CTA — toujours collé en bas */}
        <div className="flex items-center justify-between mt-3 gap-2">
          <div>
            {product.minPrice !== undefined && product.minPrice < product.basePrice ? (
              <span className="text-[14px] font-black text-gray-900">
                À partir de {formatPrice(product.minPrice)}
              </span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-[15px] font-black text-gray-900">
                  {formatPrice(product.basePrice)}
                </span>
                {product.comparePrice && product.comparePrice > product.basePrice && (
                  <span className="text-[11px] text-gray-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label="Ajouter au panier"
            className={cn(
              "shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all duration-200 shadow-sm",
              justAdded
                ? "bg-brand-green scale-110 shadow-md"
                : "bg-gray-900 hover:bg-brand-orange hover:scale-110 hover:shadow-md"
            )}
          >
            {justAdded ? <Check size={15} strokeWidth={3} /> : <Plus size={17} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
