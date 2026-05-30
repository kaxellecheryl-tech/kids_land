"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Shirt, MapPin, Phone, User, FileText,
  Truck, RefreshCcw, AlertCircle, ChevronRight, Tag, X, MessageCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { createOrder, type CheckoutInput } from "@/app/actions/checkout";
import { validateCoupon, type CouponValidation } from "@/app/actions/coupon";


const CITIES_CI = [
  "Abidjan", "Bouaké", "Yamoussoukro", "Daloa", "Korhogo",
  "San-Pédro", "Man", "Gagnoa", "Abengourou", "Divo",
  "Soubré", "Odienné", "Bondoukou", "Agboville", "Dimbokro",
  "Grand-Bassam", "Bingerville", "Anyama", "Bassam",
];

function shippingFee(zone: "abidjan" | "interieur", subtotal: number): number {
  if (subtotal >= 25000) return 0;
  return zone === "abidjan" ? 1500 : 3500;
}

export function CheckoutForm({
  userProfile,
}: {
  userProfile: { fullName?: string | null; phone?: string | null };
}) {
  const router = useRouter();
  const items     = useCart((s) => s.items);
  const subtotal  = useCart((s) => s.getSubtotal());
  const clearCart = useCart((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  // Address fields
  const [fullName, setFullName]   = useState(userProfile.fullName ?? "");
  const [phone, setPhone]         = useState(userProfile.phone ?? "");
  const [zone, setZone]           = useState<"abidjan" | "interieur">("abidjan");
  const [city, setCity]           = useState("Abidjan");
  const [district, setDistrict]   = useState("");
  const [street, setStreet]       = useState("");
  const [notes, setNotes]         = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Coupon
  const [couponCode, setCouponCode]       = useState("");
  const [couponResult, setCouponResult]   = useState<CouponValidation | null>(null);
  const [couponPending, startCoupon]      = useTransition();

  useEffect(() => setMounted(true), []);

  const fee      = shippingFee(zone, subtotal);
  const discount = couponResult?.ok ? couponResult.discountAmount : 0;
  const total    = subtotal + fee - discount;

  function handleZoneChange(z: "abidjan" | "interieur") {
    setZone(z);
    if (z === "abidjan") setCity("Abidjan");
    else setCity("");
  }

  function handleCoupon() {
    if (!couponCode.trim()) return;
    startCoupon(async () => {
      const result = await validateCoupon(couponCode, subtotal);
      setCouponResult(result);
    });
  }

  function removeCoupon() {
    setCouponCode("");
    setCouponResult(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !city.trim() || !district.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const input: CheckoutInput = {
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        image: i.image,
        size: i.size,
        color: i.color,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
      shipping: { fullName, phone, zone, city, district, street, notes },
      subtotal,
      shippingFee: fee,
      discount,
      couponCode: couponResult?.ok ? couponResult.code : undefined,
      total,
    };

    startTransition(async () => {
      const result = await createOrder(input);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      clearCart();
      window.open(result.whatsappUrl, "_blank");
      router.push(`/checkout/success?order=${result.orderNumber}`);
    });
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FDF8F8] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={28} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">Votre panier est vide</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ajoutez des articles avant de valider votre commande.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          Découvrir la collection
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">

        {/* ── LEFT ──────────────────────────────────────────────── */}
        <div className="space-y-8">

          {/* Cart review */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Votre panier ({items.length} article{items.length > 1 ? "s" : ""})
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId ?? ""}`}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 px-4 py-3"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#F6E5E5] shrink-0 relative overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <Shirt size={20} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold truncate">{item.name}</div>
                    <div className="text-[12px] text-gray-400">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                      {" · "}Qté {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-bold shrink-0">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery zone */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Zone de livraison
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(["abidjan", "interieur"] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => handleZoneChange(z)}
                  className={cn(
                    "rounded-2xl border-2 px-5 py-4 text-left transition-all",
                    zone === z
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  )}
                >
                  <div className="text-[13px] font-bold mb-0.5">
                    {z === "abidjan" ? "Abidjan" : "Intérieur du pays"}
                  </div>
                  <div className={cn("text-[12px]", zone === z ? "text-white/60" : "text-gray-400")}>
                    {subtotal >= 25000 ? "Livraison offerte" : z === "abidjan" ? "1 500 F" : "3 500 F"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Address form */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Adresse de livraison
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    <User size={10} className="inline mr-1" />
                    Nom complet <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Kouassi Ama"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    <Phone size={10} className="inline mr-1" />
                    Téléphone <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07 00 00 00 00"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    <MapPin size={10} className="inline mr-1" />
                    Ville <span className="text-brand-orange">*</span>
                  </label>
                  {zone === "abidjan" ? (
                    <input
                      type="text"
                      readOnly
                      value="Abidjan"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  ) : (
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors bg-white"
                    >
                      <option value="">Choisir une ville</option>
                      {CITIES_CI.filter((c) => c !== "Abidjan").map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Quartier / Commune <span className="text-brand-orange">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Cocody, Zone 4…"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  <MapPin size={10} className="inline mr-1" />
                  Rue / Précisions (optionnel)
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rue, bâtiment, résidence…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  <FileText size={10} className="inline mr-1" />
                  Note pour le livreur (optionnel)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instructions spéciales, point de repère…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT (sticky summary) ──────────────────────────── */}
        <div className="lg:sticky lg:top-28 space-y-5">
          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Récapitulatif
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Truck size={12} /> Livraison
                </span>
                <span>
                  {fee === 0 ? (
                    <span className="text-green-600 font-medium">Offerte</span>
                  ) : (
                    formatPrice(fee)
                  )}
                </span>
              </div>
              {subtotal < 25000 && (
                <p className="text-[11px] text-gray-400">
                  Livraison offerte dès {formatPrice(25000)}
                  {" "}(encore {formatPrice(25000 - subtotal)})
                </p>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag size={12} /> {couponResult?.ok ? couponResult.label : "Remise"}
                  </span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100 mt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Coupon input */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {couponResult?.ok ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2 text-green-700">
                    <Tag size={13} />
                    <span className="text-[13px] font-bold">{couponResult.code}</span>
                    <span className="text-[12px]">— {couponResult.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-green-500 hover:text-green-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      if (couponResult) setCouponResult(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCoupon())}
                    placeholder="Code promo"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300 uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCoupon}
                    disabled={couponPending || !couponCode.trim()}
                    className="px-4 py-2.5 bg-black text-white rounded-xl text-[12px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-40"
                  >
                    {couponPending ? <RefreshCcw size={13} className="animate-spin" /> : "Valider"}
                  </button>
                </div>
              )}
              {couponResult && !couponResult.ok && (
                <p className="text-[12px] text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} /> {couponResult.error}
                </p>
              )}
            </div>
          </div>

          {/* Payment — WhatsApp */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Paiement
            </h2>
            <div className="flex items-center gap-3 bg-[#25D366]/10 border-2 border-[#25D366] rounded-xl px-4 py-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#128C7E]">Via WhatsApp</p>
                <p className="text-[11px] text-gray-500">Wave · Orange Money · Momo · Djamo</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
              Après validation, vous serez redirigé sur WhatsApp pour envoyer votre récapitulatif et convenir du paiement avec notre équipe.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-600">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-4 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <RefreshCcw size={15} className="animate-spin" /> Traitement…
              </>
            ) : (
              <>
                Commander — {formatPrice(total)} <ChevronRight size={15} />
              </>
            )}
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            En commandant, vous acceptez nos{" "}
            <Link href="/legal/cgv" className="text-brand-orange hover:underline">
              Conditions Générales de Vente
            </Link>{" "}
            et notre{" "}
            <Link href="/legal/confidentialite" className="text-brand-orange hover:underline">
              Politique de confidentialité
            </Link>.
          </p>
        </div>
      </div>
    </form>
  );
}
