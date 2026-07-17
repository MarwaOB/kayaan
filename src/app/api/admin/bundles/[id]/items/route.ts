import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { setBundleItems } from "@/lib/queries/adminBundle";

// PUT /api/admin/bundles/:id/items   body: { items: { productId: string, quantity: number }[] }
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { items } = await req.json();
  if (
    !Array.isArray(items) ||
    !items.every((i) => typeof i?.productId === "string" && Number.isInteger(i?.quantity) && i.quantity > 0)
  ) {
    return NextResponse.json({ error: "items must be an array of { productId, quantity }" }, { status: 400 });
  }

  await setBundleItems(params.id, items);
  return NextResponse.json({ ok: true });
}
