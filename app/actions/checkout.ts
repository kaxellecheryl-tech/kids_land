"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { incrementCouponUsage } from "./coupon";
import { clearCart } from "./cart-sync";

const WHATSAPP_NUMBER = "2250777063646";

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("225")) return digits;
  if (digits.startsWith("0")) return "225" + digits.slice(1);
  return "225" + digits;
}

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
  | { ok: true; orderNumber: string; whatsappUrl: string }
  | { ok: false; error: string };

function buildWhatsAppUrl(orderNumber: string, input: CheckoutInput): string {
  const lines: string[] = [
    `Bonjour Kids Land 👋`,
    `Nouvelle commande *${orderNumber}*`,
    ``,
    `🛍️ Articles :`,
    ...input.items.map((item) => {
      const variant = [item.size, item.color].filter(Boolean).join(" / ");
      const label = variant ? `${item.name} — ${variant}` : item.name;
      return `• ${label} (×${item.quantity}) — ${(item.unitPrice * item.quantity).toLocaleString("fr-FR")} F`;
    }),
    ``,
    `📦 Livraison : ${input.shipping.fullName}`,
    `📍 ${input.shipping.district}, ${input.shipping.city}`,
    `📞 ${input.shipping.phone} (WhatsApp : wa.me/${formatPhone(input.shipping.phone)})`,
  ];

  if (input.shipping.street) lines.push(`🏠 ${input.shipping.street}`);
  if (input.shipping.notes) lines.push(`📝 ${input.shipping.notes}`);

  lines.push(``);
  if (input.shippingFee > 0) {
    lines.push(`Sous-total : ${input.subtotal.toLocaleString("fr-FR")} F`);
    lines.push(`Livraison : ${input.shippingFee.toLocaleString("fr-FR")} F`);
  }
  if (input.discount > 0) {
    lines.push(`Réduction : -${input.discount.toLocaleString("fr-FR")} F`);
  }
  lines.push(`💰 *Total à payer : ${input.total.toLocaleString("fr-FR")} F CFA*`);
  lines.push(``);
  lines.push(`Je souhaite finaliser mon paiement.`);

  const message = lines.join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { ok: false, error: "Vous devez être connecté pour passer commande." };

  if (!input.items.length) return { ok: false, error: "Votre panier est vide." };

  try {
    const lastOrder = await (prisma as any).order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { orderNumber: true },
    });
    const lastSeq = lastOrder
      ? parseInt((lastOrder.orderNumber as string).split("-")[2] ?? "0", 10)
      : 0;
    const orderNumber = generateOrderNumber(lastSeq + 1);

    await (prisma as any).order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: "PENDING",
        paymentStatus: "PENDING",
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

    if (input.couponCode) {
      await incrementCouponUsage(input.couponCode).catch(() => {});
    }

    await clearCart().catch(() => {});

    const whatsappUrl = buildWhatsAppUrl(orderNumber, input);
    return { ok: true, orderNumber, whatsappUrl };
  } catch (err) {
    console.error("createOrder error:", err);
    return { ok: false, error: "Une erreur est survenue. Réessayez dans un instant." };
  }
}
