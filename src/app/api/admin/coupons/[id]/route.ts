import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { setCouponActive, deleteCoupon } from "@/lib/queries/adminCoupon";

// PATCH /api/admin/coupons/:id   body: { active: boolean }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { active } = await req.json();
  if (typeof active !== "boolean") {
    return NextResponse.json({ error: "`active` must be a boolean" }, { status: 400 });
  }

  const coupon = await setCouponActive(params.id, active);
  return NextResponse.json({ coupon });
}

// DELETE /api/admin/coupons/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  await deleteCoupon(params.id);
  return NextResponse.json({ ok: true });
}
