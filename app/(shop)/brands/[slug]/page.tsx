import Link from "next/link";
import { ArrowLeft, ArrowRight, Tag, Baby, Package, type LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard, type ProductCardData } from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";
import { computeMinPrice } from "@/lib/utils";
import type { Metadata } from "next";

const BRAND_STYLES: Record<string, { bg: string; Icon: LucideIcon }> = {
  "babybol": { bg: "#F6E5E5", Icon: Baby },
};

const BRAND_DESCRIPTIONS: Record<string, string> = {
  "babybol": "Babybol est une marque espagnole de vêtements pour bébés et enfants, reconnue pour ses ensembles alliant confort, qualité et style avec des finitions soignées. Ses matières douces conviennent aux peaux sensibles des tout-petits, et la certification OEKO-TEX Standard 100 garantit l'absence de substances nocives. La marque se situe au même niveau de qualité que Zara Kids, H&M Kids ou Kiabi.",
};

const FALLBACK: { bg: string; Icon: LucideIcon } = { bg: "#99C5FF", Icon: Tag };

async function getBrand(slug: string) {
  try {
    return await prisma.brand.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

async function getBrandProducts(brandId: string): Promise<ProductCardData[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { brandId, isActive: true },
      orderBy: { name: "asc" },
      include: {
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
        variants: { select: { priceOverride: true } },
      },
    });

    return rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name ?? "Kids Land",
      basePrice: p.basePrice,
      comparePrice: p.comparePrice,
      minPrice: computeMinPrice(p.basePrice, p.variants),
      imageUrl: p.images[0]?.url ?? "",
      imageBg: BRAND_STYLES[p.brand?.slug ?? ""]?.bg ?? "#F6E5E5",
      badge: p.comparePrice && p.comparePrice > p.basePrice ? "sale" : null,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return { title: "Marque introuvable" };
  return {
    title: brand.name,
    description: `Découvrez la collection ${brand.name} chez Kids Land.`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const products = await getBrandProducts(brand.id);
  const style = BRAND_STYLES[slug] ?? FALLBACK;
  const { Icon } = style;
  const description = BRAND_DESCRIPTIONS[slug] ?? `Découvrez toute la collection ${brand.name} — des pièces sélectionnées avec soin pour vos enfants.`;

  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6" style={{ backgroundColor: style.bg }}>
        <div className="container-shop">
          <Link
            href="/brands"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Nos marques
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-4">
                {brand.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-16 w-auto object-contain"
                  />
                ) : (
                  <Icon size={48} className="text-gray-700" />
                )}
              </div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">{brand.name}</h1>
              <p className="text-sm text-gray-700 max-w-xl leading-relaxed mt-2">
                {description}
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-4xl font-bold tracking-tight">{products.length}</div>
              <div className="text-[11px] font-medium uppercase tracking-widest text-gray-600 mt-0.5">
                {products.length === 1 ? "article" : "articles"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="container-shop py-12">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Package size={56} className="text-gray-200 mb-4" />
            <h2 className="text-xl font-bold mb-2">
              Aucun article {brand.name} disponible
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              De nouvelles pièces arrivent très bientôt.
            </p>
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={14} /> Retour aux marques
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="flex justify-center mt-12">
              <Link
                href="/brands"
                className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                <ArrowLeft size={13} /> Toutes les marques
              </Link>
            </div>
          </>
        )}
      </section>

      {/* OTHER BRANDS */}
      <OtherBrands currentSlug={slug} />
    </>
  );
}

async function OtherBrands({ currentSlug }: { currentSlug: string }) {
  try {
    const others = await prisma.brand.findMany({
      where: { slug: { not: currentSlug } },
      take: 4,
      orderBy: { name: "asc" },
      include: { _count: { select: { products: { where: { isActive: true } } } } },
    });

    if (others.length === 0) return null;

    const FALLBACK_ICONS: LucideIcon[] = [Baby, Tag];

    return (
      <section className="bg-[#FDF8F8] py-14">
        <div className="container-shop">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Autres marques</h2>
            <Link
              href="/brands"
              className="text-xs font-bold tracking-wide uppercase text-brand-orange flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Toutes <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(others as { id: string; slug: string; name: string; logoUrl: string | null; _count: { products: number } }[]).map((b, i) => {
              const s = BRAND_STYLES[b.slug] ?? { bg: "#99C5FF", Icon: FALLBACK_ICONS[i % FALLBACK_ICONS.length] };
              const BrandIcon = s.Icon;
              return (
                <Link
                  key={b.id}
                  href={`/brands/${b.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className="h-20 flex items-center justify-center"
                    style={{ backgroundColor: s.bg }}
                  >
                    {b.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.logoUrl}
                        alt={b.name}
                        className="h-10 w-auto object-contain"
                      />
                    ) : (
                      <BrandIcon size={32} className="text-gray-600" />
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-sm font-bold">{b.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {b._count.products} articles
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}
