"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CouponValidation =
  | { ok: true; code: string; discountType: string; discountValue: number; discountAmount: number; label: string }
  | { ok: false; error: string };

export type CouponInput = {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: number;
  minSubtotal?: number;
  maxUses?: number;
  startsAt?: string;   // ISO date string
  expiresAt?: string;  // ISO date string
  isActive: boolean;
};

// ── Guard admin ────────────────────────────────────────────────────────────────

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");
  const dbUser = await (prisma as any).user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("Accès refusé");
}

// ── Public ────────────────────────────────────────────────────────────────────

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidation> {
  if (!code.trim()) return { ok: false, error: "Entrez un code promo." };

  const coupon = await (prisma as any).coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  const now = new Date();

  if (!coupon)                             return { ok: false, error: "Code promo invalide." };
  if (!coupon.isActive)                    return { ok: false, error: "Ce code n'est plus actif." };
  if (coupon.startsAt  && coupon.startsAt  > now) return { ok: false, error: "Ce code n'est pas encore valide." };
  if (coupon.expiresAt && coupon.expiresAt < now) return { ok: false, error: "Ce code promo est expiré." };
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
    return { ok: false, error: "Ce code a atteint sa limite d'utilisation." };
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal)
    return { ok: false, error: `Sous-total minimum requis : ${coupon.minSubtotal} F.` };

  let discountAmount = 0;
  let label = "";

  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = Math.round(subtotal * coupon.discountValue / 100);
    label = `−${coupon.discountValue}%`;
  } else if (coupon.discountType === "FIXED_AMOUNT") {
    discountAmount = Math.min(coupon.discountValue, subtotal);
    label = `−${coupon.discountValue} F`;
  } else if (coupon.discountType === "FREE_SHIPPING") {
    discountAmount = 0;
    label = "Livraison offerte";
  }

  return {
    ok: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    label,
  };
}

export async function getActiveFeaturedCoupon() {
  try {
    const now = new Date();
    return await (prisma as any).coupon.findFirst({
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] }],
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return null;
  }
}

export async function incrementCouponUsage(code: string) {
  await (prisma as any).coupon.update({
    where: { code },
    data: { usedCount: { increment: 1 } },
  });
}

// ── Admin CRUD ─────────────────────────────────────────────────────────────────

export async function createCoupon(
  data: CouponInput
): Promise<{ error?: string; id?: string }> {
  try {
    await assertAdmin();
    const coupon = await (prisma as any).coupon.create({
      data: {
        code: data.code.trim().toUpperCase(),
        description: data.description || null,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minSubtotal: data.minSubtotal || null,
        maxUses: data.maxUses || null,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/coupons");
    return { id: coupon.id };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la création" };
  }
}

export async function updateCoupon(
  id: string,
  data: CouponInput
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).coupon.update({
      where: { id },
      data: {
        code: data.code.trim().toUpperCase(),
        description: data.description || null,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minSubtotal: data.minSubtotal || null,
        maxUses: data.maxUses || null,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/coupons");
    revalidatePath(`/admin/coupons/${id}`);
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la mise à jour" };
  }
}

export async function deleteCoupon(id: string): Promise<{ error?: string }> {
  try {
    await assertAdmin();
    await (prisma as any).coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
    return {};
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la suppression" };
  }
}
