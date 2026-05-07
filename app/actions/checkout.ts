"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/paydunya";
import { generateOrderNumber } from "@/lib/utils";

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
  total: number;
  paymentMethod: string;
};

export type CheckoutResult =
  | { ok: true; orderNumber: string; paymentUrl: string }
  | { ok: false; error: string };

export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Vous devez être connecté pour passer commande." };

  if (!input.items.length) return { ok: false, error: "Votre panier est vide." };

  try {
    // Génère un numéro de commande unique
    const lastOrder = await (prisma as any).order.findFirst({
      orderBy: { createdAt: "desc" },
      select: { orderNumber: true },
    });
    const lastSeq = lastOrder
      ? parseInt((lastOrder.orderNumber as string).split("-")[2] ?? "0", 10)
      : 0;
    const orderNumber = generateOrderNumber(lastSeq + 1);

    // Crée la commande en base
    const order = await (prisma as any).order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: input.paymentMethod,
        shippingFullName: input.shipping.fullName,
        shippingPhone: input.shipping.phone,
        shippingCity: input.shipping.city,
        shippingDistrict: input.shipping.district,
        shippingStreet: input.shipping.street ?? null,
        notes: input.shipping.notes ?? null,
        subtotal: input.subtotal,
        shippingFee: input.shippingFee,
        discount: 0,
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Tente de créer une facture PayDunya
    try {
      const invoice = await createInvoice({
        total_amount: input.total,
        description: `Commande Kids Land ${orderNumber}`,
        return_url: `${appUrl}/checkout/success?order=${orderNumber}`,
        cancel_url: `${appUrl}/checkout`,
        callback_url: `${appUrl}/api/paydunya/webhook`,
        custom_data: { order_id: order.id, order_number: orderNumber },
        items: input.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.unitPrice * item.quantity,
        })),
      });

      if (invoice.response_code === "00" && invoice.invoice_url) {
        return { ok: true, orderNumber, paymentUrl: invoice.invoice_url };
      }
    } catch {
      // PayDunya non configuré ou erreur réseau → fallback vers page de succès
    }

    // Fallback : rediriger vers la page de succès sans paiement externe
    return {
      ok: true,
      orderNumber,
      paymentUrl: `${appUrl}/checkout/success?order=${orderNumber}`,
    };
  } catch (err) {
    console.error("createOrder error:", err);
    return { ok: false, error: "Une erreur est survenue. Réessayez dans un instant." };
  }
}
