import { prisma } from "@/lib/db";
import { createParcel } from "@/lib/yalidine";

/**
 * Creates the actual Yalidine shipment once an order is confirmed (§13).
 * Same fire-and-forget contract as sendOrderConfirmationMessage: never
 * throws, only logs — a Yalidine hiccup must not undo or block an admin's
 * confirm action, which has already committed. On success, stores the
 * tracking number on the order so it shows up in the dashboard.
 */
export async function createYalidineParcelForOrder(orderId: string): Promise<void> {
  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        items: { include: { variant: { include: { product: true } }, product: true, bundle: true } },
      },
    });

    if (order.yalidineTracking) return; // already shipped, don't double-create

    const productList = order.items
      .map((item) => {
        if (item.bundle) return `${item.bundle.name} x${item.quantity}`;
        if (item.variant) return `${item.variant.product.name} (${item.variant.color}/${item.variant.size}) x${item.quantity}`;
        if (item.product) return `${item.product.name} x${item.quantity}`;
        return `منتج x${item.quantity}`;
      })
      .join(", ");

    const [firstname, ...rest] = order.customerName.trim().split(" ");
    const familyname = rest.join(" ") || firstname;

    const parcel = await createParcel({
      orderId: order.id,
      toWilayaName: order.wilaya,
      toCommuneName: order.commune,
      firstname,
      familyname,
      contactPhone: order.phone,
      address: order.shippingAddress,
      productList,
      price: order.totalAmount,
      isStopdesk: order.deliveryMethod === "OFFICE",
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { yalidineTracking: parcel.tracking, yalidineLabelUrl: parcel.labelUrl },
    });
  } catch (err) {
    console.error(`[yalidineParcel] Failed to create parcel for order ${orderId}:`, err);
  }
}
