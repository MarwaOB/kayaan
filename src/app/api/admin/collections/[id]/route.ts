import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { updateCollection, deleteCollection } from "@/lib/queries/adminCollection";

// PATCH /api/admin/collections/:id   body: Partial<CollectionInput>
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const collection = await updateCollection(params.id, body);
  return NextResponse.json({ collection });
}

// DELETE /api/admin/collections/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  await deleteCollection(params.id);
  return NextResponse.json({ ok: true });
}
