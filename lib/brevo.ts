const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const SENDER = { name: "Kids Land", email: "info@kidsland.africa" };
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.kidsland.africa";

// ── Core ──────────────────────────────────────────────────────────────────────

async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Brevo] BREVO_API_KEY manquant — email non envoyé");
    return;
  }
  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ sender: SENDER, to: [to], subject, htmlContent }),
  });
  if (!res.ok) {
    console.error("[Brevo] Erreur envoi:", await res.text());
  }
}

// ── Shared layout ─────────────────────────────────────────────────────────────

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kids Land</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ebebeb;">
        <!-- Header -->
        <tr>
          <td style="background:#000;padding:24px 32px;">
            <a href="${APP_URL}" style="text-decoration:none;">
              <span style="color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">Kids Land</span>
            </a>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:32px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;border-top:1px solid #ebebeb;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#999;">Kids Land — La mode enfant en Afrique</p>
            <p style="margin:0;font-size:12px;color:#bbb;">
              <a href="${APP_URL}/help/faq" style="color:#bbb;">Aide</a> &nbsp;·&nbsp;
              <a href="${APP_URL}/orders/track" style="color:#bbb;">Suivre ma commande</a> &nbsp;·&nbsp;
              <a href="mailto:info@kidsland.africa" style="color:#bbb;">info@kidsland.africa</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function formatPrice(amount: number) {
  return amount.toLocaleString("fr-FR") + " F CFA";
}

// ── Templates ─────────────────────────────────────────────────────────────────

type OrderItem = {
  productName: string;
  variantLabel?: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productImage?: string | null;
};

type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingFullName: string;
  shippingPhone: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingStreet?: string | null;
};

function itemsTable(items: OrderItem[]) {
  const rows = items
    .map(
      (item) => `
    <tr style="border-bottom:1px solid #f0f0f0;">
      <td style="padding:12px 0;">
        <p style="margin:0;font-size:14px;font-weight:700;color:#111;">${item.productName}</p>
        ${item.variantLabel ? `<p style="margin:2px 0 0;font-size:12px;color:#999;">${item.variantLabel}</p>` : ""}
        <p style="margin:2px 0 0;font-size:12px;color:#999;">Qté : ${item.quantity}</p>
      </td>
      <td style="padding:12px 0;text-align:right;font-size:14px;font-weight:700;color:#111;white-space:nowrap;">
        ${formatPrice(item.subtotal)}
      </td>
    </tr>`
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">${rows}</table>`;
}

function totalsBlock(data: Pick<OrderEmailData, "subtotal" | "shippingFee" | "discount" | "total">) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
    <tr>
      <td style="font-size:13px;color:#666;padding:4px 0;">Sous-total</td>
      <td style="font-size:13px;color:#666;text-align:right;">${formatPrice(data.subtotal)}</td>
    </tr>
    <tr>
      <td style="font-size:13px;color:#666;padding:4px 0;">Livraison</td>
      <td style="font-size:13px;color:#666;text-align:right;">${data.shippingFee === 0 ? "Offerte" : formatPrice(data.shippingFee)}</td>
    </tr>
    ${data.discount > 0 ? `
    <tr>
      <td style="font-size:13px;color:#e07b39;padding:4px 0;">Réduction</td>
      <td style="font-size:13px;color:#e07b39;text-align:right;">- ${formatPrice(data.discount)}</td>
    </tr>` : ""}
    <tr>
      <td style="font-size:15px;font-weight:900;color:#111;padding:12px 0 4px;border-top:2px solid #111;">Total payé</td>
      <td style="font-size:15px;font-weight:900;color:#111;text-align:right;padding:12px 0 4px;border-top:2px solid #111;">${formatPrice(data.total)}</td>
    </tr>
  </table>`;
}

// ── Emails transactionnels ────────────────────────────────────────────────────

export async function sendOrderConfirmation(
  to: { email: string; name: string },
  order: OrderEmailData
) {
  const content = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:900;color:#111;">Commande confirmée !</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#666;">Merci ${order.customerName}, votre paiement a bien été reçu.</p>

    <div style="background:#f9f9f9;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Numéro de commande</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:900;color:#111;font-family:monospace;">${order.orderNumber}</p>
    </div>

    <h3 style="margin:0 0 8px;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#999;">Articles commandés</h3>
    ${itemsTable(order.items)}
    ${totalsBlock(order)}

    <div style="background:#f9f9f9;border-radius:10px;padding:14px 18px;margin-top:24px;">
      <p style="margin:0 0 8px;font-size:12px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Adresse de livraison</p>
      <p style="margin:0;font-size:14px;color:#111;font-weight:700;">${order.shippingFullName}</p>
      <p style="margin:2px 0 0;font-size:13px;color:#555;">${order.shippingDistrict}, ${order.shippingCity}</p>
      ${order.shippingStreet ? `<p style="margin:2px 0 0;font-size:13px;color:#555;">${order.shippingStreet}</p>` : ""}
      <p style="margin:2px 0 0;font-size:13px;color:#555;">${order.shippingPhone}</p>
    </div>

    <div style="margin-top:28px;text-align:center;">
      <a href="${APP_URL}/orders/track" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        Suivre ma commande
      </a>
    </div>

    <p style="margin:28px 0 0;font-size:13px;color:#999;text-align:center;">
      Des questions ? Écrivez-nous à <a href="mailto:info@kidsland.africa" style="color:#e07b39;">info@kidsland.africa</a>
    </p>`;

  await sendEmail({
    to,
    subject: `Commande confirmée — ${order.orderNumber}`,
    htmlContent: layout(content),
  });
}

const STATUS_LABELS: Record<string, { label: string; message: string; color: string }> = {
  PROCESSING: {
    label: "En cours de préparation",
    message: "Notre équipe prépare votre commande avec soin. Vous serez notifié·e dès l'expédition.",
    color: "#3B82F6",
  },
  SHIPPED: {
    label: "Expédiée",
    message: "Votre commande est en route ! Notre livreur vous contactera pour organiser la remise.",
    color: "#8B5CF6",
  },
  DELIVERED: {
    label: "Livrée",
    message: "Votre commande a bien été livrée. Nous espérons que vos enfants adorent leurs nouveaux articles !",
    color: "#10B981",
  },
  CANCELLED: {
    label: "Annulée",
    message: "Votre commande a été annulée. Si vous avez été débité·e, un remboursement sera effectué sous 3–5 jours ouvrés.",
    color: "#EF4444",
  },
  REFUNDED: {
    label: "Remboursée",
    message: "Votre remboursement a été initié. Il apparaîtra sur votre compte dans 3–5 jours ouvrés.",
    color: "#F59E0B",
  },
};

export async function sendOrderStatusUpdate(
  to: { email: string; name: string },
  orderNumber: string,
  status: string
) {
  const info = STATUS_LABELS[status];
  if (!info) return; // Pas d'email pour PENDING/PAID (déjà géré par la confirmation)

  const content = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:900;color:#111;">Mise à jour de votre commande</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#666;">Bonjour ${to.name},</p>

    <div style="background:#f9f9f9;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;color:#999;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Commande</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:900;color:#111;font-family:monospace;">${orderNumber}</p>
    </div>

    <div style="background:${info.color}18;border-left:4px solid ${info.color};border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${info.color};">Statut</p>
      <p style="margin:0 0 8px;font-size:18px;font-weight:900;color:#111;">${info.label}</p>
      <p style="margin:0;font-size:14px;color:#555;">${info.message}</p>
    </div>

    <div style="margin-top:24px;text-align:center;">
      <a href="${APP_URL}/orders/track" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        Suivre ma commande
      </a>
    </div>

    <p style="margin:28px 0 0;font-size:13px;color:#999;text-align:center;">
      Des questions ? Écrivez-nous à <a href="mailto:info@kidsland.africa" style="color:#e07b39;">info@kidsland.africa</a>
    </p>`;

  await sendEmail({
    to,
    subject: `Votre commande ${orderNumber} — ${info.label}`,
    htmlContent: layout(content),
  });
}

// ── Abandon de panier ─────────────────────────────────────────────────────────

type AbandonedCartItem = {
  productName: string;
  variantLabel?: string | null;
  quantity: number;
  unitPrice: number;
  productImage?: string | null;
};

export async function sendAbandonedCartEmail(
  to: { email: string; name: string },
  items: AbandonedCartItem[],
  subtotal: number
) {
  const itemRows = items
    .map(
      (item) => `
    <tr style="border-bottom:1px solid #f0f0f0;">
      <td style="padding:12px 0;width:52px;">
        ${
          item.productImage
            ? `<img src="${item.productImage}" alt="${item.productName}" width="48" height="48" style="border-radius:8px;object-fit:cover;display:block;" />`
            : `<div style="width:48px;height:48px;background:#f5f5f5;border-radius:8px;"></div>`
        }
      </td>
      <td style="padding:12px 12px;">
        <p style="margin:0;font-size:14px;font-weight:700;color:#111;">${item.productName}</p>
        ${item.variantLabel ? `<p style="margin:2px 0 0;font-size:12px;color:#999;">${item.variantLabel}</p>` : ""}
        <p style="margin:2px 0 0;font-size:12px;color:#999;">Qté : ${item.quantity}</p>
      </td>
      <td style="padding:12px 0;text-align:right;font-size:14px;font-weight:700;color:#111;white-space:nowrap;">
        ${formatPrice(item.unitPrice * item.quantity)}
      </td>
    </tr>`
    )
    .join("");

  const content = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:900;color:#111;">Vous avez oublié quelque chose !</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#666;">
      Bonjour ${to.name}, votre panier Kids Land vous attend encore.
      Les articles partent vite — finalisez votre commande avant qu'ils ne soient plus disponibles.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      ${itemRows}
    </table>

    <div style="background:#f9f9f9;border-radius:10px;padding:14px 18px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:14px;color:#666;">Total estimé</span>
      <span style="font-size:18px;font-weight:900;color:#111;">${formatPrice(subtotal)}</span>
    </div>

    <div style="text-align:center;">
      <a href="${APP_URL}/checkout" style="display:inline-block;background:#e07b39;color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        Finaliser ma commande
      </a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#bbb;text-align:center;">
      Vous avez des questions ? <a href="mailto:info@kidsland.africa" style="color:#e07b39;">info@kidsland.africa</a>
    </p>`;

  await sendEmail({
    to,
    subject: `${to.name}, votre panier Kids Land vous attend 🛒`,
    htmlContent: layout(content),
  });
}

// ── Favoris : rupture imminente ───────────────────────────────────────────────

type LowStockItem = {
  name: string;
  slug: string;
  image?: string | null;
  basePrice: number;
  totalStock: number;
};

export async function sendLowStockWishlistEmail(
  to: { email: string; name: string },
  items: LowStockItem[]
) {
  const itemRows = items
    .map(
      (item) => `
    <tr style="border-bottom:1px solid #f0f0f0;">
      <td style="padding:12px 0;width:52px;">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}" width="48" height="48" style="border-radius:8px;object-fit:cover;display:block;" />`
            : `<div style="width:48px;height:48px;background:#f5f5f5;border-radius:8px;"></div>`
        }
      </td>
      <td style="padding:12px 12px;">
        <p style="margin:0;font-size:14px;font-weight:700;color:#111;">${item.name}</p>
        <p style="margin:4px 0 0;font-size:12px;color:#e07b39;font-weight:700;">
          Plus que ${item.totalStock} en stock !
        </p>
      </td>
      <td style="padding:12px 0;text-align:right;white-space:nowrap;">
        <span style="font-size:14px;font-weight:700;color:#111;">${formatPrice(item.basePrice)}</span><br/>
        <a href="${APP_URL}/products/${item.slug}" style="font-size:11px;color:#e07b39;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
          Commander →
        </a>
      </td>
    </tr>`
    )
    .join("");

  const content = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:900;color:#111;">Vos favoris partent vite !</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#666;">
      Bonjour ${to.name}, des articles de votre liste de favoris sont presque épuisés.
      Commandez avant qu'il ne soit trop tard.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      ${itemRows}
    </table>

    <div style="text-align:center;">
      <a href="${APP_URL}/wishlist" style="display:inline-block;background:#e07b39;color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        Voir mes favoris
      </a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#bbb;text-align:center;">
      Des questions ? <a href="mailto:info@kidsland.africa" style="color:#e07b39;">info@kidsland.africa</a>
    </p>`;

  await sendEmail({
    to,
    subject: `${to.name}, vos favoris Kids Land sont presque épuisés !`,
    htmlContent: layout(content),
  });
}

// ── Favoris oubliés ───────────────────────────────────────────────────────────

type ForgottenWishlistItem = {
  name: string;
  slug: string;
  image?: string | null;
  basePrice: number;
  comparePrice?: number | null;
};

export async function sendForgottenWishlistEmail(
  to: { email: string; name: string },
  items: ForgottenWishlistItem[]
) {
  const itemRows = items
    .slice(0, 4) // max 4 articles affichés
    .map(
      (item) => `
    <tr style="border-bottom:1px solid #f0f0f0;">
      <td style="padding:12px 0;width:52px;">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}" width="48" height="48" style="border-radius:8px;object-fit:cover;display:block;" />`
            : `<div style="width:48px;height:48px;background:#f5f5f5;border-radius:8px;"></div>`
        }
      </td>
      <td style="padding:12px 12px;">
        <p style="margin:0;font-size:14px;font-weight:700;color:#111;">${item.name}</p>
        ${
          item.comparePrice && item.comparePrice > item.basePrice
            ? `<p style="margin:2px 0 0;font-size:12px;color:#e07b39;font-weight:700;">
                Promo : <span style="text-decoration:line-through;color:#999;">${formatPrice(item.comparePrice)}</span> → ${formatPrice(item.basePrice)}
               </p>`
            : ""
        }
      </td>
      <td style="padding:12px 0;text-align:right;white-space:nowrap;">
        <span style="font-size:14px;font-weight:700;color:#111;">${formatPrice(item.basePrice)}</span><br/>
        <a href="${APP_URL}/products/${item.slug}" style="font-size:11px;color:#e07b39;text-decoration:none;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
          Voir →
        </a>
      </td>
    </tr>`
    )
    .join("");

  const content = `
    <h2 style="margin:0 0 4px;font-size:22px;font-weight:900;color:#111;">Vos favoris vous attendent</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#666;">
      Bonjour ${to.name}, vous avez sauvegardé des articles il y a quelques jours.
      Ils sont toujours disponibles — en avez-vous encore besoin ?
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      ${itemRows}
    </table>

    ${items.length > 4 ? `<p style="text-align:center;font-size:13px;color:#999;margin:0 0 20px;">+ ${items.length - 4} autre${items.length - 4 > 1 ? "s" : ""} article${items.length - 4 > 1 ? "s" : ""} dans vos favoris</p>` : ""}

    <div style="text-align:center;">
      <a href="${APP_URL}/wishlist" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
        Revoir mes favoris
      </a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#bbb;text-align:center;">
      Des questions ? <a href="mailto:info@kidsland.africa" style="color:#e07b39;">info@kidsland.africa</a>
    </p>`;

  await sendEmail({
    to,
    subject: `${to.name}, vos favoris Kids Land vous attendent encore`,
    htmlContent: layout(content),
  });
}
