"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 25000;

export function CartDrawer() {
  const { items, isOpen, close, updateQuantity, removeItem, getSubtotal } =
    useCart();
  const subtotal = getSubtotal();

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

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
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 border-b bg-[#FDF8F8]">
          <h2 className="text-lg font-bold flex items-center gap-2.5">
            <ShoppingBag size={20} />
            Mon panier
            {items.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-black">
                {items.length}
              </span>
            )}
          </h2>
          <button
            onClick={close}
            aria-label="Fermer le panier"
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-[#F6E5E5] flex items-center justify-center">
              <ShoppingBag size={40} className="text-brand-orange" />
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
            {/* Items list */}
            <ul className="flex-1 overflow-y-auto py-2">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId ?? ""}`}
                  className="bg-[#FAFAFA] rounded-xl mx-4 my-2 px-4 py-3 flex gap-3"
                >
                  <div className="relative w-20 h-24 rounded-lg bg-brand-pink overflow-hidden shrink-0">
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
                    <div className="text-[9px] font-black tracking-[2px] uppercase text-gray-400 mb-0.5">
                      {item.brand}
                    </div>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={close}
                      className="text-sm font-semibold line-clamp-2 hover:text-brand-orange transition-colors"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        Taille : {item.size}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-1 py-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.quantity - 1
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={11} />
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
                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={11} />
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
                    className="self-start w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <footer className="border-t px-6 py-5 space-y-4 bg-[#FDF8F8]">
              {/* Free shipping progress bar */}
              <div className="space-y-1.5">
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <p className="text-[12px] font-semibold text-brand-green">
                    Livraison offerte ✓
                  </p>
                ) : (
                  <p className="text-[12px] text-gray-500">
                    Plus que{" "}
                    <span className="font-bold text-gray-700">
                      {formatPrice(remaining)}
                    </span>{" "}
                    pour la livraison offerte
                  </p>
                )}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-orange rounded-full transition-[width] duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span className="font-semibold text-base text-black">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                onClick={close}
                className="w-full inline-flex items-center justify-center gap-2 bg-black text-white py-4 rounded-full text-[14px] font-bold uppercase tracking-wide transition-all hover:bg-brand-orange hover:-translate-y-0.5"
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
