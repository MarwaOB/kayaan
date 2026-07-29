import { prisma } from "@/lib/db";
import { getDeliveryFee } from "@/lib/deliveryPricing";

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
  wilayaId: number; // index into the static WILAYAS list (1-based)
  wilaya: string;   // display name, as picked from the wilaya selector
  commune: string;  // free-text commune entered by the customer
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
  if (!input.wilayaId || !input.wilaya) {
    throw new CheckoutError("Wilaya is required.", "INVALID_LOCATION");
  }

  const blocked = await prisma.blockedNumber.findUnique({ where: { phone: input.phone } });
  if (blocked) {
    throw new CheckoutError("This phone number is blocked from ordering.", "PHONE_BLOCKED");
  }

  // Fee resolved from the static pricing table — no external HTTP call needed.
  const feeEntry = getDeliveryFee(input.wilayaId);
  let deliveryFee = 0;
  if (feeEntry) {
    deliveryFee = input.deliveryMethod === "HOME" ? feeEntry.homeFee : feeEntry.deskFee;
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
        commune: input.commune || "",
        deliveryMethod: input.deliveryMethod,
        deliveryFee,
        requiresManualDeliveryQuote: false,
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
