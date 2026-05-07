import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard, type ProductCardData } from "@/components/shop/ProductCard";
import { ProductDetail, type ProductFull } from "./ProductDetail";
import type { Metadata } from "next";
import { formatAge } from "@/lib/utils";

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProduct(slug: string): Promise<ProductFull | null> {
  try {
    const p = await (prisma as any).product.findUnique({
      where: { slug, isActive: true },
      include: {
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
      },
    });
    if (!p) return null;

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      brand: p.brand,
      category: p.category,
      basePrice: p.basePrice,
      comparePrice: p.comparePrice,
      ageRangeMin: p.ageRangeMin,
      ageRangeMax: p.ageRangeMax,
      gender: p.gender,
      images: p.images.map((img: any) => ({ url: img.url, alt: img.alt })),
      variants: p.variants.map((v: any) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        priceOverride: v.priceOverride,
        sku: v.sku,
      })),
    };
  } catch {
    return null;
  }
}

async function getRelated(
  categoryId: string,
  currentSlug: string
): Promise<ProductCardData[]> {
  try {
    const rows = await (prisma as any).product.findMany({
      where: { categoryId, isActive: true, slug: { not: currentSlug } },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
    });

    return rows.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name ?? "Kids Land",
      basePrice: p.basePrice,
      comparePrice: p.comparePrice,
      imageUrl: p.images[0]?.url ?? "",
      imageBg: "#F6E5E5",
      badge: p.comparePrice && p.comparePrice > p.basePrice ? "sale" : null,
    }));
  } catch {
    return [];
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produit introuvable" };

  const ageLabel =
    product.ageRangeMin !== null && product.ageRangeMax !== null
      ? ` · ${formatAge(product.ageRangeMin)}–${formatAge(product.ageRangeMax)}`
      : "";

  return {
    title: `${product.name}${product.brand ? ` — ${product.brand.name}` : ""}`,
    description:
      product.description?.slice(0, 155) ??
      `${product.name} par ${product.brand?.name ?? "Kids Land"}${ageLabel}. Livraison rapide en Côte d'Ivoire.`,
    openGraph: {
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const rawCat = await (prisma as any).category.findUnique({
    where: { slug: product.category.slug },
    select: { id: true },
  });

  const displayRelated = rawCat ? await getRelated(rawCat.id, slug) : [];

  const GENDER_BG: Record<string, string> = {
    GIRL: "#F6E5E5",
    BOY: "#99C5FF",
    UNISEX: "#d8f5c0",
  };
  const heroBg = GENDER_BG[product.gender] ?? "#FDF8F8";

  return (
    <>
      {/* Breadcrumb banner */}
      <section className="pt-12 pb-8 px-6" style={{ backgroundColor: heroBg }}>
        <div className="container-shop">
          <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            <Link href="/" className="hover:text-black transition-colors">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-black transition-colors"
            >
              {product.category.name}
            </Link>
            {product.brand && (
              <>
                <span className="text-gray-300">/</span>
                <Link
                  href={`/brands/${product.brand.slug}`}
                  className="hover:text-black transition-colors"
                >
                  {product.brand.name}
                </Link>
              </>
            )}
          </nav>
        </div>
      </section>

      {/* Product detail */}
      <section className="container-shop py-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft size={12} /> Retour aux produits
        </Link>
        <ProductDetail product={product} />
      </section>

      {/* Related products */}
      {displayRelated.length > 0 && (
        <section className="bg-[#FDF8F8] py-16">
          <div className="container-shop">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {displayRelated.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
