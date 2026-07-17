import { prisma } from "@/lib/db";
import { sendWhatsAppTemplate } from "@/lib/whatsapp";

/**
 * Order-confirmation recap message, sent right after an order is created
 * (§2) — not to be confused with the old OTP flow (removed). This just
 * tells the customer what they ordered, the total, and delivery details.
 * It never blocks or fails order creation: failures here are logged only,
 * since the order itself is already saved by the time this runs.
 *
 * Requires its own approved WhatsApp template (category "Utility" — this is
 * a business-initiated informational message, not an OTP, so it can't reuse
 * the Authentication template even if one still exists from before). Create
 * it in WhatsApp Manager with 5 body variables in this order: customer name,
 * item list, total price, delivery type (home/office), wilaya.
 *
 * Required env vars:
 *   WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_NAME — exact approved template name
 * Optional:
 *   WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_LANG — defaults to "ar"
 */
const DELIVERY_METHOD_LABEL: Record<string, string> = {
  FAST: "التوصيل السريع",
  ECONOMIC: "التوصيل الاقتصادي",
};

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

/**
 * Fire-and-forget by design from the caller's point of view: throws are
 * caught here and logged, never propagated, so a WhatsApp/Meta hiccup can
 * never undo or fail an already-created order.
 */
export async function sendOrderConfirmationMessage(orderId: string): Promise<void> {
  const templateName = process.env.WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_NAME;
  const templateLang = process.env.WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_LANG || "ar";

  if (!templateName) {
    console.warn(
      "[orderConfirmationMessage] WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_NAME not set — skipping recap message."
    );
    return;
  }

  try {
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
  } catch (err) {
    // Never let a messaging failure affect the order itself — it's already
    // saved. Just log so it's visible without silently losing the signal.
    console.error(`[orderConfirmationMessage] Failed to send recap for order ${orderId}:`, err);
  }
}
