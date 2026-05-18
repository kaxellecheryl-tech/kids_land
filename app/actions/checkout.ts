"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/wave";
import { generateOrderNumber } from "@/lib/utils";
import { incrementCouponUsage } from "./coupon";

export type CheckoutItem = {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  size?: string;
  color?: string;
  unitPrice: number;
  quantity: number;
};

export type CheckoutInput = {
  items: CheckoutItem[];
  shipping: {
    fullName: string;
    phone: string;
    zone: "abidjan" | "interieur";
    city: string;
    district: string;
    street?: string;
    notes?: string;
  };
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
};

export type CheckoutResult =
  | { ok: true; orderNumber: string; paymentUrl: string }
  | { ok: false; error: string };

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { ok: false, error: "Vous devez être connecté pour passer commande." };

  if (!input.items.length) return { ok: false, error: "Votre panier est vide." };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    // Numéro de commande unique
    const lastOrder = await (prisma as any).order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { orderNumber: true },
    });
    const lastSeq = lastOrder
      ? parseInt((lastOrder.orderNumber as string).split("-")[2] ?? "0", 10)
      : 0;
    const orderNumber = generateOrderNumber(lastSeq + 1);

    // Création de la commande en base (PENDING en attendant le paiement Wave)
    const order = await (prisma as any).order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: "wave",
        shippingFullName: input.shipping.fullName,
        shippingPhone: input.shipping.phone,
        shippingCity: input.shipping.city,
        shippingDistrict: input.shipping.district,
        shippingStreet: input.shipping.street ?? null,
        notes: input.shipping.notes ?? null,
        subtotal: input.subtotal,
        shippingFee: input.shippingFee,
        discount: input.discount ?? 0,
        total: input.total,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            productName: item.name,
            productImage: item.image || null,
            variantLabel:
              [item.size, item.color].filter(Boolean).join(" / ") || null,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.unitPrice * item.quantity,
          })),
        },
      },
    });

    // Création de la session Wave
    const session = await createCheckoutSession({
      amount: input.total,
      successUrl: `${appUrl}/checkout/success?order=${orderNumber}`,
      errorUrl: `${appUrl}/checkout?error=payment_failed`,
      // clientReference = order.id pour identifier la commande dans le webhook
      clientReference: order.id,
    });

    if (input.couponCode) {
      await incrementCouponUsage(input.couponCode).catch(() => {});
    }

    return { ok: true, orderNumber, paymentUrl: session.wave_launch_url };
  } catch (err) {
    console.error("createOrder error:", err);
    const msg = err instanceof Error ? err.message : "Erreur inconnue";
    return {
      ok: false,
      error: msg.includes("WAVE_API_KEY")
        ? "Le paiement Wave n'est pas encore configuré. Contactez-nous."
        : "Une erreur est survenue. Réessayez dans un instant.",
    };
  }
}
