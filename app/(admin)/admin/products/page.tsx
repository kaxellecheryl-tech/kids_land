import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductsTable } from "./ProductsTable";

async function getProducts() {
  try {
    return await (prisma as any).product.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        basePrice: true,
        comparePrice: true,
        isActive: true,
        isFeatured: true,
        category: { select: { name: true } },
        brand: { select: { name: true } },
        variants: { select: { stock: true } },
        images: {
          where: { position: 0 },
          take: 1,
          select: { url: true },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-8 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
        >
          <Plus size={15} /> Nouveau produit
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
          <p className="text-gray-400 text-sm mb-4">Aucun produit pour le moment</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide hover:bg-brand-orange transition-colors"
          >
            <Plus size={15} /> Créer le premier produit
          </Link>
        </div>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  );
}
