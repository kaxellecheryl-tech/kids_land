import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Wave envoie des events via POST sur cette URL.
// Configurer cette URL dans le dashboard Wave → Settings → Webhooks.
//
// Validation de signature : Wave inclut un header "Wave-Signature".
// Pour l'activer, vérifier HMAC-SHA256(rawBody, WAVE_WEBHOOK_SECRET).
// Pas encore activée ici — à faire en production avec WAVE_WEBHOOK_SECRET.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
    // Renvoyer 200 pour éviter que Wave ne réessaie indéfiniment
    return NextResponse.json({ received: true });
  }
}
