// PayDunya — Helper pour création et vérification des paiements
// Doc API : https://paydunya.com/developers/api

const PAYDUNYA_BASE_URL =
  process.env.PAYDUNYA_MODE === "live"
    ? "https://app.paydunya.com/api/v1"
    : "https://app.paydunya.com/sandbox-api/v1";

type PayDunyaInvoice = {
  total_amount: number;
  description: string;
  return_url: string;
  cancel_url: string;
  callback_url: string;
  custom_data?: Record<string, string>;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    description?: string;
  }>;
};

type PayDunyaCreateInvoiceResponse = {
  response_code: string; // "00" = success
  response_text: string;
  description?: string;
  token?: string;
  invoice_url?: string;
};

const headers = () => ({
  "Content-Type": "application/json",
  "PAYDUNYA-MASTER-KEY": process.env.PAYDUNYA_MASTER_KEY ?? "",
  "PAYDUNYA-PRIVATE-KEY": process.env.PAYDUNYA_PRIVATE_KEY ?? "",
  "PAYDUNYA-PUBLIC-KEY": process.env.PAYDUNYA_PUBLIC_KEY ?? "",
  "PAYDUNYA-TOKEN": process.env.PAYDUNYA_TOKEN ?? "",
});

/**
 * Crée une facture de paiement PayDunya.
 * Renvoie l'URL de paiement vers laquelle rediriger l'utilisateur.
 */
export async function createInvoice(
  invoice: PayDunyaInvoice
): Promise<PayDunyaCreateInvoiceResponse> {
  const payload = {
    invoice: {
      total_amount: invoice.total_amount,
      description: invoice.description,
      items: invoice.items.reduce<Record<string, unknown>>(
        (acc, item, idx) => {
          acc[`item_${idx}`] = {
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            description: item.description ?? "",
          };
          return acc;
        },
        {}
      ),
    },
    store: {
      name: "Kids Land",
      tagline: "Vêtements pour enfants",
      website_url: process.env.NEXT_PUBLIC_APP_URL,
    },
    actions: {
      cancel_url: invoice.cancel_url,
      return_url: invoice.return_url,
      callback_url: invoice.callback_url,
    },
    custom_data: invoice.custom_data ?? {},
  };

  const res = await fetch(`${PAYDUNYA_BASE_URL}/checkout-invoice/create`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`PayDunya error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Vérifie le statut d'une facture PayDunya via son token.
 */
export async function verifyInvoice(token: string) {
  const res = await fetch(
    `${PAYDUNYA_BASE_URL}/checkout-invoice/confirm/${token}`,
    {
      method: "GET",
      headers: headers(),
    }
  );

  if (!res.ok) {
    throw new Error(`PayDunya verify error: ${res.status}`);
  }

  return res.json();
}
