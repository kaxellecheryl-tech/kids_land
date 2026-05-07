import Link from "next/link";
import { ArrowLeft, Sparkles, Tag, Shirt, Baby, Backpack, Search, type LucideIcon } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";
import { Gender, Prisma } from "@prisma/client";

type SearchParams = { filter?: string; gender?: string; category?: string; q?: string };

const PAGE_META: Record<string, { title: string; subtitle: string; bg: string; Icon: LucideIcon }> = {
  "filter:new":           { title: "Nouveautés",       subtitle: "Les dernières pièces sélectionnées pour vous",  bg: "#99C5FF", Icon: Sparkles  },
  "filter:sale":          { title: "Soldes",            subtitle: "Jusqu'à −50% sur les meilleures pièces",        bg: "#F6E5E5", Icon: Tag       },
  "gender:girl":          { title: "Filles",            subtitle: "Collections tendance pour petites filles",       bg: "#F6E5E5", Icon: Shirt     },
  "gender:boy":           { title: "Garçons",           subtitle: "Looks cool pour petits garçons",                bg: "#99C5FF", Icon: Shirt     },
  "category:bebe":        { title: "Bébé 0–24m",        subtitle: "Tenues adorables pour les tout-petits",         bg: "#d8f5c0", Icon: Baby      },
  "category:accessoires": { title: "Accessoires",       subtitle: "Casquettes, sacs, bonnets et plus encore",      bg: "#fff3bb", Icon: Backpack  },
  "search":               { title: "Résultats",         subtitle: "Articles correspondant à votre recherche",      bg: "#fff3bb", Icon: Search    },
  "default":              { title: "Tous les produits", subtitle: "Notre sélection complète de vêtements enfants", bg: "#99C5FF", Icon: Baby      },
};

function getPageKey(params: SearchParams): string {
  if (params.q)        return "search";
  if (params.filter)   return `filter:${params.filter}`;
  if (params.gender)   return `gender:${params.gender}`;
  if (params.category) return `category:${params.category}`;
  return "default";
}

async function getProducts(params: SearchParams): Promise<ProductCardData[]> {
  try {
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: "insensitive" } },
        { brand: { name: { contains: params.q, mode: "insensitive" } } },
      ];
    }

    if (params.gender === "girl") where.gender = { in: [Gender.GIRL, Gender.UNISEX] };
    if (params.gender === "boy")  where.gender = { in: [Gender.BOY,  Gender.UNISEX] };

    if (params.filter === "sale") where.comparePrice = { not: null };

    if (params.category) {
      const cat = await prisma.category.findUnique({ where: { slug: params.category } });
      if (cat) where.categoryId = cat.id;
    }

    const rows: Prisma.ProductGetPayload<{
      include: { brand: true; images: true };
    }>[] = await prisma.product.findMany({
      where,
      take: 48,
      orderBy: params.filter === "new" ? { createdAt: "desc" } : { name: "asc" },
      include: {
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
      },
    });

    return rows.map((p) => ({
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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const key = getPageKey(params);
  const meta = PAGE_META[key] ?? PAGE_META["default"];
  const products = await getProducts(params);

  return (
    <>
      {/* BANNER */}
      <section
        className="pt-16 pb-12 px-6"
        style={{ backgroundColor: meta.bg }}
      >
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3"><meta.Icon size={48} /></div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">
                {params.q ? `"${params.q}"` : meta.title}
              </h1>
              <p className="text-sm text-gray-600">{meta.subtitle}</p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-4xl font-bold tracking-tight">{products.length}</div>
              <div className="text-[11px] font-medium uppercase tracking-widest text-gray-500 mt-0.5">
                {products.length === 1 ? "article" : "articles"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="container-shop py-12">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Search size={56} className="text-gray-200 mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucun article trouvé</h2>
            <p className="text-sm text-gray-500 mb-8">
              Il n&apos;y a pas encore d&apos;articles dans cette catégorie.
            </p>
            <Link href="/products" className="btn-primary">
              Voir tous les articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
