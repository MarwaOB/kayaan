import { prisma } from "@/lib/db";

export type OrderStatus =
  | "AWAITING_PAYMENT"
  | "PAYMENT_FAILED"
  | "UNDER_REVIEW"
  | "CONFIRMED"
  | "PREPARING"
  | "AWAITING_SHIPMENT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "LOST";

export const OrderStatus = {
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  UNDER_REVIEW: "UNDER_REVIEW",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  AWAITING_SHIPMENT: "AWAITING_SHIPMENT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  LOST: "LOST",
} as const;

/**
 * Valid transitions for the order pipeline (§2, §14.7).
 * Anything not listed here is rejected by advanceOrderStatus() below.
 */
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  AWAITING_PAYMENT: ["CONFIRMED", "PAYMENT_FAILED", "UNDER_REVIEW", "LOST"],
  PAYMENT_FAILED: ["AWAITING_PAYMENT", "LOST"],
  UNDER_REVIEW: ["CONFIRMED", "PAYMENT_FAILED", "LOST"],
  CONFIRMED: ["PREPARING", "LOST"],
  PREPARING: ["AWAITING_SHIPMENT", "LOST"],
  AWAITING_SHIPMENT: ["OUT_FOR_DELIVERY", "LOST"],
  OUT_FOR_DELIVERY: ["DELIVERED", "LOST"],
  DELIVERED: [], // terminal
  LOST: [], // terminal
};

export class InvalidOrderTransitionError extends Error {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Invalid order status transition: ${from} -> ${to}`);
    this.name = "InvalidOrderTransitionError";
  }
}

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return false;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Moves an order to a new status, recording it in OrderStatusHistory.
 * Throws InvalidOrderTransitionError for anything not in VALID_TRANSITIONS.
 * Wrapped in a transaction so the order row and its history entry are
 * always consistent (§14.6).
 */
export async function advanceOrderStatus(orderId: string, to: OrderStatus, note?: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });

    if (!isValidTransition(order.status as OrderStatus, to)) {
      throw new InvalidOrderTransitionError(order.status as OrderStatus, to);
    }

    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: to },
    });

    await tx.orderStatusHistory.create({
      data: { orderId, status: to, note },
    });

    return updated;
  });
}
