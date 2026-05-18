// Seed la DB avec quelques produits de test pour développer.
// Lancer avec: npx prisma db seed

import "dotenv/config";
import { PrismaClient, Gender } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrismaClientCtor = PrismaClient as new (opts: any) => PrismaClient;
const prisma = new PrismaClientCtor({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("🌱 Seed start...");

  // ─── Brands ───
  const babybol = await prisma.brand.upsert({
    where: { slug: "babybol" },
    update: {},
    create: { slug: "babybol", name: "Babybol" },
  });


  // ─── Categories ───
  const robes = await prisma.category.upsert({
    where: { slug: "robes-jupes" },
    update: {},
    create: { slug: "robes-jupes", name: "Robes & Jupes", position: 1 },
  });
  const pantalons = await prisma.category.upsert({
    where: { slug: "pantalons" },
    update: {},
    create: { slug: "pantalons", name: "Pantalons", position: 2 },
  });
  const chaussures = await prisma.category.upsert({
    where: { slug: "chaussures" },
    update: {},
    create: { slug: "chaussures", name: "Chaussures", position: 3 },
  });
  const bebe = await prisma.category.upsert({
    where: { slug: "bebe" },
    update: {},
    create: { slug: "bebe", name: "Bébé 0–24m", position: 4 },
  });
  const accessoires = await prisma.category.upsert({
    where: { slug: "accessoires" },
    update: {},
    create: { slug: "accessoires", name: "Accessoires", position: 5 },
  });
  const ensembles = await prisma.category.upsert({
    where: { slug: "ensembles" },
    update: {},
    create: { slug: "ensembles", name: "Ensembles", position: 6 },
  });
  const short = await prisma.category.upsert({
    where: { slug: "shorts" },
    update: {},
    create: { slug: "shorts", name: "Shorts", position: 7 },
  });


  // ─── Products ───
  type ProductSeed = {
    slug: string; name: string; description: string;
    categoryId: string; brandId: string; basePrice: number;
    gender: Gender; isFeatured: boolean;
    sizes: string[];
    imageExt?: "png" | "jpeg" | "jpg" | "webp";
    imageFile?: string; // override le nom de fichier quand il diffère du slug
  };
  const products: ProductSeed[] = [
    {
      slug: "bavoir_etoile",
      name: "Bavoir Étoile",
      description: "Bavoir en coton, motif étoile, idéale pour les bébés.",
      categoryId: bebe.id,
      brandId: babybol.id,
      basePrice: 2500,
      gender: Gender.UNISEX,
      isFeatured: true,
      sizes: ["1 mois", "3 mois"],
    },
    {
      slug: "bavoir_maguerite",
      name: "Bavoir Marguerite",
      description: "Bavoir en coton, motif marguerite, idéale pour les bébés.",
      categoryId: bebe.id,
      brandId: babybol.id,
      basePrice: 2500,
      gender: Gender.UNISEX,
      isFeatured: true,
      imageExt: "png",
      sizes: ["1 mois"],
    },
    {
      slug: "bonnet_bebe",
      name: "Bonnet Bébé",
      description: "Bonnet en coton, idéale pour les bébés.",
      categoryId: bebe.id,
      brandId: babybol.id,
      basePrice: 2500,
      gender: Gender.UNISEX,
      isFeatured: true,
      sizes: ["3 mois"],
    },
    {
      slug: "bonnet_naissance",
      name: "Bonnet de Naissance",
      description: "Bonnet en velour, idéale pour les nouveau-nés.",
      categoryId: bebe.id,
      brandId: babybol.id,
      basePrice: 2500,
      gender: Gender.UNISEX,
      isFeatured: true,
      sizes: ["0 mois"],
    },
    {
      slug: "ensemble_dont_growup",
      name: "Ensemble Don't Grow Up",
      description: "Ensemble composé d'un t-shirt à volant, un short en jersey et un bandeau pour cheveux assorti.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 8500,
      gender: Gender.GIRL,
      isFeatured: true,
      imageExt: "jpg",
      sizes: ["9 mois"],
    },
    {
      slug: "ensemble_explore",
      name: "Ensemble Explore",
      description: "Ensemble composé d'un t-shirt à manches courtes, un sweat à capuche à manches courtes et un short.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 10000,
      gender: Gender.BOY,
      isFeatured: true,
      sizes: ["12 mois", "9 mois"],
    },
    {
      slug: "ensemble_flower",
      name: "Ensemble Flowers",
      description: "Ensemble composé d'un sweat avec des patchs de poche en forme de coeurs d'amour et d'un pantalon imprimé de pétales de fleurs.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 8500,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["9 mois", "12 mois"],
    },
    {
      slug: "ensemble_grown",
      name: "Ensemble Grown",
      description: "Ensemble composé d'un t-shirt blanc à manches courtes et d'un short noir assorti.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 10000,
      gender: Gender.BOY,
      isFeatured: true,
      sizes: ["8 ans"],
    },
    {
      slug: "ensemble_hello",
      name: "Ensemble Hello",
      description: "Ensemble composé d'un t-shirt à manches courtes avec un motif d'ours sur le devant et d'un short bleu assorti.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 7500,
      gender: Gender.UNISEX,
      isFeatured: true,
      imageExt: "jpg",
      sizes: ["6 mois", "9 mois", "24 mois / 2 ans"],
    },
    {
      slug: "ensemble_lino",
      name: "Ensemble Lino",
      description: "Ensemble composé d'une chemise à manches courtes en mousseline beige et d'un short assorti en mousseline marron.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 10000,
      gender: Gender.BOY,
      isFeatured: true,
      sizes: ["3 ans", "4 ans"],
    },
    {
      slug: "ensemble_little_king",
      name: "Ensemble Little King",
      description: "Ensemble composé d'une salopette à bretelles et boutons-pression assortie à un t-shirt à manches courtes à rayures beige et marron.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 7500,
      gender: Gender.BOY,
      isFeatured: true,
      imageExt: "jpg",
      sizes: ["3 mois", "6 mois", "12 mois"],
    },
    {
      slug: "ensemble_robe_blanche",
      name: "Ensemble Robe Blanche",
      description: "Ensemble composé d'une robe blanche à bretelles et d'une culotte assortie.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 8500,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["24 mois / 2 ans"],
    },
    {
      slug: "ensemble_robe_coquillage",
      name: "Ensemble Robe Coquillage",
      description: "Ensemble composé d'une robe à manches courtes, imprimés et fermeture à crochet dans le dos avec bandeau pour cheveux et culotte assortie.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 7500,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["6 mois", "18 mois / 1 an"],
    },
    {
      slug: "ensemble_robe_rose",
      name: "Ensemble Robe Rose",
      description: "Ensemble composé d'une robe volante à manches courtes et d'un bandeau pour cheveux assorti.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 7500,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["7 ans"],
    },
    {
      slug: "ensemble_sweet_bunny",
      name: "Ensemble Sweet Bunny",
      description: "Ensemble composé d'un t-shirt imprimé à manchees courtes et d'une salopette rose assortie.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 8500,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["3 mois", "6 mois", "9 mois", "24 mois / 2 ans"],
    },
    {
      slug: "ensemble_wildlife",
      name: "Ensemble Wild Life",
      description: "Ensemble composé d'un t-shirt à manches courtes, un collant noir et d'un bandeau pour cheveux assorti.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 9000,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["8 ans", "12 ans"],
    },
    {
      slug: "ensemble_with_love",
      name: "Ensemble With Love",
      description: "Ensemble composé d'un débardeur imprimé, d'une culotte rose et d'un bandeau pour cheveux assorti.",
      categoryId: ensembles.id,
      brandId: babybol.id,
      basePrice: 7500,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["3 mois"],
    },
    {
      slug: "robe_blanche",
      name: "Robe Blanche",
      description: "Robe blanche volante à bretelles et dos croisé.",
      categoryId: robes.id,
      brandId: babybol.id,
      basePrice: 8500,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["8 ans"],
    },
    {
      slug: "robe_multicolore",
      name: "Robe Multicolore",
      description: "Robe volante à bretelles et bandeau pour cheveux assorti, imprimé multicolore.",
      categoryId: robes.id,
      brandId: babybol.id,
      basePrice: 8500,
      gender: Gender.GIRL,
      isFeatured: true,
      sizes: ["8 ans"],
    },
    {
      slug: "short_happy_baby_boy",
      name: "Short Happy Baby Boy",
      description: "Short basique bleu nuit en coton, idéal pour les garçons.",
      categoryId: short.id,
      brandId: babybol.id,
      basePrice: 4500,
      gender: Gender.BOY,
      isFeatured: true,
      sizes: ["5 ans"],
    },
  ];

  const STORAGE_URL = "https://qytgdrctqgpmmxzppehk.supabase.co/storage/v1/object/public/products";

  // Supprime les anciennes images pour forcer la recréation avec la bonne extension
  await prisma.productImage.deleteMany({});

  for (const data of products) {
    const { sizes, imageExt = "png", imageFile, ...productData } = data;
    const imageUrl = `${STORAGE_URL}/${imageFile ?? productData.slug}.${imageExt}`;

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        variants: {
          create: sizes.map((size, idx) => ({
            size,
            sku: `${productData.slug}-${idx}`,
            stock: 10,
          })),
        },
        images: {
          create: [{ url: imageUrl, position: 0 }],
        },
      },
    });

    // Ajoute l'image si le produit existait déjà sans image
    const hasImage = await prisma.productImage.findFirst({ where: { productId: product.id } });
    if (!hasImage) {
      await prisma.productImage.create({
        data: { productId: product.id, url: imageUrl, position: 0 },
      });
    }

    console.log(`✓ ${product.name}`);
  }

  // ─── Shipping zones ───
  await prisma.shippingZone.upsert({
    where: { id: "abidjan" },
    update: {},
    create: {
      id: "abidjan",
      name: "Abidjan",
      fee: 2000,
      cities: ["Abidjan", "Cocody", "Yopougon", "Marcory", "Treichville", "Plateau", "Adjamé", "Abobo", "Port-Bouët", "Koumassi", "Bingerville"],
    },
  });
  await prisma.shippingZone.upsert({
    where: { id: "interieur" },
    update: {},
    create: {
      id: "interieur",
      name: "Intérieur",
      fee: 3500,
      cities: ["Bouaké", "Yamoussoukro", "Daloa", "Korhogo", "San-Pédro", "Man", "Gagnoa"],
    },
  });

  // ─── Coupons ───
  await prisma.coupon.upsert({
    where: { code: "KIDS15" },
    update: {},
    create: {
      code: "KIDS15",
      description: "−15% sur la première commande",
      discountType: "PERCENTAGE",
      discountValue: 15,
      maxUses: 1000,
    },
  });

  console.log("✅ Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
