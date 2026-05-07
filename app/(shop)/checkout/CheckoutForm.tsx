"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Shirt, MapPin, Phone, User, FileText,
  Truck, RefreshCcw, AlertCircle, ChevronRight, Check,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import { createOrder, type CheckoutInput } from "@/app/actions/checkout";

const PAYMENT_METHODS = [
  { id: "wave",         label: "Wave",           color: "#0080FF", textColor: "white" },
  { id: "orange_money", label: "Orange Money",   color: "#FF6600", textColor: "white" },
  { id: "mtn",          label: "MTN Money",      color: "#FFD21F", textColor: "black" },
  { id: "card",         label: "Carte bancaire", color: "#1a1a1a", textColor: "white" },
];

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
  const [paymentMethod, setPM]    = useState("wave");
  const [error, setError]         = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);

  const fee   = shippingFee(zone, subtotal);
  const total = subtotal + fee;

  function handleZoneChange(z: "abidjan" | "interieur") {
    setZone(z);
    if (z === "abidjan") setCity("Abidjan");
    else setCity("");
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
      total,
      paymentMethod,
    };

    startTransition(async () => {
      const result = await createOrder(input);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      clearCart();
      router.push(result.paymentUrl);
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
              <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100 mt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Mode de paiement
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPM(pm.id)}
                  className={cn(
                    "relative py-3 px-3 rounded-xl border-2 text-[12px] font-bold transition-all",
                    paymentMethod === pm.id
                      ? "border-transparent"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  style={
                    paymentMethod === pm.id
                      ? { backgroundColor: pm.color, color: pm.textColor, borderColor: pm.color }
                      : undefined
                  }
                >
                  {paymentMethod === pm.id && (
                    <span className="absolute top-1.5 right-1.5">
                      <Check size={10} />
                    </span>
                  )}
                  {pm.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-3">
              Paiement sécurisé via PayDunya. Vos données ne sont jamais stockées.
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
            <Link href="/help/returns" className="text-brand-orange hover:underline">
              conditions de retour
            </Link>.
          </p>
        </div>
      </div>
    </form>
  );
}
