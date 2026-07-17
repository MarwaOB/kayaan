import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { deleteHotspot } from "@/lib/queries/adminHotspot";

// DELETE /api/admin/hotspots/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  await deleteHotspot(params.id);
  return NextResponse.json({ ok: true });
}
