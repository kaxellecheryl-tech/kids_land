import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

async function getCatalogData() {
  try {
    const [categories, brands] = await Promise.all([
      (prisma as any).category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      (prisma as any).brand.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);
    return { categories, brands };
  } catch {
    return { categories: [], brands: [] };
  }
}

export default async function NewProductPage() {
  const { categories, brands } = await getCatalogData();

  return (
    <div className="p-8 max-w-[800px]">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Produits
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Nouveau produit</h1>
      </div>

      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
