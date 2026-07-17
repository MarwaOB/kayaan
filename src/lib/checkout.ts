import { prisma } from "@/lib/db";
import { calculateFee } from "@/lib/yalidine";

export type DeliveryMethod = "HOME" | "OFFICE";
export const DeliveryMethod = {
  HOME: "HOME",
  OFFICE: "OFFICE",
} as const;

export type CheckoutLineItem =
  | { type: "variant"; variantId: string; quantity: number }
  | { type: "bundle"; bundleId: string; quantity: number };

export type CheckoutInput = {
  customerName: string;
  phone: string;
  email?: string;
  shippingAddress: string;
  wilayaId: number; // Yalidine's numeric wilaya ID — required for the fee lookup
  wilaya: string; // display name, as picked from the /api/delivery/wilayas list
  communeId: number;
  commune: string;
  deliveryMethod: DeliveryMethod;
  couponCode?: string;
  items: CheckoutLineItem[];
};

export class CheckoutError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "CheckoutError";
  }
}

// Wilayas requiring a manual delivery quote per the client's own note (§1):
// home-delivery pricing varies by wilaya and isn't shown on the site. This
// is checked BEFORE calling Yalidine — if it's set, we skip the live lookup
// entirely for that wilaya, same as before.
const MANUAL_QUOTE_WILAYAS = new Set<string>([]); // populate with confirmed list before launch

/**
 * Creates an order, decrementing stock and validating everything server-side
 * (§14.2, §14.6). All-or-nothing: if any variant is out of stock, or the
 * phone number is blocked, the whole operation rolls back — never a
 * half-created order with stock already decremented.
 */
export async function createOrder(input: CheckoutInput) {
  // Server-side validation — never trust client-submitted prices/availability (§14.2).
  if (!/^0[5-7][0-9]{8}$/.test(input.phone)) {
    throw new CheckoutError("Invalid Algerian phone number.", "INVALID_PHONE");
  }
  if (input.items.length === 0) {
    throw new CheckoutError("Cart is empty.", "EMPTY_CART");
  }
  if (!input.wilayaId || !input.wilaya || !input.communeId || !input.commune) {
    throw new CheckoutError("Wilaya and commune are required.", "INVALID_LOCATION");
  }

  const blocked = await prisma.blockedNumber.findUnique({ where: { phone: input.phone } });
  if (blocked) {
    throw new CheckoutError("This phone number is blocked from ordering.", "PHONE_BLOCKED");
  }

  // Resolved OUTSIDE the DB transaction — an external HTTP call to Yalidine
  // has no business holding a transaction (and its row locks) open while it
  // waits on a third-party server. If Yalidine is unreachable or the wilaya
  // needs a manual quote, we don't block checkout — we just flag it for the
  // admin to follow up with a fee by hand, same as the pre-integration
  // behavior.
  let deliveryFee = 0;
  let requiresManualDeliveryQuote = MANUAL_QUOTE_WILAYAS.has(input.wilaya);
  if (!requiresManualDeliveryQuote) {
    try {
      const fee = await calculateFee(input.wilayaId);
      deliveryFee = input.deliveryMethod === "HOME" ? fee.homeFee : fee.officeFee;
    } catch (err) {
      console.error(`[checkout] Yalidine fee lookup failed for wilaya ${input.wilayaId}:`, err);
      requiresManualDeliveryQuote = true;
    }
  }

  return prisma.$transaction(async (tx) => {
    let total = 0;
    const orderItemsData: {
      productId?: string;
      variantId?: string;
      bundleId?: string;
      quantity: number;
      unitPrice: number;
    }[] = [];

    for (const item of input.items) {
      if (item.type === "variant") {
        const variant = await tx.productVariant.findUniqueOrThrow({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (variant.stock < item.quantity) {
          throw new CheckoutError(
            `Insufficient stock for ${variant.product.name} (${variant.color}/${variant.size}).`,
            "OUT_OF_STOCK"
          );
        }

        const unitPrice = variant.product.discountPrice ?? variant.product.salePrice;

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } },
        });

        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          quantity: item.quantity,
          unitPrice,
        });
        total += unitPrice * item.quantity;
      } else {
        const bundle = await tx.bundle.findUniqueOrThrow({ where: { id: item.bundleId } });
        orderItemsData.push({ bundleId: bundle.id, quantity: item.quantity, unitPrice: bundle.bundlePrice });
        total += bundle.bundlePrice * item.quantity;
      }
    }

    let couponId: string | undefined;
    if (input.couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: input.couponCode } });
      if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) {
        throw new CheckoutError("Invalid or expired coupon.", "INVALID_COUPON");
      }
      couponId = coupon.id;
      total =
        coupon.discountType === "PERCENT"
          ? total * (1 - coupon.discountValue / 100)
          : Math.max(0, total - coupon.discountValue);
    }

    const order = await tx.order.create({
      data: {
        customerName: input.customerName,
        phone: input.phone,
        email: input.email,
        shippingAddress: input.shippingAddress,
        wilaya: input.wilaya,
        commune: input.commune,
        deliveryMethod: input.deliveryMethod,
        deliveryFee,
        requiresManualDeliveryQuote,
        couponId,
        totalAmount: total + deliveryFee,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    await tx.orderStatusHistory.create({
      data: { orderId: order.id, status: order.status, note: "Order created" },
    });

    return order;
  });
}
