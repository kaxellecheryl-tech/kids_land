"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, CheckCircle, XCircle } from "lucide-react";
import { TablePagination } from "@/components/admin/TablePagination";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  usedCount: number;
  maxUses: number | null;
  expiresAt: Date | string | null;
  isActive: boolean;
};

function formatDiscount(type: string, value: number) {
  if (type === "PERCENTAGE")   return `−${value}%`;
  if (type === "FIXED_AMOUNT") return `−${value} F`;
  return "Livraison offerte";
}

function formatDate(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const PER_PAGE = 10;

export function CouponsTable({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const paginated = coupons.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400 text-sm">
        Aucun code promo pour le moment
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {["Code", "Remise", "Utilisations", "Expiration", "Statut", ""].map((h) => (
              <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-3 first:pl-6 last:pr-6 last:w-16">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {paginated.map((c) => {
            const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
            const isFull    = c.maxUses !== null && c.usedCount >= c.maxUses;
            return (
              <tr key={c.id} onClick={() => router.push(`/admin/coupons/${c.id}`)} className="hover:bg-gray-50/40 cursor-pointer transition-colors">
                <td className="px-6 py-3">
                  <span className="font-mono text-[13px] font-bold tracking-widest">{c.code}</span>
                  {c.description && <p className="text-[11px] text-gray-400 mt-0.5">{c.description}</p>}
                </td>
                <td className="px-4 py-3 text-[13px] font-semibold text-brand-orange">
                  {formatDiscount(c.discountType, c.discountValue)}
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-500">
                  {c.usedCount}{c.maxUses !== null ? ` / ${c.maxUses}` : ""}
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-500">{formatDate(c.expiresAt)}</td>
                <td className="px-4 py-3">
                  {!c.isActive || isExpired || isFull ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500">
                      <XCircle size={12} /> Inactif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
                      <CheckCircle size={12} /> Actif
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <Link href={`/admin/coupons/${c.id}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-black transition-colors">
                    <Pencil size={12} /> Éditer
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <TablePagination total={coupons.length} page={page} perPage={PER_PAGE} onPageChange={setPage} />
    </div>
  );
}
