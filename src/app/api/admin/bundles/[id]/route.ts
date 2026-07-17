import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { updateBundle, deleteBundle } from "@/lib/queries/adminBundle";

// PATCH /api/admin/bundles/:id   body: Partial<BundleInput>
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const bundle = await updateBundle(params.id, body);
  return NextResponse.json({ bundle });
}

// DELETE /api/admin/bundles/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  await deleteBundle(params.id);
  return NextResponse.json({ ok: true });
}
