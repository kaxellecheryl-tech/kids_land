import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

async function verifySignature(rawBody: string, req: NextRequest): Promise<boolean> {
  const secret = process.env.WAVE_WEBHOOK_SECRET;
  if (!secret) return true;
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
        await (prisma as any).order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "PAID",
            status: "PAID",
            paymentRef: data.id,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Wave webhook error:", err);
    return NextResponse.json({ received: true });
  }
}
