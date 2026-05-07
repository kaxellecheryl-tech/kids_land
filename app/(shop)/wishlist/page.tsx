"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Heart, ShoppingBag, Trash2, Shirt } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-store";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

function WishlistItem({ item }: { item: ReturnType<typeof useWishlist.getState>["items"][number] }) {
  const remove = useWishlist((s) => s.remove);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discount =
    item.comparePrice && item.comparePrice > item.basePrice
      ? Math.round(((item.comparePrice - item.basePrice) / item.comparePrice) * 100)
      : 0;

  function handleAddToCart() {
    addItem({
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      brand: item.brand,
      image: item.image,
      unitPrice: item.basePrice,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    setTimeout(() => openCart(), 600);
  }

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/products/${item.slug}`} className="relative aspect-[4/5] bg-[#F6E5E5] block">
        {item.image && !imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center"><Shirt size={32} className="text-gray-300" /></span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-brand-orange text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
            −{discount}%
          </span>
        )}
      </Link>

      <div className="px-4 py-3 flex-1 flex flex-col">
        <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-gray-400 mb-0.5">
          {item.brand}
        </div>
        <Link
          href={`/products/${item.slug}`}
          className="text-[13px] font-semibold text-black leading-snug line-clamp-2 flex-1 hover:text-brand-orange transition-colors"
        >
          {item.name}
        </Link>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-sm font-bold">{formatPrice(item.basePrice)}</span>
            {item.comparePrice && item.comparePrice > item.basePrice && (
              <span className="text-xs text-gray-400 line-through ml-1.5">
                {formatPrice(item.comparePrice)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => remove(item.productId)}
              aria-label="Retirer des favoris"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={handleAddToCart}
              aria-label="Ajouter au panier"
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${
                justAdded ? "bg-green-500 scale-110" : "bg-black hover:bg-brand-orange hover:scale-110"
              }`}
            >
              <ShoppingBag size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const items = useWishlist((s) => s.items);

  return (
    <>
      <section className="pt-16 pb-12 px-6 bg-[#F6E5E5]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-5xl mb-3">
                <Heart className="inline-block fill-brand-orange text-brand-orange" size={48} />
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">Mes Favoris</h1>
              <p className="text-sm text-gray-600">Les articles que vous avez sauvegardés</p>
            </div>
            {items.length > 0 && (
              <div className="hidden sm:block text-right">
                <div className="text-4xl font-bold tracking-tight">{items.length}</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-gray-500 mt-0.5">
                  {items.length === 1 ? "article" : "articles"}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-shop py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Heart size={56} className="text-gray-200 mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucun favori pour l&apos;instant</h2>
            <p className="text-sm text-gray-500 mb-8">
              Cliquez sur le cœur d&apos;un article pour le sauvegarder ici.
            </p>
            <Link href="/products" className="btn-primary">
              Découvrir nos articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <WishlistItem key={item.productId} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
