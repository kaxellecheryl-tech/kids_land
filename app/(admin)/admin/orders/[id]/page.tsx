import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, User, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { StatusForm } from "./StatusForm";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  PROCESSING: "En préparation",
  SHIPPED: "Expédié",
  DELIVERED: "Livré",
  CANCELLED: "Annulé",
  REFUNDED: "Remboursé",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-600",
};

const PAYMENT_LABELS: Record<string, string> = {
  wave: "Wave",
  orange_money: "Orange Money",
  mtn: "MTN Money",
  card: "Carte bancaire",
};

async function getOrder(id: string) {
  try {
    return await (prisma as any).order.findUnique({
      where: { id },
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        items: true,
      },
    });
  } catch {
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="p-8 max-w-[900px]">
      {/* Back + header */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Commandes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{order.orderNumber}</h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${
              STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"
            }`}
          >
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: items + status */}
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              <Package size={16} className="text-gray-400" />
              <h2 className="text-[14px] font-bold">
                Articles ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  {item.productImage && (
                    <div className="w-12 h-14 rounded-lg bg-brand-pink overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold">{item.productName}</p>
                    {item.variantLabel && (
                      <p className="text-[11px] text-gray-400">{item.variantLabel}</p>
                    )}
                    <p className="text-[11px] text-gray-400">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[13px] font-bold shrink-0">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-2 bg-gray-50/50">
              <div className="flex justify-between text-[12px] text-gray-500">
                <span>Sous-total</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[12px] text-gray-500">
                <span>Livraison</span>
                <span>
                  {order.shippingFee === 0 ? "Offerte" : formatPrice(order.shippingFee)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[12px] text-green-600">
                  <span>Réduction</span>
                  <span>−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[14px] font-bold border-t border-gray-100 pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status update */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <StatusForm
              orderId={order.id}
              currentStatus={order.status}
              currentPaymentStatus={order.paymentStatus}
              currentPaymentMethod={order.paymentMethod}
            />
          </div>
        </div>

        {/* Right column: client + address + payment */}
        <div className="space-y-4">
          {/* Client */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <User size={15} className="text-gray-400" />
              <h2 className="text-[13px] font-bold">Client</h2>
            </div>
            {order.user ? (
              <div className="space-y-1">
                <p className="text-[13px] font-semibold">
                  {order.user.fullName ?? "—"}
                </p>
                <p className="text-[12px] text-gray-500">{order.user.email}</p>
                {order.user.phone && (
                  <p className="text-[12px] text-gray-500">{order.user.phone}</p>
                )}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400">Client non connecté</p>
            )}
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={15} className="text-gray-400" />
              <h2 className="text-[13px] font-bold">Livraison</h2>
            </div>
            <div className="space-y-1 text-[12px] text-gray-600">
              <p className="font-semibold text-black">{order.shippingFullName}</p>
              <p className="flex items-center gap-1">
                <Phone size={11} className="text-gray-400" />
                {order.shippingPhone}
              </p>
              <p>
                {order.shippingDistrict}, {order.shippingCity}
              </p>
              {order.shippingStreet && <p className="text-gray-400">{order.shippingStreet}</p>}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-[13px] font-bold mb-3">Paiement</h2>
            <div className="space-y-1.5 text-[12px]">
              <div className="flex justify-between">
                <span className="text-gray-500">Méthode</span>
                <span className="font-medium">
                  {PAYMENT_LABELS[order.paymentMethod ?? ""] ?? order.paymentMethod ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Statut</span>
                <span
                  className={`font-semibold ${
                    order.paymentStatus === "PAID" ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {order.paymentStatus === "PAID" ? "Payé" : order.paymentStatus}
                </span>
              </div>
              {order.paymentRef && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Réf.</span>
                  <span className="font-mono text-[11px] text-gray-600">
                    {order.paymentRef}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
