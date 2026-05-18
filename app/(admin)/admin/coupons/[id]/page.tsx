import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CouponForm } from "@/components/admin/CouponForm";

async function getCoupon(id: string) {
  try { return await (prisma as any).coupon.findUnique({ where: { id } }); }
  catch { return null; }
}

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coupon = await getCoupon(id);
  if (!coupon) notFound();

  return (
    <div className="p-8 max-w-[680px]">
      <div className="mb-6">
        <Link href="/admin/coupons" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-4">
          <ArrowLeft size={12} /> Codes promo
        </Link>
        <h1 className="text-2xl font-bold tracking-tight font-mono tracking-widest">{coupon.code}</h1>
      </div>
      <CouponForm initial={coupon} />
    </div>
  );
}
