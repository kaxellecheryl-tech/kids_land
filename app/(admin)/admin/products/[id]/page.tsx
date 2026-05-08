import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductInput } from "@/app/actions/admin";

async function getProductData(id: string) {
  try {
    const [product, categories, brands] = await Promise.all([
      (prisma as any).product.findUnique({
        where: { id },
        include: {
          variants: true,
          images: { orderBy: { position: "asc" } },
        },
      }),
      (prisma as any).category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      (prisma as any).brand.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
    ]);
    return { product, categories, brands };
  } catch {
    return { product: null, categories: [], brands: [] };
  }
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product, categories, brands } = await getProductData(id);

  if (!product) notFound();

  const initial: Partial<ProductInput> & {
    id: string;
    variants: any[];
    images: any[];
  } = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    categoryId: product.categoryId,
    brandId: product.brandId ?? "",
    basePrice: product.basePrice,
    comparePrice: product.comparePrice ?? undefined,
    gender: product.gender,
    ageRangeMin: product.ageRangeMin ?? undefined,
    ageRangeMax: product.ageRangeMax ?? undefined,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    variants: product.variants,
    images: product.images,
  };

  return (
    <div className="p-8 max-w-[800px]">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Produits
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-[12px] text-gray-400 font-mono mt-0.5">/products/{product.slug}</p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="text-[11px] font-semibold text-gray-500 hover:text-black transition-colors border border-gray-200 rounded-lg px-3 py-1.5"
          >
            Voir sur la boutique ↗
          </Link>
        </div>
      </div>

      <ProductForm categories={categories} brands={brands} initial={initial} />
    </div>
  );
}
