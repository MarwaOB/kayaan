import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { removeBlockedNumber } from "@/lib/queries/adminBlocklist";

// DELETE /api/admin/blocked-numbers/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  await removeBlockedNumber(params.id);
  return NextResponse.json({ ok: true });
}
