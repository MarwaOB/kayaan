import { prisma } from "@/lib/db";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";

/**
 * Order-confirmation recap message, sent right after an order is created
 * (§2) — not to be confused with the old OTP flow (removed). This just
 * tells the customer what they ordered, the total, and delivery details.
 * It never blocks or fails order creation: failures here are logged only,
 * since the order itself is already saved by the time this runs.
 *
 * Two providers (env `WHATSAPP_PROVIDER`, default `baileys`):
 *
 * **baileys** — POST to the separate always-on Baileys service
 * (`whatsapp-service/` at repo root). That service must be deployed, running,
 * and QR-linked to the business WhatsApp number.
 *   WHATSAPP_SERVICE_URL — base URL, e.g. https://kayaaan-whatsapp.onrender.com
 *   WHATSAPP_SERVICE_API_KEY — shared secret sent as header `x-api-key`
 *
 * **cloud_api** — Meta WhatsApp Cloud API via an approved Utility template.
 * Requires its own approved WhatsApp template (category "Utility" — this is
 * a business-initiated informational message, not an OTP, so it can't reuse
 * the Authentication template even if one still exists from before). Create
 * it in WhatsApp Manager with 5 body variables in this order: customer name,
 * item list, total price, delivery type (home/office), wilaya.
 *   WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_NAME — exact approved template name
 * Optional:
 *   WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_LANG — defaults to "ar"
 *   WHATSAPP_CLOUD_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID — see src/lib/whatsapp.ts
 */
const DELIVERY_METHOD_LABEL: Record<string, string> = {
  HOME: "التوصيل للمنزل",
  OFFICE: "التوصيل للمكتب",
};

type WhatsAppProvider = "cloud_api" | "baileys";

function getProvider(): WhatsAppProvider {
  const raw = process.env.WHATSAPP_PROVIDER || "baileys";
  return raw === "cloud_api" ? "cloud_api" : "baileys";
}

function formatDZD(amount: number): string {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

async function buildItemsSummary(orderId: string): Promise<string> {
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    include: {
      variant: { include: { product: true } },
      product: true,
      bundle: true,
    },
  });

  return items
    .map((item) => {
      if (item.bundle) return `${item.bundle.name} x${item.quantity}`;
      if (item.variant) {
        return `${item.variant.product.name} (${item.variant.color}/${item.variant.size}) x${item.quantity}`;
      }
      if (item.product) return `${item.product.name} x${item.quantity}`;
      return `منتج x${item.quantity}`;
    })
    .join("، ");
}

function buildBaileysConfirmationMessage(
  order: {
    customerName: string;
    totalAmount: number;
    wilaya: string;
    commune: string;
    shippingAddress: string;
  },
  itemsSummary: string,
  deliveryLabel: string,
): string {
  const addressParts = [order.shippingAddress, order.commune, order.wilaya].filter(Boolean);
  const addressLine = addressParts.join("، ");

  return [
    `مرحباً ${order.customerName} 👋`,
    "",
    "تم استلام طلبك من كيان بنجاح.",
    "",
    `📦 المنتجات: ${itemsSummary}`,
    `💰 الإجمالي: ${formatDZD(order.totalAmount)}`,
    `🚚 ${deliveryLabel}`,
    `📍 ${addressLine}`,
    "",
    "سنتصل بك قريباً لتأكيد الطلب.",
    "شكراً لثقتك بكيان ❤️",
  ].join("\n");
}

async function sendViaBaileys(orderId: string): Promise<void> {
  const serviceUrl = process.env.WHATSAPP_SERVICE_URL;
  const apiKey = process.env.WHATSAPP_SERVICE_API_KEY;

  if (!serviceUrl || !apiKey) {
    console.warn(
      "[orderConfirmationMessage] WHATSAPP_SERVICE_URL or WHATSAPP_SERVICE_API_KEY not set — skipping recap message."
    );
    return;
  }

  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  const itemsSummary = await buildItemsSummary(orderId);
  const deliveryLabel = DELIVERY_METHOD_LABEL[order.deliveryMethod] ?? order.deliveryMethod;
  const message = buildBaileysConfirmationMessage(order, itemsSummary, deliveryLabel);

  const baseUrl = serviceUrl.replace(/\/$/, "");
  const res = await fetch(`${baseUrl}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ phone: order.phone, message }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Baileys service error (HTTP ${res.status}): ${body}`);
  }
}

async function sendViaCloudApi(orderId: string): Promise<void> {
  const templateName = process.env.WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_NAME;
  const templateLang = process.env.WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_LANG || "ar";

  if (!templateName) {
    console.warn(
      "[orderConfirmationMessage] WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_NAME not set — skipping recap message."
    );
    return;
  }

  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  const itemsSummary = await buildItemsSummary(orderId);
  const deliveryLabel = DELIVERY_METHOD_LABEL[order.deliveryMethod] ?? order.deliveryMethod;

  await sendWhatsAppTemplate(order.phone, templateName, templateLang, [
    {
      type: "body",
      parameters: [
        { type: "text", text: order.customerName },
        { type: "text", text: itemsSummary },
        { type: "text", text: formatDZD(order.totalAmount) },
        { type: "text", text: deliveryLabel },
        { type: "text", text: order.wilaya },
      ],
    },
  ]);
}

/**
 * Fire-and-forget by design from the caller's point of view: throws are
 * caught here and logged, never propagated, so a WhatsApp/Meta hiccup can
 * never undo or fail an already-created order.
 */
export async function sendOrderConfirmationMessage(orderId: string): Promise<void> {
  try {
    if (getProvider() === "baileys") {
      await sendViaBaileys(orderId);
    } else {
      await sendViaCloudApi(orderId);
    }
  } catch (err) {
    // Never let a messaging failure affect the order itself — it's already
    // saved. Just log so it's visible without silently losing the signal.
    console.error(`[orderConfirmationMessage] Failed to send recap for order ${orderId}:`, err);
  }
}
