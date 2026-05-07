"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, updateQuantity, removeItem, getSubtotal } =
    useCart();
  const subtotal = getSubtotal();

  // Bloquer scroll body quand drawer ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transition-transform flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Mon panier ({items.length})
          </h2>
          <button
            onClick={close}
            aria-label="Fermer le panier"
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
            <div className="w-20 h-20 rounded-full bg-brand-pink flex items-center justify-center">
              <ShoppingBag size={32} className="text-brand-orange" />
            </div>
            <div>
              <p className="font-semibold text-base mb-1">Votre panier est vide</p>
              <p className="text-sm text-gray-500">
                Découvrez nos nouveautés et trouvez la pépite parfaite.
              </p>
            </div>
            <Link href="/products" onClick={close} className="btn-primary">
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId ?? ""}`}
                  className="px-6 py-4 flex gap-3"
                >
                  <div className="relative w-20 h-24 rounded-md bg-brand-pink overflow-hidden shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
                      {item.brand}
                    </div>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={close}
                      className="text-sm font-semibold line-clamp-2 hover:text-brand-orange"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        Taille : {item.size}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border rounded-full px-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-semibold min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    aria-label="Retirer"
                    className="self-start w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <footer className="border-t px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Livraison calculée au checkout
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="w-full btn-primary justify-center"
              >
                Passer commande →
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
