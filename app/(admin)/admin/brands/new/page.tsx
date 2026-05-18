import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandForm } from "@/components/admin/BrandForm";

export const metadata = { title: "Nouvelle marque" };

export default function NewBrandPage() {
  return (
    <div className="p-8 max-w-[600px]">
      <div className="mb-6">
        <Link
          href="/admin/brands"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Marques
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Nouvelle marque</h1>
      </div>

      <BrandForm />
    </div>
  );
}
