"use client";

import { useState, useTransition } from "react";
import { RefreshCcw, ChevronDown } from "lucide-react";
import { updateOrderStatus } from "@/app/actions/admin";
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

export function StatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSave() {
    if (status === currentStatus) return;
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.error) {
        setError(result.error);
        setStatus(currentStatus);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">
        Statut de la commande
      </label>
      <div className="flex items-center gap-3">
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
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isPending || status === currentStatus}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending && <RefreshCcw size={12} className="animate-spin" />}
          Enregistrer
        </button>
      </div>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
