"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/lib/cart-store";

export async function syncCart(items: CartItem[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (items.length === 0) {
    await (prisma as any).cart.deleteMany({ where: { userId: user.id } });
    return;
  }

  await (prisma as any).cart.upsert({
    where: { userId: user.id },
    update: {
      items: items as any,
      emailSentAt: null, // reset pour permettre un nouvel email si abandon suivant
    },
    create: {
      userId: user.id,
      items: items as any,
    },
  });
}

export async function clearCart() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await (prisma as any).cart.deleteMany({ where: { userId: user.id } });
}
