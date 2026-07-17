import { NextRequest, NextResponse } from "next/server";
import { createOrder, CheckoutError } from "@/lib/checkout";
import { sendOrderConfirmationMessage } from "@/lib/orderConfirmationMessage";

// POST /api/orders — create an order (no login required, §8). The order
// starts as AWAITING_PAYMENT ("en attente") — there is no auto-confirm step.
// An admin calls the customer and moves it to CONFIRMED or PAYMENT_FAILED
// from the orders dashboard (§14.7's existing transition rules already
// support this, no OTP step involved).
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const order = await createOrder(body);
    // Never block the response on this — see sendOrderConfirmationMessage's
    // own try/catch, this call itself can't throw.
    void sendOrderConfirmationMessage(order.id);
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    if (err instanceof CheckoutError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 422 });
    }
    throw err;
  }
}
