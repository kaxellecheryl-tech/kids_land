import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAbandonedCartEmail } from "@/lib/brevo";
import type { CartItem } from "@/lib/cart-store";

// Vercel Cron envoie Authorization: Bearer <CRON_SECRET>
function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Cron quotidien : paniers abandonnés entre 3h et 72h, email pas encore envoyé
  const from = new Date(now.getTime() - 72 * 60 * 60 * 1000);
  const to = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  const carts = await (prisma as any).cart.findMany({
    where: {
      updatedAt: { gte: from, lte: to },
      emailSentAt: null,
    },
    include: {
      user: { select: { email: true, fullName: true, marketingConsent: true } },
    },
  });

  let sent = 0;

  for (const cart of carts) {
    const email = cart.user?.email;
    const name = cart.user?.fullName ?? "cher client";
    if (!email || !cart.user?.marketingConsent) continue;

    const items = cart.items as CartItem[];
    if (!items?.length) continue;

    const subtotal = items.reduce(
      (sum: number, item: CartItem) => sum + item.unitPrice * item.quantity,
      0
    );

    try {
      await sendAbandonedCartEmail(
        { email, name },
        items.map((item) => ({
          productName: item.name,
          variantLabel: [item.size, item.color].filter(Boolean).join(" / ") || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          productImage: item.image ?? null,
        })),
        subtotal
      );

      await (prisma as any).cart.update({
        where: { id: cart.id },
        data: { emailSentAt: now },
      });

      sent++;
    } catch (err) {
      console.error(`[AbandonedCart] Erreur email pour ${email}:`, err);
    }
  }

  return NextResponse.json({ checked: carts.length, sent });
}
