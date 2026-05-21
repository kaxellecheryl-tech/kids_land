import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendForgottenWishlistEmail } from "@/lib/brevo";
import type { WishlistItem } from "@/lib/wishlist-store";

// Envoie un rappel si la wishlist n'a pas bougé depuis 7 jours
const REMINDER_AFTER_DAYS = 7;
// Ne pas renvoyer avant 30 jours après le dernier rappel
const COOLDOWN_DAYS = 30;

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const reminderThreshold = new Date(now.getTime() - REMINDER_AFTER_DAYS * 24 * 60 * 60 * 1000);
  const cooldown = new Date(now.getTime() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000);

  const wishlists = await (prisma as any).wishlist.findMany({
    where: {
      updatedAt: { lte: reminderThreshold },
      OR: [
        { reminderEmailSentAt: null },
        { reminderEmailSentAt: { lte: cooldown } },
      ],
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

    try {
      await sendForgottenWishlistEmail(
        { email, name },
        items.map((i) => ({
          name: i.name,
          slug: i.slug,
          image: i.image ?? null,
          basePrice: i.basePrice,
          comparePrice: i.comparePrice ?? null,
        }))
      );

      await (prisma as any).wishlist.update({
        where: { id: wishlist.id },
        data: { reminderEmailSentAt: now },
      });

      sent++;
    } catch (err) {
      console.error(`[WishlistReminder] Erreur email pour ${email}:`, err);
    }
  }

  return NextResponse.json({ checked: wishlists.length, sent });
}
