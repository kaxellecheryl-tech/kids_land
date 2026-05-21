"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { WishlistItem } from "@/lib/wishlist-store";

export async function syncWishlist(items: WishlistItem[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (items.length === 0) {
    await (prisma as any).wishlist.deleteMany({ where: { userId: user.id } });
    return;
  }

  await (prisma as any).wishlist.upsert({
    where: { userId: user.id },
    update: { items: items as any },
    create: { userId: user.id, items: items as any },
  });
}
