"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { TablePagination } from "@/components/admin/TablePagination";

const STATUS_LABELS: Record<string, string> = {
  PENDING:    "En attente",
  PAID:       "Payé",
  PROCESSING: "En préparation",
  SHIPPED:    "Expédié",
  DELIVERED:  "Livré",
  CANCELLED:  "Annulé",
  REFUNDED:   "Remboursé",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "bg-amber-100 text-amber-700",
  PAID:       "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED:    "bg-indigo-100 text-indigo-700",
  DELIVERED:  "bg-green-100 text-green-700",
  CANCELLED:  "bg-red-100 text-red-700",
  REFUNDED:   "bg-gray-100 text-gray-600",
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: Date | string;
  status: string;
  total: number;
  shippingPhone: string;
  user?: { fullName: string | null } | null;
  shippingFullName: string;
};

const PER_PAGE = 10;

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [page, setPage] = useState(1);
  const paginated = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400 text-sm">
        Aucune commande
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 py-3">N° commande</th>
            <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">Client</th>
            <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">Date</th>
            <th className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3">Statut</th>
            <th className="text-right text-[10px] font-black uppercase tracking-widest text-gray-400 px-6 py-3">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.map((order) => (
            <tr key={order.id} className="relative hover:bg-gray-50/50 cursor-pointer transition-colors">
              <td className="px-6 py-4">
                <Link href={`/admin/orders/${order.id}`} className="absolute inset-0" aria-label={`Commande ${order.orderNumber}`} />
                <span className="text-[13px] font-bold">{order.orderNumber}</span>
              </td>
              <td className="px-4 py-4">
                <p className="text-[13px] font-medium">{order.user?.fullName ?? order.shippingFullName}</p>
                <p className="text-[11px] text-gray-400">{order.shippingPhone}</p>
              </td>
              <td className="px-4 py-4 text-[12px] text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-4 py-4">
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-[13px] font-bold">{formatPrice(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination total={orders.length} page={page} perPage={PER_PAGE} onPageChange={setPage} />
    </div>
  );
}
