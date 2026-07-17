import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { setCategoryVisibility } from "@/lib/queries/adminProduct";

// PATCH /api/admin/categories/:id/mask   body: { visible: boolean }
// The actual "mask/unmask" toggle from §4 — a click in the dashboard, not a code change.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { visible } = await req.json();
  if (typeof visible !== "boolean") {
    return NextResponse.json({ error: "`visible` must be a boolean" }, { status: 400 });
  }

  const category = await setCategoryVisibility(params.id, visible);
  return NextResponse.json({ category });
}
