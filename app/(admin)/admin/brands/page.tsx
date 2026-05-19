import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BrandsTable } from "./BrandsTable";

async function getBrands() {
  try {
    return await (prisma as any).brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="p-8 max-w-[900px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marques</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {brands.length} marque{brands.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          <Plus size={15} /> Nouvelle marque
        </Link>
      </div>

      <BrandsTable brands={brands} />
    </div>
  );
}
