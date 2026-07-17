import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { advanceOrderStatus, InvalidOrderTransitionError, OrderStatus } from "@/lib/orderStatus";
import { createYalidineParcelForOrder } from "@/lib/yalidineParcel";

// PATCH /api/admin/orders/:id/status   body: { status: "CONFIRMED", note?: string }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { status, note } = await req.json();
  if (!Object.values(OrderStatus).includes(status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  try {
    const order = await advanceOrderStatus(params.id, status, note);
    if (status === "CONFIRMED") {
      // Fire-and-forget — see createYalidineParcelForOrder's own try/catch,
      // this call itself can't throw and won't block the response.
      void createYalidineParcelForOrder(order.id);
    }
    return NextResponse.json({ order });
  } catch (err) {
    if (err instanceof InvalidOrderTransitionError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
