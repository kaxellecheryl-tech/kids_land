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
      className="group bg-white rounded-[20px] overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
    >
      {/* Image wrapper */}
      <div
        className="relative aspect-[3/4] overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: product.imageBg ?? "#F6E5E5" }}
      >
        {product.imageUrl && !imgError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgError(true)}
          />
        ) : (
          <Shirt size={48} className="text-gray-300" />
        )}

        {/* Badge */}
        {badge && (
          <span
            className={cn(
              "absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full",
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
            "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-sm transition-opacity",
            isFav ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <Heart
            size={14}
            className={isFav ? "fill-brand-orange text-brand-orange" : ""}
          />
        </button>
      </div>

      {/* Info */}
      <div className="px-[18px] py-4">
        <div className="text-[9px] font-black tracking-[2.5px] uppercase text-gray-400 mb-1">
          {product.brand}
        </div>
        <div className="text-[14px] font-bold text-black mb-1 leading-snug line-clamp-2">
          {product.name}
        </div>
        {product.ageLabel && (
          <div className="text-[11px] text-gray-500 mb-3.5">
            {product.ageLabel}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[15px] font-bold">
              {formatPrice(product.basePrice)}
            </span>
            {product.comparePrice && product.comparePrice > product.basePrice && (
              <span className="text-[12px] text-gray-400 line-through ml-1.5">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label="Ajouter au panier"
            className={cn(
              "w-9 h-9 rounded-xl border-none flex items-center justify-center text-white transition-all",
              justAdded
                ? "bg-brand-green text-black scale-110"
                : "bg-black hover:bg-brand-orange hover:scale-110"
            )}
          >
            {justAdded ? <Check size={16} /> : <Plus size={18} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
