import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Shirt, Baby, Backpack, Sparkles, Footprints,
  Truck, ShieldCheck, RotateCcw, MessageCircle, Star,
  type LucideIcon,
} from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

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

async function getAllProducts(): Promise<{ hero: ProductCardData[]; featured: ProductCardData[] }> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 11,
      include: {
        brand: true,
        images: { take: 1, orderBy: { position: "asc" } },
      },
    });

    if (rows.length === 0) return { hero: MOCK_PRODUCTS.slice(0, 3), featured: MOCK_PRODUCTS };

    const mapped = rows.map((p: typeof rows[number]) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand?.name ?? "Kids Land",
      basePrice: p.basePrice,
      comparePrice: p.comparePrice,
      imageUrl: p.images[0]?.url ?? "",
      imageBg: "#F6E5E5",
    }));

    return { hero: mapped.slice(0, 3), featured: mapped.slice(3) };
  } catch {
    return { hero: MOCK_PRODUCTS.slice(0, 3), featured: MOCK_PRODUCTS };
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

async function getCategories() {
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

const BRANDS: { name: string; slug: string }[] = [
  { name: "Babybol",      slug: "babybol" },
  { name: "Primark Kids", slug: "primark-kids" },
  { name: "H&M Kids",     slug: "hm-kids" },
  { name: "Zara Mini",    slug: "zara-mini" },
  { name: "George",       slug: "george" },
];

const FEATURES: { Icon: LucideIcon; title: string; desc: string; bg: string }[] = [
  {
    Icon: Truck,
    title: "Livraison rapide",
    desc: "Recevez vos commandes en 24 à 48h partout en Côte d'Ivoire et dans la sous-région.",
    bg: "#99C5FF",
  },
  {
    Icon: ShieldCheck,
    title: "Authenticité garantie",
    desc: "Tous nos articles proviennent directement des marques officielles. Zéro contrefaçon.",
    bg: "#d8f5c0",
  },
  {
    Icon: RotateCcw,
    title: "Retours gratuits",
    desc: "30 jours pour changer d'avis. Le retour est simple, rapide et entièrement gratuit.",
    bg: "#fff3bb",
  },
  {
    Icon: MessageCircle,
    title: "Support 7j/7",
    desc: "Notre équipe est disponible via WhatsApp, email et téléphone pour vous accompagner.",
    bg: "#F6E5E5",
  },
];

export default async function HomePage() {
  const [{ hero, featured: products }, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="grid lg:grid-cols-2 min-h-[calc(100vh-68px)]">
        <div className="bg-white border-r-4 border-brand-blue-light flex flex-col justify-center px-12 lg:px-16 py-20">
          <span className="inline-flex items-center gap-2 bg-brand-blue-light text-brand-blue-dark text-[11px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full w-fit mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            Nouvelle collection printemps
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.0] tracking-tight mb-6">
            Style
            <br />
            <span className="text-brand-green">Kids</span>,<br />
            <span className="text-brand-orange">Premium</span>.
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-md mb-12">
            Les meilleures marques enfants — Primark Kids, H&amp;M Kids, Zara Mini —
            sélectionnées pour leur qualité et leur style. Livraison rapide partout
            en Côte d&apos;Ivoire.
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
              { val: "500+", label: "Références" },
              { val: "12+", label: "Marques" },
              { val: "48h", label: "Livraison" },
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
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-brand-yellow opacity-25" />
          <div className="absolute -bottom-12 -left-12 w-[300px] h-[300px] rounded-full bg-brand-pink opacity-25" />
          <div className="relative z-10 grid grid-cols-2 gap-4 p-10 max-w-[500px] w-full">
            <ShowcaseCard
              brand={hero[0]?.brand ?? "Babybol"}
              name={hero[0]?.name ?? "Robe fleurie été"}
              price={formatPrice(hero[0]?.basePrice ?? 8900)}
              imageUrl={hero[0]?.imageUrl}
              bg="#F6E5E5"
              tall
            />
            <ShowcaseCard
              brand={hero[1]?.brand ?? "Babybol"}
              name={hero[1]?.name ?? "Ensemble"}
              price={formatPrice(hero[1]?.basePrice ?? 7500)}
              imageUrl={hero[1]?.imageUrl}
              bg="#dce9ff"
            />
            <ShowcaseCard
              brand={hero[2]?.brand ?? "Babybol"}
              name={hero[2]?.name ?? "Ensemble"}
              price={formatPrice(hero[2]?.basePrice ?? 8500)}
              imageUrl={hero[2]?.imageUrl}
              bg="#fff3bb"
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
                "Primark Kids",
                "H&M Kids",
                "Zara Mini",
                "George",
                "Livraison 48h",
                "Retours gratuits",
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
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="rounded-md p-7 text-center transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: cat.bg }}
            >
              <div className="flex justify-center mb-3"><cat.Icon size={32} /></div>
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
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section className="bg-brand-blue-dark relative overflow-hidden">
        <div className="absolute -top-24 right-24 w-[400px] h-[400px] rounded-full bg-brand-yellow opacity-10" />
        <div className="absolute -bottom-36 left-48 w-[400px] h-[400px] rounded-full bg-brand-pink opacity-10" />
        <div className="container-shop py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 text-white text-[10px] font-bold tracking-[2px] uppercase px-3.5 py-1.5 rounded-full mb-6">
              <Star size={10} className="fill-current" /> Offre spéciale
            </span>
            <h2 className="text-5xl font-bold leading-[1.05] tracking-tight text-white mb-5">
              Soldes
              <br />
              <span className="text-brand-yellow">jusqu&apos;à</span>
              <br />
              <span className="text-brand-green">−50%</span>
            </h2>
            <p className="text-base text-white/70 leading-relaxed mb-9 max-w-md">
              Profitez de nos meilleures offres sur des centaines d&apos;articles de
              grandes marques. Stocks limités — commandez dès maintenant.
            </p>
            <Link
              href="/products?filter=sale"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-[13px] font-bold uppercase tracking-wide hover:-translate-y-0.5 transition-transform"
            >
              Voir les soldes →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <PromoCard Icon={Truck} value="Gratuit" desc="Livraison dès 25 000 F" />
            <PromoCard Icon={RotateCcw} value="30j" desc="Retours offerts" />
            <div className="col-span-2 bg-brand-orange rounded-md flex items-center justify-between p-6">
              <div>
                <div className="text-xl font-bold text-white">Code : KIDS15</div>
                <div className="text-xs text-white/80 mt-1">
                  −15% sur votre première commande
                </div>
              </div>
              <button className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wide hover:-translate-y-0.5 transition-transform">
                Copier
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="container-shop py-20">
        <SectionHeader
          title="Nos marques"
          subtitle="Sélection premium des meilleures marques internationales"
        />
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="bg-[#FDF8F8] border border-gray-100 rounded-sm px-6 py-3.5 text-[13px] font-bold tracking-wide uppercase text-gray-600 hover:bg-brand-blue-dark hover:text-white hover:border-brand-blue-dark transition-colors whitespace-nowrap"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#FDF8F8] py-20">
        <div className="container-shop">
          <SectionHeader title="Pourquoi Kids Land ?" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-md border border-gray-100 p-7"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.Icon size={22} />
                </div>
                <h3 className="text-[14px] font-bold mb-2">{f.title}</h3>
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
              Rejoignez +2 000 parents qui reçoivent nos offres exclusives chaque
              semaine
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
        <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
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
}: {
  brand: string;
  name: string;
  price: string;
  bg: string;
  tall?: boolean;
  imageUrl?: string;
}) {
  return (
    <div
      className={`bg-white rounded-md overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 shadow-card ${
        tall ? "row-span-2" : ""
      }`}
    >
      <div
        className={`relative flex items-center justify-center ${
          tall ? "aspect-[3/4]" : "aspect-square"
        }`}
        style={{ backgroundColor: bg }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="200px"
            className="object-cover"
          />
        ) : (
          <Shirt size={40} className="text-gray-400" />
        )}
      </div>
      <div className="px-3.5 py-3">
        <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-gray-500">
          {brand}
        </div>
        <div className="text-xs font-semibold mb-1.5 leading-snug">{name}</div>
        <div className="text-[13px] font-bold">{price}</div>
      </div>
    </div>
  );
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
