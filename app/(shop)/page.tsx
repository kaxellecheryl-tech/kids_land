import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Shirt, Baby, Backpack, Sparkles, Footprints,
  Truck, ShieldCheck, Gift, MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";
import { formatPrice, computeMinPrice } from "@/lib/utils";

// Pour la phase 1, fallback en données mock si la DB n'est pas encore seedée.
// Phase 2 : on remplace par un vrai fetch DB.
const MOCK_PRODUCTS: ProductCardData[] = [
  {
    id: "p1",
    slug: "robe-liberty-fleurs",
    name: "Robe Liberty à fleurs",
    brand: "Primark Kids",
    basePrice: 7500,
    imageUrl: "",
    imageBg: "#F6E5E5",
    ageLabel: "Du 2 au 10 ans",
    badge: "new",
  },
  {
    id: "p2",
    slug: "set-casquette-lunettes",
    name: "Set casquette + lunettes",
    brand: "H&M Kids",
    basePrice: 4200,
    comparePrice: 6000,
    imageUrl: "",
    imageBg: "#dce9ff",
    ageLabel: "2–8 ans",
  },
  {
    id: "p3",
    slug: "veste-legere-saison",
    name: "Veste légère saison",
    brand: "Zara Mini",
    basePrice: 18900,
    imageUrl: "",
    imageBg: "#dce9ff",
    ageLabel: "4–14 ans",
    badge: "popular",
  },
  {
    id: "p4",
    slug: "sneakers-bicolores",
    name: "Sneakers bicolores",
    brand: "George",
    basePrice: 14500,
    imageUrl: "",
    imageBg: "#fff3bb",
    ageLabel: "22–35 EU",
    badge: "new",
  },
  {
    id: "p5",
    slug: "maillot-de-bain-raye",
    name: "Maillot de bain rayé",
    brand: "Primark Kids",
    basePrice: 5900,
    imageUrl: "",
    imageBg: "#F6E5E5",
    ageLabel: "2–12 ans",
  },
  {
    id: "p6",
    slug: "sac-a-dos-ecole",
    name: "Sac à dos école",
    brand: "H&M Kids",
    basePrice: 9600,
    comparePrice: 12000,
    imageUrl: "",
    imageBg: "#ffe8d4",
    ageLabel: "Taille unique",
  },
  {
    id: "p7",
    slug: "set-bonnet-gants",
    name: "Set bonnet + gants",
    brand: "Zara Mini",
    basePrice: 3800,
    imageUrl: "",
    imageBg: "#dce9ff",
    ageLabel: "2–8 ans",
  },
  {
    id: "p8",
    slug: "body-bebe-lot-5",
    name: "Body bébé lot ×5",
    brand: "Primark Kids",
    basePrice: 8200,
    imageUrl: "",
    imageBg: "#d8f5c0",
    ageLabel: "0–24 mois",
    badge: "popular",
  },
];

async function getHeroProducts(): Promise<ProductCardData[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 2,
      orderBy: { updatedAt: "desc" },
      include: {
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
        variants: { select: { priceOverride: true } },
      },
    });
    if (rows.length === 0) return MOCK_PRODUCTS.slice(0, 2);
    return rows.map((p: typeof rows[number]) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name ?? "Kids Land",
      basePrice: p.basePrice,
      comparePrice: p.comparePrice,
      minPrice: computeMinPrice(p.basePrice, p.variants),
      imageUrl: p.images[0]?.url ?? "",
      imageBg: "#F6E5E5",
    }));
  } catch {
    return MOCK_PRODUCTS.slice(0, 2);
  }
}

async function getNewProducts(): Promise<ProductCardData[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
        variants: { select: { priceOverride: true } },
      },
    });
    if (rows.length === 0) return MOCK_PRODUCTS;
    return rows.map((p: typeof rows[number]) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name ?? "Kids Land",
      basePrice: p.basePrice,
      comparePrice: p.comparePrice,
      minPrice: computeMinPrice(p.basePrice, p.variants),
      imageUrl: p.images[0]?.url ?? "",
      imageBg: "#F6E5E5",
    }));
  } catch {
    return MOCK_PRODUCTS;
  }
}

const CATEGORY_STYLES: Record<string, { Icon: LucideIcon; bg: string }> = {
  "robes-jupes":  { Icon: Shirt,      bg: "#F6E5E5" },
  "pantalons":    { Icon: Shirt,      bg: "#99C5FF" },
  "chaussures":   { Icon: Footprints, bg: "#fff3bb" },
  "bebe":         { Icon: Baby,       bg: "#d8f5c0" },
  "accessoires":  { Icon: Backpack,   bg: "#ffe8d4" },
  "ensembles":    { Icon: Sparkles,   bg: "#99C5FF" },
  "shorts":       { Icon: Shirt,      bg: "#fff3bb" },
};
const CATEGORY_FALLBACK: { Icon: LucideIcon; bg: string } = { Icon: Shirt, bg: "#F6E5E5" };

type CategoryRow = {
  slug: string;
  name: string;
  _count: { products: number };
};

type CategoryItem = { slug: string; name: string; count: number; Icon: LucideIcon; bg: string };
type BrandItem = { id: string; slug: string; name: string; logoUrl: string | null };

async function getCategories(): Promise<CategoryItem[]> {
  try {
    const rows: CategoryRow[] = await prisma.category.findMany({
      orderBy: { position: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    return rows
      .filter((c) => c._count.products > 0)
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        count: c._count.products,
        ...(CATEGORY_STYLES[c.slug] ?? CATEGORY_FALLBACK),
      }));
  } catch {
    return [];
  }
}

async function getBrands(): Promise<BrandItem[]> {
  try {
    return await prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true, logoUrl: true },
    });
  } catch {
    return [];
  }
}

const FEATURES: { Icon: LucideIcon; title: string; desc: string; bg: string }[] = [
  {
    Icon: Truck,
    title: "Livraison rapide",
    desc: "Recevez vos commandes rapidement partout en Côte d'Ivoire.",
    bg: "#99C5FF",
  },
  {
    Icon: ShieldCheck,
    title: "Marques authentiques",
    desc: "C&A, Lee Cooper, Babybol — uniquement des articles originaux et de qualité.",
    bg: "#d8f5c0",
  },
  {
    Icon: Gift,
    title: "Livraison offerte",
    desc: "La livraison est gratuite pour toute commande à partir de 30 000 F CFA d'achats.",
    bg: "#fff3bb",
  },
  {
    Icon: MessageCircle,
    title: "Support disponible",
    desc: "Notre équipe est joignable sur WhatsApp pour répondre à toutes vos questions.",
    bg: "#F6E5E5",
  },
];

export default async function HomePage() {
  const [hero, products, categories, brands] = await Promise.all([
    getHeroProducts(),
    getNewProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-68px)]">
        <div className="bg-white border-r border-gray-100 flex flex-col justify-center px-12 lg:px-16 py-20">
          <span className="inline-flex items-center gap-2 bg-brand-blue-light text-brand-blue-dark text-[11px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full w-fit mb-7">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-orange" />
            </span>
            Nouvel arrivage disponible
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.0] tracking-tight mb-6">
            Style <span className="text-brand-green">enfant</span>,
            <br />
            <span className="text-brand-orange">à portée de main.</span>
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-md mb-12">
            Babybol, Lee Cooper, C&amp;A — des marques de confiance sélectionnées
            pour habiller vos enfants avec qualité et style.{" "}
            <br />
            Livraison partout en Côte d&apos;Ivoire.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary">
              Découvrir <ArrowRight size={16} />
            </Link>
            <Link href="/brands" className="btn-secondary">
              Nos marques
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-10 mt-14 pt-10 border-t border-gray-100">
            {[
              { val: "+100", label: "Références" },
              { val: "3", label: "Marques" },
              { val: "Rapide", label: "Livraison" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold tracking-tight">{s.val}</div>
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-[1px] mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-blue-dark relative overflow-hidden flex items-center justify-center min-h-[400px]">
          {/* Background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(153,197,255,0.18)_0%,_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(246,229,229,0.15)_0%,_transparent_60%)]" />
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-brand-yellow opacity-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full bg-brand-pink opacity-20 blur-2xl" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          <div className="relative z-10 grid grid-cols-2 gap-4 p-8 lg:p-10 max-w-[460px] w-full">
            <ShowcaseCard
              brand={hero[0]?.brand ?? "Babybol"}
              name={hero[0]?.name ?? "Robe fleurie été"}
              price={formatPrice(hero[0]?.basePrice ?? 8900)}
              imageUrl={hero[0]?.imageUrl}
              slug={hero[0]?.slug}
              bg="#F6E5E5"
              tall
            />
            <ShowcaseCard
              brand={hero[1]?.brand ?? "Babybol"}
              name={hero[1]?.name ?? "Ensemble été"}
              price={formatPrice(hero[1]?.basePrice ?? 7500)}
              imageUrl={hero[1]?.imageUrl}
              slug={hero[1]?.slug}
              bg="#dce9ff"
              tall
            />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-brand-blue-dark overflow-hidden py-3.5 whitespace-nowrap">
        <div className="inline-flex gap-10 animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="inline-flex gap-10 shrink-0">
              {[
                "Babybol",
                "Lee Cooper",
                "C&A",
                "Livraison rapide",
                "livraison gratuite dès 30 000 F CFA d'achat",
              ].map((label, idx) => (
                <span
                  key={`${i}-${idx}`}
                  className="text-xs font-bold tracking-[2px] uppercase text-white inline-flex items-center gap-4"
                >
                  {label}
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="container-shop py-20">
        <SectionHeader
          title="Nos catégories"
          subtitle="Pour chaque moment de la vie de votre enfant"
          link="/products"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat: CategoryItem) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="rounded-[20px] p-7 text-center transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              style={{ backgroundColor: cat.bg }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/40 flex items-center justify-center mx-auto mb-4">
                <cat.Icon size={24} />
              </div>
              <div className="text-[13px] font-bold tracking-wide mb-1">
                {cat.name}
              </div>
              <div className="text-[11px] text-gray-700/70 font-medium">
                {cat.count} articles
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="container-shop pb-20">
        <SectionHeader
          title="Nouveautés"
          subtitle="Les dernières pièces sélectionnées pour vous"
          link="/products?filter=new"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p: ProductCardData) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>


      {/* BRANDS */}
      {brands.length > 0 && (
        <section className="bg-white border-b border-gray-100 py-20">
          <div className="container-shop">
            <SectionHeader
              title="Nos marques"
              subtitle="Sélection premium des meilleures marques internationales"
            />
            <div className="flex flex-wrap items-center justify-center gap-6">
              {brands.map((brand: BrandItem) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="group bg-white border border-gray-100 rounded-2xl px-8 py-5 flex items-center justify-center hover:border-brand-blue-dark hover:shadow-md transition-all duration-200 min-w-[140px]"
                >
                  {brand.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <span className="text-[13px] font-bold tracking-wide uppercase text-gray-600 group-hover:text-brand-blue-dark transition-colors">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="bg-[#FDF8F8] py-20">
        <div className="container-shop">
          <SectionHeader title="Pourquoi Kids Land ?" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-[20px] border border-gray-100 p-8"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.Icon size={22} />
                </div>
                <h3 className="text-[15px] font-bold mb-2">{f.title}</h3>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-shop pb-20">
        <div className="bg-black rounded-3xl p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="absolute -top-12 right-72 w-52 h-52 rounded-full bg-brand-blue-light opacity-10" />
          <div className="absolute -bottom-7 right-24 w-40 h-40 rounded-full bg-brand-yellow opacity-10" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white tracking-tight mb-2">
              Les bons plans en avant-première
            </h3>
            <p className="text-sm text-white/60">
              Rejoignez notre communauté de parents et soyez les premiers à
              découvrir nos nouveaux arrivages avant tout le monde.
            </p>
          </div>
          <form className="relative z-10 flex flex-col sm:flex-row gap-2.5 shrink-0 w-full lg:w-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              required
              className="bg-white/10 border border-white/20 rounded-full px-6 py-3.5 text-white text-sm outline-none focus:border-white/50 transition-colors w-full sm:w-72 placeholder:text-white/40"
            />
            <button
              type="submit"
              className="bg-brand-orange text-white px-7 py-3.5 rounded-full text-[13px] font-bold uppercase tracking-wide hover:-translate-y-0.5 hover:bg-orange-600 transition-all whitespace-nowrap"
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

// ───── Sub-components ─────

function SectionHeader({
  title,
  subtitle,
  link,
}: {
  title: string;
  subtitle?: string;
  link?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-12">
      <div>
        <span className="block w-10 h-1 rounded-full bg-brand-orange mb-3" />
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-1.5">{subtitle}</p>
        )}
      </div>
      {link && (
        <Link
          href={link}
          className="text-xs font-bold tracking-wide uppercase text-brand-orange flex items-center gap-1.5 hover:gap-2.5 transition-all whitespace-nowrap"
        >
          Tout voir <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

function ShowcaseCard({
  brand,
  name,
  price,
  bg,
  tall,
  imageUrl,
  slug,
}: {
  brand: string;
  name: string;
  price: string;
  bg: string;
  tall?: boolean;
  imageUrl?: string;
  slug?: string;
}) {
  const inner = (
    <div
      className={`group relative bg-white rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.22)] shadow-[0_6px_24px_rgba(0,0,0,0.14)] ${
        tall ? "row-span-2" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${tall ? "aspect-[3/4]" : "aspect-square"}`}
        style={{ backgroundColor: bg }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Shirt size={44} className="text-gray-300" />
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* "Voir →" CTA */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-white text-black text-[11px] font-black tracking-wider uppercase px-5 py-2 rounded-full shadow-lg">
            Voir →
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-3.5 pb-4">
        <div className="inline-flex items-center bg-brand-blue-light/60 text-brand-blue-dark text-[9px] font-black tracking-[2px] uppercase px-2.5 py-1 rounded-full mb-2">
          {brand}
        </div>
        <div className="text-[13px] font-bold leading-snug line-clamp-2 text-gray-900">
          {name}
        </div>
        <div className="text-[15px] font-black text-brand-orange mt-2 tracking-tight">
          {price}
        </div>
      </div>
    </div>
  );

  if (slug) {
    return <Link href={`/products/${slug}`}>{inner}</Link>;
  }
  return inner;
}

function PromoCard({
  Icon,
  value,
  desc,
}: {
  Icon: LucideIcon;
  value: string;
  desc: string;
}) {
  return (
    <div className="bg-white/10 border border-white/15 rounded-md p-5 backdrop-blur-sm">
      <div className="mb-2.5 text-white"><Icon size={22} /></div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-xs text-white/65 mt-0.5">{desc}</div>
    </div>
  );
}
