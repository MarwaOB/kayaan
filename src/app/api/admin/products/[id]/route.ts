import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminProduct, updateAdminProduct, deleteAdminProduct } from "@/lib/queries/adminProduct";

// GET /api/admin/products/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const product = await getAdminProduct(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

// PATCH /api/admin/products/:id   body: partial Product fields (§3, incl. owner-only ones)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  // TODO: validate body against a zod schema before hitting Prisma (§14.2),
  // same gap as the existing POST /api/admin/products route.
  const product = await updateAdminProduct(params.id, body);
  return NextResponse.json({ product });
}

// DELETE /api/admin/products/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  await deleteAdminProduct(params.id);
  return NextResponse.json({ ok: true });
}
