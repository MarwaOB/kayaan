import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listBlockedNumbers, addBlockedNumber } from "@/lib/queries/adminBlocklist";

// GET  /api/admin/blocked-numbers        — list numbers blocked from ordering entirely
// POST /api/admin/blocked-numbers        body: { phone, reason? }
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const numbers = await listBlockedNumbers();
  return NextResponse.json({ numbers });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { phone, reason } = await req.json();
  if (!phone || typeof phone !== "string") {
    return NextResponse.json({ error: "`phone` is required" }, { status: 400 });
  }

  const number = await addBlockedNumber(phone, reason);
  return NextResponse.json({ number }, { status: 201 });
}
