import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listCoupons, createCoupon } from "@/lib/queries/adminCoupon";

// GET  /api/admin/coupons
// POST /api/admin/coupons   body: { code, discountType: "PERCENT"|"FIXED", discountValue, expiresAt? }
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const coupons = await listCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  if (!body.code || !["PERCENT", "FIXED"].includes(body.discountType) || typeof body.discountValue !== "number") {
    return NextResponse.json({ error: "code, discountType, and discountValue are required" }, { status: 400 });
  }

  try {
    const coupon = await createCoupon(body);
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
    }
    throw err;
  }
}
