import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CouponsTable } from "./CouponsTable";

async function getCoupons() {
  try {
    return await (prisma as any).coupon.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="p-8 max-w-[1000px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Codes promo</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {coupons.length} code{coupons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          <Plus size={15} /> Nouveau code
        </Link>
      </div>

      <CouponsTable coupons={coupons} />
    </div>
  );
}
