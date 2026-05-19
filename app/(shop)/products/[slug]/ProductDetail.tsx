"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart, ShoppingBag, Check, ChevronLeft, ChevronRight,
  Truck, ShieldCheck, Minus, Plus, Shirt,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { formatPrice, formatAge, cn, computeMinPrice } from "@/lib/utils";
import { SizeGuideModal } from "@/components/shop/SizeGuideModal";

const FRENCH_COLORS: Record<string, string> = {
  rouge: "#e53e3e", bleu: "#3182ce", vert: "#38a169", jaune: "#d69e2e",
  rose: "#ed64a6", violet: "#805ad5", orange: "#dd6b20", noir: "#1a202c",
  blanc: "#f5f5f5", gris: "#a0aec0", beige: "#d4a574", marron: "#8b4513",
  "bleu marine": "#1a365d", "bleu ciel": "#63b3ed", turquoise: "#38b2ac",
  corail: "#fc8181", lavande: "#b794f4", menthe: "#68d391",
};

function toDisplayColor(color: string): string {
  if (/^#[0-9a-fA-F]{3,6}$/.test(color)) return color;
  return FRENCH_COLORS[color.toLowerCase()] ?? color;
}

export type ProductFull = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string };
  basePrice: number;
  comparePrice: number | null;
  ageRangeMin: number | null;
  ageRangeMax: number | null;
  gender: string;
  images: { url: string; alt: string | null }[];
  variants: {
    id: string;
    size: string;
    color: string | null;
    stock: number;
    priceOverride: number | null;
    sku: string;
  }[];
};

const GENDER_LABEL: Record<string, string | null> = {
  GIRL: "Fille",
  BOY: "Garçon",
  UNISEX: null,
};

const DELIVERY_PERKS = [
  { Icon: Truck,       text: "Livraison rapide en Côte d'Ivoire" },
  { Icon: ShieldCheck, text: "Article 100 % authentique"         },
];

export function ProductDetail({ product }: { product: ProductFull }) {
  const addItem   = useCart((s) => s.addItem);
  const openCart  = useCart((s) => s.open);
  const toggleWL  = useWishlist((s) => s.toggle);
  const isFav     = useWishlist((s) => s.has(product.id));

  const [activeImg, setActiveImg]         = useState(0);
  const [selectedSize, setSelectedSize]   = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity]           = useState(1);
  const [justAdded, setJustAdded]         = useState(false);
  const [imgErrors, setImgErrors]         = useState<Record<number, boolean>>({});
  const [isPaused, setIsPaused]           = useState(false);
  const timerRef                          = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Variant logic ──────────────────────────────────────────────
  const sizeGroups = new Map<string, typeof product.variants>();
  for (const v of product.variants) {
    if (!sizeGroups.has(v.size)) sizeGroups.set(v.size, []);
    sizeGroups.get(v.size)!.push(v);
  }
  const allSizes = [...sizeGroups.keys()];
  const hasColors = product.variants.some((v) => v.color);

  const colorsForSize: { color: string; stock: number }[] = selectedSize
    ? (sizeGroups.get(selectedSize) ?? [])
        .filter((v) => v.color)
        .map((v) => ({ color: v.color!, stock: v.stock }))
    : [];

  const selectedVariant =
    selectedSize !== null
      ? (sizeGroups.get(selectedSize) ?? []).find(
          (v) => !hasColors || v.color === selectedColor
        ) ?? null
      : null;

  const price = selectedVariant?.priceOverride ?? product.basePrice;

  // Fourchette de prix parmi tous les variants (pour l'affichage avant sélection)
  const minPrice = computeMinPrice(product.basePrice, product.variants);
  const allEffectivePrices = product.variants.map((v) => v.priceOverride ?? product.basePrice);
  const maxVariantPrice = allEffectivePrices.length > 0 ? Math.max(...allEffectivePrices) : product.basePrice;
  const hasPriceRange = minPrice !== undefined && minPrice < maxVariantPrice;

  const hasVariants = allSizes.length > 0;
  const sizeSelected = !hasVariants || selectedSize !== null;
  const colorSelected = !hasColors || selectedColor !== null;
  const canAdd = sizeSelected && colorSelected;

  function handleSizeClick(size: string) {
    setSelectedSize(size);
    const variants = sizeGroups.get(size) ?? [];
    if (variants.length === 1 || !hasColors) {
      setSelectedColor(variants[0]?.color ?? null);
    } else {
      setSelectedColor(null);
    }
  }

  function handleAddToCart() {
    if (!canAdd) return;
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant?.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand?.name ?? "Kids Land",
        image: product.images[0]?.url ?? "",
        size: selectedVariant?.size ?? undefined,
        color: selectedVariant?.color ?? undefined,
        unitPrice: price,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    setTimeout(() => openCart(), 400);
  }

  // ── Discount ──────────────────────────────────────────────────
  const discount =
    product.comparePrice && product.comparePrice > product.basePrice
      ? Math.round(
          ((product.comparePrice - product.basePrice) / product.comparePrice) * 100
        )
      : 0;

  // ── Age label ─────────────────────────────────────────────────
  const ageLabel =
    product.ageRangeMin !== null && product.ageRangeMax !== null
      ? `${formatAge(product.ageRangeMin)} – ${formatAge(product.ageRangeMax)}`
      : product.ageRangeMin !== null
      ? `Dès ${formatAge(product.ageRangeMin)}`
      : null;

  const genderLabel = GENDER_LABEL[product.gender] ?? null;

  // ── Stock info ────────────────────────────────────────────────
  const variantStock = selectedVariant?.stock ?? null;
  const isOutOfStock = selectedVariant ? selectedVariant.stock === 0 : false;
  const isLowStock = variantStock !== null && variantStock > 0 && variantStock <= 5;

  // ── Image navigation ──────────────────────────────────────────
  const images = product.images;

  // Liste ordonnée des couleurs uniques (pour fallback index→image)
  const allColors = [...new Set(
    product.variants.filter((v) => v.color).map((v) => v.color!)
  )];

  // Auto-slide : toutes les 5 s, pause au hover
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    timerRef.current = setInterval(() => {
      setActiveImg((i) => (i + 1) % images.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length, isPaused]);

  function goTo(i: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveImg(i);
  }
  const prevImg = () => goTo((activeImg - 1 + images.length) % images.length);
  const nextImg = () => goTo((activeImg + 1) % images.length);

  // ── Couleur → image ───────────────────────────────────────────
  function handleColorClick(color: string) {
    setSelectedColor(color);
    // 1. Cherche par alt (ex: alt = "rouge", "bleu"…)
    const byAlt = images.findIndex(
      (img) => img.alt?.toLowerCase().includes(color.toLowerCase())
    );
    if (byAlt !== -1) { goTo(byAlt); return; }
    // 2. Fallback : même index que la couleur dans la liste ordonnée
    const colorIdx = allColors.indexOf(color);
    if (colorIdx >= 0 && colorIdx < images.length) goTo(colorIdx);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
      {/* ── Gallery ──────────────────────────────────────────── */}
      <div className="space-y-3 lg:sticky lg:top-28">
        {/* Main image */}
        <div
          className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F6E5E5] flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {images.length > 0 ? (
            images.map((img, i) =>
              !imgErrors[i] ? (
                <Image
                  key={i}
                  src={img.url}
                  alt={img.alt ?? product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === activeImg ? "opacity-100" : "opacity-0"
                  }`}
                  priority={i === 0}
                  onError={() => setImgErrors((e) => ({ ...e, [i]: true }))}
                />
              ) : null
            )
          ) : (
            <Shirt size={64} className="text-gray-200" />
          )}

          {/* Nav arrows (only if > 1 image) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-brand-orange text-white text-[11px] font-black px-3 py-1 rounded-full">
              −{discount}%
            </span>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeImg ? "bg-white w-5" : "bg-white/50 w-1.5 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                  activeImg === i ? "border-brand-orange" : "border-gray-100 hover:border-gray-300"
                )}
              >
                {!imgErrors[i] ? (
                  <Image
                    src={img.url}
                    alt={img.alt ?? ""}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                    onError={() => setImgErrors((e) => ({ ...e, [i]: true }))}
                  />
                ) : (
                  <div className="w-full h-full bg-[#F6E5E5] flex items-center justify-center">
                    <Shirt size={20} className="text-gray-200" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Product info ──────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Brand */}
        {product.brand && (
          <Link
            href={`/brands/${product.brand.slug}`}
            className="inline-block text-[11px] font-black uppercase tracking-[2px] text-gray-400 hover:text-brand-orange transition-colors"
          >
            {product.brand.name}
          </Link>
        )}

        {/* Name */}
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1]">
          {product.name}
        </h1>

        {/* Badges */}
        {(ageLabel || genderLabel) && (
          <div className="flex flex-wrap gap-2">
            {ageLabel && (
              <span className="px-3 py-1 rounded-full bg-[#fff3bb] text-[12px] font-bold">
                {ageLabel}
              </span>
            )}
            {genderLabel && (
              <span className="px-3 py-1 rounded-full bg-[#F6E5E5] text-[12px] font-bold">
                {genderLabel}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3">
          {!selectedSize && hasPriceRange ? (
            <>
              <span className="text-3xl font-bold tracking-tight">
                {formatPrice(minPrice!)} – {formatPrice(maxVariantPrice)}
              </span>
              <span className="text-[12px] text-gray-400">selon la taille</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-bold tracking-tight">
                {formatPrice(price)}
              </span>
              {product.comparePrice && product.comparePrice > product.basePrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </>
          )}
        </div>

        {/* Size selector */}
        {allSizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold uppercase tracking-widest text-gray-600">
                Taille
                {selectedSize && (
                  <span className="ml-2 text-black normal-case tracking-normal">
                    — {selectedSize}
                  </span>
                )}
              </span>
              <SizeGuideModal />
            </div>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => {
                const variants = sizeGroups.get(size) ?? [];
                const totalStock = variants.reduce((s, v) => s + v.stock, 0);
                const outOfStock = totalStock === 0;
                return (
                  <button
                    key={size}
                    disabled={outOfStock}
                    onClick={() => handleSizeClick(size)}
                    className={cn(
                      "min-w-[48px] px-4 py-2.5 rounded-xl text-[13px] font-semibold border-2 transition-all",
                      outOfStock
                        ? "border-gray-100 text-gray-300 bg-gray-50 line-through cursor-not-allowed"
                        : selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-400"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Color selector */}
        {hasColors && colorsForSize.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] font-bold uppercase tracking-widest text-gray-600">
                Couleur
              </span>
              {selectedColor && (
                <span
                  className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                  style={{ backgroundColor: toDisplayColor(selectedColor) }}
                />
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {colorsForSize.map(({ color, stock }) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  disabled={stock === 0}
                  onClick={() => handleColorClick(color)}
                  className={cn(
                    "relative w-8 h-8 rounded-full border-2 transition-all",
                    stock === 0
                      ? "opacity-40 cursor-not-allowed border-gray-100"
                      : selectedColor === color
                      ? "border-black ring-2 ring-black ring-offset-2"
                      : "border-white hover:scale-110 shadow-sm"
                  )}
                  style={{ backgroundColor: toDisplayColor(color) }}
                >
                  {stock === 0 && (
                    <span className="absolute inset-0 overflow-hidden rounded-full flex items-center justify-center">
                      <span className="w-[140%] h-px bg-gray-500/50 rotate-45 block" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock feedback */}
        {isOutOfStock && selectedVariant && (
          <p className="text-sm text-red-500 font-medium">
            Rupture de stock pour cette taille.
          </p>
        )}
        {isLowStock && !isOutOfStock && (
          <p className="text-sm text-brand-orange font-medium">
            Plus que {variantStock} en stock !
          </p>
        )}

        {/* Quantity + add to cart */}
        <div className="flex items-center gap-3">
          {/* Qty */}
          <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-9 text-center text-sm font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!canAdd || isOutOfStock}
            className={cn(
              "flex-1 h-11 rounded-xl text-[13px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all",
              justAdded
                ? "bg-[#7ED957] text-white"
                : canAdd && !isOutOfStock
                ? "bg-black text-white hover:bg-brand-orange"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {justAdded ? (
              <>
                <Check size={15} /> Ajouté !
              </>
            ) : !sizeSelected ? (
              <>
                <ShoppingBag size={15} /> Choisir une taille
              </>
            ) : isOutOfStock ? (
              "Indisponible"
            ) : (
              <>
                <ShoppingBag size={15} /> Ajouter au panier
              </>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() =>
              toggleWL({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand?.name ?? "Kids Land",
                image: product.images[0]?.url ?? "",
                basePrice: product.basePrice,
                comparePrice: product.comparePrice,
              })
            }
            aria-label="Ajouter aux favoris"
            className={cn(
              "w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all",
              isFav
                ? "border-brand-orange bg-brand-orange text-white"
                : "border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange"
            )}
          >
            <Heart size={16} className={isFav ? "fill-white" : ""} />
          </button>
        </div>

        {/* Delivery perks */}
        <div className="rounded-xl bg-[#FDF8F8] border border-gray-100 divide-y divide-gray-100">
          {DELIVERY_PERKS.map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-3 px-4 py-3">
              <Icon size={15} className="text-gray-400 shrink-0" />
              <span className="text-[13px] text-gray-600">{text}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Description
            </h2>
            <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

        {/* SKU */}
        {selectedVariant && (
          <p className="text-[11px] text-gray-400">
            Réf. : {selectedVariant.sku}
          </p>
        )}
      </div>
    </div>
  );
}
