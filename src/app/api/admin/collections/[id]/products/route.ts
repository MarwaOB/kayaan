import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { setCollectionProducts } from "@/lib/queries/adminCollection";

// PUT /api/admin/collections/:id/products   body: { productIds: string[] }
// Replaces the full product list — array order becomes display position.
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { productIds } = await req.json();
  if (!Array.isArray(productIds) || !productIds.every((p) => typeof p === "string")) {
    return NextResponse.json({ error: "productIds must be an array of strings" }, { status: 400 });
  }

  await setCollectionProducts(params.id, productIds);
  return NextResponse.json({ ok: true });
}
