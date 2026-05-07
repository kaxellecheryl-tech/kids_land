"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Package, Search, CheckCircle, Clock, Truck,
  MapPin, Phone, MessageCircle, AlertCircle, Shirt, RotateCcw,
  XCircle, RefreshCcw, type LucideIcon,
} from "lucide-react";
import { trackOrder, type OrderTracking } from "@/app/actions/track-order";
import { formatPrice } from "@/lib/utils";

// ─── Status config ────────────────────────────────────────────────────────────

type StatusKey = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

const STATUS_STEPS: StatusKey[] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_META: Record<StatusKey, { label: string; desc: string; color: string; Icon: LucideIcon }> = {
  PENDING:    { label: "En attente",    desc: "Paiement en cours de validation",          color: "#fff3bb", Icon: Clock       },
  PAID:       { label: "Payée",         desc: "Paiement confirmé — préparation imminente",color: "#d8f5c0", Icon: CheckCircle },
  PROCESSING: { label: "En préparation",desc: "Votre commande est en cours de traitement",color: "#99C5FF", Icon: Package     },
  SHIPPED:    { label: "Expédiée",      desc: "Votre commande est en route",              color: "#99C5FF", Icon: Truck       },
  DELIVERED:  { label: "Livrée",        desc: "Commande remise avec succès",              color: "#d8f5c0", Icon: CheckCircle },
  CANCELLED:  { label: "Annulée",       desc: "Commande annulée",                         color: "#F6E5E5", Icon: XCircle     },
  REFUNDED:   { label: "Remboursée",    desc: "Remboursement effectué",                   color: "#F6E5E5", Icon: RotateCcw   },
};

function getStepIndex(status: StatusKey) {
  return STATUS_STEPS.indexOf(status);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusTimeline({ status }: { status: StatusKey }) {
  const currentIdx = getStepIndex(status);
  const isFinal = status === "CANCELLED" || status === "REFUNDED";

  if (isFinal) {
    const meta = STATUS_META[status];
    return (
      <div
        className="rounded-2xl px-6 py-5 flex items-center gap-4"
        style={{ backgroundColor: meta.color }}
      >
        <meta.Icon size={28} className="shrink-0 text-gray-600" />
        <div>
          <div className="font-bold text-lg">{meta.label}</div>
          <div className="text-sm text-gray-600">{meta.desc}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF8F8] rounded-2xl p-6 border border-gray-100">
      <div className="flex items-start gap-0">
        {STATUS_STEPS.map((step, i) => {
          const meta = STATUS_META[step];
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = meta.Icon;
          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              {/* connector + circle row */}
              <div className="w-full flex items-center">
                {/* left bar */}
                <div
                  className={`flex-1 h-0.5 ${i === 0 ? "opacity-0" : done ? "bg-brand-orange" : "bg-gray-200"}`}
                />
                {/* circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                    active
                      ? "bg-brand-orange border-brand-orange text-white"
                      : done
                      ? "bg-[#d8f5c0] border-[#7ED957] text-gray-700"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}
                >
                  <Icon size={14} />
                </div>
                {/* right bar */}
                <div
                  className={`flex-1 h-0.5 ${i === STATUS_STEPS.length - 1 ? "opacity-0" : done && i < currentIdx ? "bg-brand-orange" : "bg-gray-200"}`}
                />
              </div>
              {/* label */}
              <div className={`mt-2 text-center px-1 ${active ? "text-brand-orange font-bold" : done ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                <div className="text-[11px] leading-tight hidden sm:block">{meta.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Current status description */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2">
        {(() => {
          const meta = STATUS_META[status];
          const Icon = meta.Icon;
          return (
            <>
              <Icon size={16} className="text-brand-orange shrink-0" />
              <span className="text-sm font-semibold text-brand-orange">{meta.label}</span>
              <span className="text-sm text-gray-500">— {meta.desc}</span>
            </>
          );
        })()}
      </div>
    </div>
  );
}

function OrderResult({ order }: { order: OrderTracking }) {
  const status = order.status as StatusKey;
  const date = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Commande
          </div>
          <div className="text-2xl font-bold tracking-tight">{order.orderNumber}</div>
          <div className="text-sm text-gray-500 mt-0.5">Passée le {date}</div>
        </div>
        <div
          className="px-4 py-2 rounded-full text-sm font-bold"
          style={{ backgroundColor: STATUS_META[status]?.color ?? "#F6E5E5" }}
        >
          {STATUS_META[status]?.label ?? status}
        </div>
      </div>

      {/* Timeline */}
      <StatusTimeline status={status} />

      {/* Articles */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Articles ({order.items.length})
          </div>
        </div>
        <ul>
          {order.items.map((item, i) => (
            <li
              key={item.id}
              className={`flex items-center gap-4 px-6 py-4 ${i < order.items.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <div className="w-14 h-14 rounded-lg bg-[#F6E5E5] shrink-0 relative overflow-hidden flex items-center justify-center">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <Shirt size={22} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold truncate">{item.productName}</div>
                {item.variantLabel && (
                  <div className="text-[12px] text-gray-500">{item.variantLabel}</div>
                )}
                <div className="text-[12px] text-gray-400 mt-0.5">
                  Qté : {item.quantity}
                </div>
              </div>
              <div className="text-sm font-bold shrink-0">
                {formatPrice(item.subtotal)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Récapitulatif + Adresse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Récapitulatif */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            Récapitulatif
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Réduction</span>
                <span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="text-green-600 font-medium">Offerte</span>
                ) : (
                  formatPrice(order.shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100 mt-2">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            Livraison à
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <div className="text-sm space-y-0.5">
              <div className="font-semibold">{order.shippingFullName}</div>
              <div className="text-gray-500">{order.shippingDistrict}, {order.shippingCity}</div>
              {order.shippingStreet && (
                <div className="text-gray-500">{order.shippingStreet}</div>
              )}
              <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                <Phone size={12} />
                {order.shippingPhone}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="rounded-2xl bg-brand-blue-dark px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <AlertCircle size={18} className="text-white/60 shrink-0" />
          <span className="text-sm text-white/80">Un problème avec cette commande ?</span>
        </div>
        <a
          href="https://wa.me/2250000000000"
          className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform shrink-0"
        >
          <MessageCircle size={14} /> Nous contacter
        </a>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<
    { ok: true; order: OrderTracking } | { ok: false; error: string } | null
  >(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await trackOrder(orderNumber, phone);
      setResult(res);
    });
  }

  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6 bg-[#fff3bb]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div>
            <div className="mb-3"><Package size={48} className="text-gray-700" /></div>
            <h1 className="text-5xl font-bold tracking-tight mb-2">Suivi de commande</h1>
            <p className="text-sm text-gray-700">
              Entrez votre numéro de commande et votre téléphone pour suivre votre livraison
            </p>
          </div>
        </div>
      </section>

      <section className="container-shop py-12">
        <div className="max-w-xl">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 space-y-4"
          >
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Numéro de commande
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="KL-2026-00001"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300 font-mono tracking-wider"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Disponible dans votre email ou SMS de confirmation
              </p>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07 00 00 00 00"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors placeholder:text-gray-300"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Numéro utilisé lors de la commande
              </p>
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-black text-white py-3.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <RefreshCcw size={15} className="animate-spin" />
              ) : (
                <Search size={15} />
              )}
              {isPending ? "Recherche en cours…" : "Suivre ma commande"}
            </button>
          </form>

          {/* Error state */}
          {result && !result.ok && (
            <div className="rounded-2xl bg-red-50 border border-red-100 px-6 py-5 flex items-start gap-3 mb-8">
              <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-600 mb-0.5">Commande introuvable</p>
                <p className="text-sm text-red-500">{result.error}</p>
              </div>
            </div>
          )}

          {/* Success state */}
          {result && result.ok && <OrderResult order={result.order} />}
        </div>
      </section>

      {/* Info strip */}
      {!result && (
        <section className="bg-[#FDF8F8] py-10">
          <div className="container-shop">
            <div className="max-w-xl space-y-3">
              {[
                { Icon: Clock,        text: "Les commandes Abidjan sont livrées sous 24–48h." },
                { Icon: Phone,        text: "Le livreur vous contacte avant son passage." },
                { Icon: MessageCircle,text: "Questions ? Écrivez-nous sur WhatsApp." },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon size={15} className="text-gray-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
