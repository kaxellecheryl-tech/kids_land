"use client";

import { useState, useTransition } from "react";
import { RefreshCcw, ChevronDown, CreditCard, CheckCircle } from "lucide-react";
import { updateOrderStatus, markOrderAsPaid } from "@/app/actions/admin";
import { buildClientWhatsAppUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "En attente" },
  { value: "PAID", label: "Payé" },
  { value: "PROCESSING", label: "En préparation" },
  { value: "SHIPPED", label: "Expédié" },
  { value: "DELIVERED", label: "Livré" },
  { value: "CANCELLED", label: "Annulé" },
  { value: "REFUNDED", label: "Remboursé" },
];

const PAYMENT_METHODS = [
  { value: "wave", label: "Wave" },
  { value: "orange_money", label: "Orange Money" },
  { value: "mtn", label: "MTN Momo" },
  { value: "djamo", label: "Djamo" },
  { value: "especes", label: "Espèces" },
];

export function StatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentPaymentMethod,
  clientPhone,
  clientName,
  orderNumber,
}: {
  orderId: string;
  currentStatus: string;
  currentPaymentStatus: string;
  currentPaymentMethod?: string | null;
  clientPhone: string;
  clientName: string;
  orderNumber: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [paymentMethod, setPaymentMethod] = useState(currentPaymentMethod ?? "wave");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isPaying, startPaying] = useTransition();
  const router = useRouter();

  const isPaid = currentPaymentStatus === "PAID";

  function openClientWhatsApp(newStatus: string) {
    const url = buildClientWhatsAppUrl(clientPhone, clientName, orderNumber, newStatus);
    if (url) window.open(url, "_blank");
  }

  function handleSave() {
    if (status === currentStatus) return;
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.error) {
        setError(result.error);
        setStatus(currentStatus);
      } else {
        openClientWhatsApp(status);
        router.refresh();
      }
    });
  }

  function handleMarkAsPaid() {
    setError(null);
    startPaying(async () => {
      const result = await markOrderAsPaid(orderId, paymentMethod);
      if (result.error) {
        setError(result.error);
      } else {
        openClientWhatsApp("PAID");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Statut commande */}
      <div className="space-y-3">
        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">
          Statut de la commande
        </label>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-[13px] font-semibold outline-none focus:border-brand-orange transition-colors cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={handleSave}
            disabled={isPending || status === currentStatus}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending && <RefreshCcw size={12} className="animate-spin" />}
            Enregistrer & notifier
          </button>
        </div>
        <p className="text-[11px] text-gray-400">WhatsApp s&apos;ouvrira automatiquement pour notifier le client.</p>
      </div>

      {/* Paiement */}
      <div className="border-t border-gray-100 pt-5 space-y-3">
        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">
          Paiement
        </label>

        {isPaid ? (
          <div className="flex items-center gap-2 text-green-600 text-[13px] font-semibold">
            <CheckCircle size={15} />
            Confirmé — {PAYMENT_METHODS.find((m) => m.value === currentPaymentMethod)?.label ?? currentPaymentMethod}
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-9 py-2.5 text-[13px] font-semibold outline-none focus:border-brand-orange transition-colors cursor-pointer"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={handleMarkAsPaid}
              disabled={isPaying}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wide hover:bg-green-700 transition-colors disabled:opacity-40"
            >
              {isPaying ? <RefreshCcw size={12} className="animate-spin" /> : <CreditCard size={13} />}
              Marquer payé & notifier
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
