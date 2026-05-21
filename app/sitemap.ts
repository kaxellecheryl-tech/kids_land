import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.kidsland.africa";

function url(path: string, lastModified?: Date): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques prioritaires
  const staticRoutes: MetadataRoute.Sitemap = [
    { ...url("/"), changeFrequency: "daily", priority: 1.0 },
    { ...url("/products"), changeFrequency: "daily", priority: 0.9 },
    { ...url("/brands"), changeFrequency: "weekly", priority: 0.8 },
    { ...url("/about"), changeFrequency: "monthly", priority: 0.6 },
    { ...url("/about/values"), changeFrequency: "monthly", priority: 0.5 },
    { ...url("/contact"), changeFrequency: "monthly", priority: 0.6 },
    { ...url("/careers"), changeFrequency: "weekly", priority: 0.5 },
    { ...url("/press"), changeFrequency: "monthly", priority: 0.4 },
    { ...url("/help/faq"), changeFrequency: "monthly", priority: 0.6 },
    { ...url("/help/shipping"), changeFrequency: "monthly", priority: 0.6 },
    { ...url("/help/returns"), changeFrequency: "monthly", priority: 0.6 },
    { ...url("/legal/cgv"), changeFrequency: "yearly", priority: 0.3 },
    { ...url("/legal/mentions-legales"), changeFrequency: "yearly", priority: 0.3 },
    { ...url("/legal/confidentialite"), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Produits actifs
  const products = await (prisma as any).product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const productRoutes: MetadataRoute.Sitemap = products.map(
    (p: { slug: string; updatedAt: Date }) => ({
      url: `${BASE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  // Marques
  const brands = await (prisma as any).brand.findMany({
    select: { slug: true },
  });

  const brandRoutes: MetadataRoute.Sitemap = brands.map(
    (b: { slug: string }) => ({
      url: `${BASE_URL}/brands/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...productRoutes, ...brandRoutes];
}
