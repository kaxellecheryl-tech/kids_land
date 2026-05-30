"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Clock, CheckCircle, Package, Truck, XCircle, RotateCcw,
  MapPin, Phone, MessageCircle, AlertCircle, ChevronDown, Shirt,
  type LucideIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type StatusKey = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

const STATUS_STEPS: StatusKey[] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_META: Record<StatusKey, { label: string; desc: string; color: string; Icon: LucideIcon }> = {
  PENDING:    { label: "En attente",     desc: "Paiement en cours de validation",           color: "#fff3bb", Icon: Clock       },
  PAID:       { label: "Payée",          desc: "Paiement confirmé — préparation imminente", color: "#d8f5c0", Icon: CheckCircle },
  PROCESSING: { label: "En préparation", desc: "Votre commande est en cours de traitement", color: "#99C5FF", Icon: Package     },
  SHIPPED:    { label: "Expédiée",       desc: "Votre commande est en route",               color: "#99C5FF", Icon: Truck       },
  DELIVERED:  { label: "Livrée",         desc: "Commande remise avec succès",               color: "#d8f5c0", Icon: CheckCircle },
  CANCELLED:  { label: "Annulée",        desc: "Commande annulée",                          color: "#F6E5E5", Icon: XCircle     },
  REFUNDED:   { label: "Remboursée",     desc: "Remboursement effectué",                    color: "#F6E5E5", Icon: RotateCcw   },
};

export type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  total: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  shippingFullName: string;
  shippingPhone: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingStreet: string | null;
  items: {
    id: string;
    productName: string;
    productImage: string | null;
    variantLabel: string | null;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
};

function StatusTimeline({ status }: { status: StatusKey }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  const isFinal = status === "CANCELLED" || status === "REFUNDED";

  if (isFinal) {
    const meta = STATUS_META[status];
    return (
      <div className="rounded-2xl px-5 py-4 flex items-center gap-3" style={{ backgroundColor: meta.color }}>
        <meta.Icon size={22} className="shrink-0 text-gray-600" />
        <div>
          <div className="font-bold">{meta.label}</div>
          <div className="text-sm text-gray-600">{meta.desc}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF8F8] rounded-2xl p-5 border border-gray-100">
      <div className="flex items-start gap-0">
        {STATUS_STEPS.map((step, i) => {
          const meta = STATUS_META[step];
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = meta.Icon;
          return (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div className="w-full flex items-center">
                <div className={`flex-1 h-0.5 ${i === 0 ? "opacity-0" : done ? "bg-brand-orange" : "bg-gray-200"}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                  active ? "bg-brand-orange border-brand-orange text-white"
                  : done ? "bg-[#d8f5c0] border-[#7ED957] text-gray-700"
                  : "bg-white border-gray-200 text-gray-300"
                }`}>
                  <Icon size={13} />
                </div>
                <div className={`flex-1 h-0.5 ${i === STATUS_STEPS.length - 1 ? "opacity-0" : done && i < currentIdx ? "bg-brand-orange" : "bg-gray-200"}`} />
              </div>
              <div className={`mt-1.5 text-center px-1 ${active ? "text-brand-orange font-bold" : done ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                <div className="text-[10px] leading-tight hidden sm:block">{meta.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
        {(() => {
          const meta = STATUS_META[status];
          const Icon = meta.Icon;
          return (
            <>
              <Icon size={14} className="text-brand-orange shrink-0" />
              <span className="text-sm font-semibold text-brand-orange">{meta.label}</span>
              <span className="text-sm text-gray-500">— {meta.desc}</span>
            </>
          );
        })()}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: OrderRow }) {
  const [expanded, setExpanded] = useState(false);
  const status = order.status as StatusKey;
  const meta = STATUS_META[status] ?? STATUS_META.PENDING;
  const date = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: meta.color }}
        >
          <meta.Icon size={17} className="text-gray-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[15px] font-bold font-mono">{order.orderNumber}</span>
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: meta.color }}
            >
              {meta.label}
            </span>
          </div>
          <div className="text-[12px] text-gray-400 mt-0.5">
            {date} · {order.items.length} article{order.items.length > 1 ? "s" : ""} · {formatPrice(order.total)}
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-6 py-6 space-y-5">
          <StatusTimeline status={status} />

          {/* Items */}
          <ul className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3">
                <div className="w-12 h-12 rounded-lg bg-[#F6E5E5] shrink-0 relative overflow-hidden flex items-center justify-center">
                  {item.productImage ? (
                    <Image src={item.productImage} alt={item.productName} fill sizes="48px" className="object-cover" />
                  ) : (
                    <Shirt size={18} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate">{item.productName}</div>
                  {item.variantLabel && <div className="text-[12px] text-gray-500">{item.variantLabel}</div>}
                  <div className="text-[12px] text-gray-400">Qté : {item.quantity}</div>
                </div>
                <div className="text-sm font-bold shrink-0">{formatPrice(item.subtotal)}</div>
              </li>
            ))}
          </ul>

          {/* Totals + address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FDF8F8] rounded-xl p-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réduction</span><span>−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{order.shippingFee === 0 ? <span className="text-green-600">Offerte</span> : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1.5 border-t border-gray-200">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>
            <div className="bg-[#FDF8F8] rounded-xl p-4 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold">{order.shippingFullName}</div>
                  <div className="text-gray-500">{order.shippingDistrict}, {order.shippingCity}</div>
                  {order.shippingStreet && <div className="text-gray-500">{order.shippingStreet}</div>}
                  <div className="flex items-center gap-1 text-gray-500 mt-1">
                    <Phone size={11} />{order.shippingPhone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="rounded-xl bg-brand-blue-dark px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-white/60 shrink-0" />
              <span className="text-sm text-white/80">Un problème avec cette commande ?</span>
            </div>
            <a
              href="https://wa.me/2250777063646"
              className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-full text-[12px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform shrink-0"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function OrdersList({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FDF8F8] flex items-center justify-center mx-auto mb-4">
          <Package size={28} className="text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">Aucune commande</h2>
        <p className="text-sm text-gray-500 mb-6">Vous n&apos;avez pas encore passé de commande.</p>
        <a
          href="/products"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          Découvrir la collection
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
