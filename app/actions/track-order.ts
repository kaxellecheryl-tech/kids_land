"use server";

import { prisma } from "@/lib/prisma";

export type OrderTracking = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingStreet: string | null;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  items: {
    id: string;
    productName: string;
    productImage: string | null;
    variantLabel: string | null;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
};

export type TrackResult =
  | { ok: true; order: OrderTracking }
  | { ok: false; error: string };

export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<TrackResult> {
  const num = orderNumber.trim().toUpperCase();
  const tel = phone.trim().replace(/\s+/g, "");

  if (!num || !tel) {
    return { ok: false, error: "Veuillez remplir tous les champs." };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: num },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            productImage: true,
            variantLabel: true,
            unitPrice: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
    });

    if (!order) {
      return { ok: false, error: "Commande introuvable. Vérifiez votre numéro de commande." };
    }

    const phoneMatch =
      order.shippingPhone.replace(/\s+/g, "") === tel ||
      (order.guestPhone && order.guestPhone.replace(/\s+/g, "") === tel);

    if (!phoneMatch) {
      return { ok: false, error: "Le numéro de téléphone ne correspond pas à cette commande." };
    }

    return {
      ok: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toISOString(),
        shippingFullName: order.shippingFullName,
        shippingPhone: order.shippingPhone,
        shippingCity: order.shippingCity,
        shippingDistrict: order.shippingDistrict,
        shippingStreet: order.shippingStreet,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        total: order.total,
        items: order.items,
      },
    };
  } catch {
    return { ok: false, error: "Une erreur est survenue. Réessayez dans un instant." };
  }
}
