// Wave CI — Checkout API
// Docs : https://docs.wave.com/api

const WAVE_API_BASE = "https://api.wave.com/v1";

export type WaveCheckoutSession = {
  id: string;
  wave_launch_url: string;
  checkout_status: "pending" | "complete" | "expired";
  last_payment_status: "succeeded" | "cancelled" | "failed" | null;
  amount: string;
  currency: string;
  client_reference?: string | null;
  when_created: string;
  when_expires: string;
};

/**
 * Crée une session de paiement Wave.
 * Renvoie l'URL vers laquelle rediriger le client.
 */
export async function createCheckoutSession(params: {
  amount: number;        // montant en F CFA (entier)
  successUrl: string;
  errorUrl: string;
  clientReference?: string; // ID interne (orderId) pour le webhook
}): Promise<WaveCheckoutSession> {
  const apiKey = process.env.WAVE_API_KEY;
  if (!apiKey) throw new Error("WAVE_API_KEY non configurée");

  const res = await fetch(`${WAVE_API_BASE}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(params.amount),
      currency: "XOF",
      success_url: params.successUrl,
      error_url: params.errorUrl,
      client_reference: params.clientReference,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Wave API ${res.status}: ${text}`);
  }

  return res.json();
}
