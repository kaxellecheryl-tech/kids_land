"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  brand: { name: string } | null;
  images: { url: string }[];
};

export async function searchProducts(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { brand: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    take: 8,
    include: {
      brand: true,
      images: { take: 1, orderBy: { position: "asc" } },
    },
  });
}
