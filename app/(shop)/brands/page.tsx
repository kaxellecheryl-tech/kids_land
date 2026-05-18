import Link from "next/link";
import { ArrowLeft, ArrowRight, Tag, Baby, type LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";

const BRAND_STYLES: Record<string, { bg: string; Icon: LucideIcon }> = {
  "babybol": { bg: "#F6E5E5", Icon: Baby },
};

const FALLBACK_STYLES: { bg: string; Icon: LucideIcon }[] = [
  { bg: "#99C5FF", Icon: Tag  },
  { bg: "#fff3bb", Icon: Baby },
];

async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    return brands;
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Nos Marques",
  description: "Découvrez toutes les marques disponibles chez Kids Land.",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      {/* BANNER */}
      <section className="pt-16 pb-12 px-6 bg-[#99C5FF]">
        <div className="container-shop">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft size={12} /> Accueil
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <div className="mb-3"><Tag size={48} /></div>
              <h1 className="text-5xl font-bold tracking-tight mb-2">Nos Marques</h1>
              <p className="text-sm text-gray-700">
                Sélection premium des meilleures marques internationales
              </p>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-4xl font-bold tracking-tight">{brands.length}</div>
              <div className="text-[11px] font-medium uppercase tracking-widest text-gray-600 mt-0.5">
                {brands.length === 1 ? "marque" : "marques"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND GRID */}
      <section className="container-shop py-12">
        {brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Tag size={56} className="text-gray-200 mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucune marque disponible</h2>
            <Link href="/products" className="btn-primary mt-6">
              Voir tous les articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(brands as { id: string; slug: string; name: string; logoUrl: string | null; _count: { products: number } }[]).map((brand, i) => {
              const style = BRAND_STYLES[brand.slug] ?? FALLBACK_STYLES[i % FALLBACK_STYLES.length];
              const { Icon } = style;
              const count = brand._count.products;

              return (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div
                    className="h-32 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: style.bg }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: style.bg, filter: "brightness(0.96)" }}
                    />
                    {brand.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="relative z-10 h-14 w-auto object-contain"
                      />
                    ) : (
                      <Icon size={48} className="relative z-10 text-gray-600" />
                    )}
                  </div>

                  <div className="px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight">{brand.name}</h2>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        {count} {count === 1 ? "article" : "articles"} disponibles
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-brand-orange transition-colors shrink-0">
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* REASSURANCE */}
      <section className="bg-[#FDF8F8] py-14 mt-4">
        <div className="container-shop text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-3">
            Des marques 100% authentiques
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Tous nos articles proviennent directement des marques officielles.
            Qualité garantie, zéro contrefaçon, livrés en Côte d&apos;Ivoire.
          </p>
        </div>
      </section>
    </>
  );
}
