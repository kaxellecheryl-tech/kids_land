import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLowStockWishlistEmail } from "@/lib/brevo";
import type { WishlistItem } from "@/lib/wishlist-store";

const LOW_STOCK_THRESHOLD = 5;

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Cooldown 24h : ne pas renvoyer un email low-stock si déjà envoyé récemment
  const cooldown = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const wishlists = await (prisma as any).wishlist.findMany({
    where: {
      OR: [{ lowStockEmailSentAt: null }, { lowStockEmailSentAt: { lte: cooldown } }],
    },
    include: {
      user: { select: { email: true, fullName: true, marketingConsent: true } },
    },
  });

  let sent = 0;

  for (const wishlist of wishlists) {
    const email = wishlist.user?.email;
    const name = wishlist.user?.fullName ?? "cher client";
    if (!email || !wishlist.user?.marketingConsent) continue;

    const items = wishlist.items as WishlistItem[];
    if (!items?.length) continue;

    const productIds = items.map((i) => i.productId);

    // Récupère le stock total par produit (somme de tous les variants)
    const stockByProduct = await (prisma as any).productVariant.groupBy({
      by: ["productId"],
      where: { productId: { in: productIds } },
      _sum: { stock: true },
    });

    const lowStockProductIds = new Set(
      stockByProduct
        .filter((p: { _sum: { stock: number | null } }) => (p._sum.stock ?? 0) <= LOW_STOCK_THRESHOLD && (p._sum.stock ?? 0) > 0)
        .map((p: { productId: string }) => p.productId)
    );

    if (lowStockProductIds.size === 0) continue;

    const lowStockItems = items
      .filter((i) => lowStockProductIds.has(i.productId))
      .map((i) => {
        const stockEntry = stockByProduct.find((p: { productId: string }) => p.productId === i.productId);
        return {
          name: i.name,
          slug: i.slug,
          image: i.image ?? null,
          basePrice: i.basePrice,
          totalStock: stockEntry?._sum?.stock ?? 1,
        };
      });

    try {
      await sendLowStockWishlistEmail({ email, name }, lowStockItems);
      await (prisma as any).wishlist.update({
        where: { id: wishlist.id },
        data: { lowStockEmailSentAt: now },
      });
      sent++;
    } catch (err) {
      console.error(`[WishlistLowStock] Erreur email pour ${email}:`, err);
    }
  }

  return NextResponse.json({ checked: wishlists.length, sent });
}
