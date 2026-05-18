import Link from "next/link";
import { Plus, Pencil, CheckCircle, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

function formatDiscount(type: string, value: number) {
  if (type === "PERCENTAGE")   return `−${value}%`;
  if (type === "FIXED_AMOUNT") return `−${value} F`;
  return "Livraison offerte";
}

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

async function getCoupons() {
  try {
    return await (prisma as any).coupon.findMany({ orderBy: { createdAt: "desc" } });
  } catch { return []; }
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="p-8 max-w-[1000px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Codes promo</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">{coupons.length} code{coupons.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          <Plus size={15} /> Nouveau code
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm mb-4">Aucun code promo pour le moment</p>
            <Link href="/admin/coupons/new" className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors">
              <Plus size={15} /> Créer le premier code
            </Link>
          </div>
        ) : (
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
              {coupons.map((c: any) => {
                const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
                const isFull    = c.maxUses !== null && c.usedCount >= c.maxUses;
                return (
                  <tr key={c.id} className="hover:bg-gray-50/40 transition-colors">
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
                    <td className="px-4 py-3 text-[12px] text-gray-500">
                      {formatDate(c.expiresAt)}
                    </td>
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
                    <td className="px-6 py-3 text-right">
                      <Link href={`/admin/coupons/${c.id}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 hover:text-black transition-colors">
                        <Pencil size={12} /> Éditer
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
