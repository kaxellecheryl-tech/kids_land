import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/brevo";

async function verifySignature(rawBody: string, req: NextRequest): Promise<boolean> {
  const secret = process.env.WAVE_WEBHOOK_SECRET;
  if (!secret) return true; // pas configuré → on laisse passer (à activer en prod)
  const signature = req.headers.get("wave-signature") ?? "";
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return signature === expected;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!(await verifySignature(rawBody, req))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { type, data } = body as {
      type: string;
      data: {
        id: string;
        client_reference?: string | null;
        checkout_status: string;
        last_payment_status: string;
      };
    };

    if (type === "checkout.session.completed") {
      const orderId = data.client_reference;
      if (!orderId) return NextResponse.json({ received: true });

      const paid =
        data.checkout_status === "complete" &&
        data.last_payment_status === "succeeded";

      if (paid) {
        const order = await (prisma as any).order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "PAID",
            paymentRef: data.id,
          },
          include: {
            items: true,
            user: { select: { email: true, fullName: true } },
          },
        });

        const email = order.user?.email ?? order.guestEmail;
        const name = order.user?.fullName ?? order.shippingFullName;
        if (email) {
          await sendOrderConfirmation(
            { email, name },
            {
              orderNumber: order.orderNumber,
              customerName: name,
              items: order.items,
              subtotal: order.subtotal,
              shippingFee: order.shippingFee,
              discount: order.discount,
              total: order.total,
              shippingFullName: order.shippingFullName,
              shippingPhone: order.shippingPhone,
              shippingCity: order.shippingCity,
              shippingDistrict: order.shippingDistrict,
              shippingStreet: order.shippingStreet,
            }
          ).catch((err) => console.error("[Brevo] confirmation email error:", err));
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Wave webhook error:", err);
    // Renvoyer 200 pour éviter que Wave ne réessaie indéfiniment
    return NextResponse.json({ received: true });
  }
}
