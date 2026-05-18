import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CouponForm } from "@/components/admin/CouponForm";

export const metadata = { title: "Nouveau code promo" };

export default function NewCouponPage() {
  return (
    <div className="p-8 max-w-[680px]">
      <div className="mb-6">
        <Link href="/admin/coupons" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-4">
          <ArrowLeft size={12} /> Codes promo
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Nouveau code promo</h1>
      </div>
      <CouponForm />
    </div>
  );
}
