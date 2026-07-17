import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { setReviewApproved, deleteReview } from "@/lib/queries/adminReview";

// PATCH /api/admin/reviews/:id   body: { approved: boolean }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { approved } = await req.json();
  if (typeof approved !== "boolean") {
    return NextResponse.json({ error: "`approved` must be a boolean" }, { status: 400 });
  }

  const review = await setReviewApproved(params.id, approved);
  return NextResponse.json({ review });
}

// DELETE /api/admin/reviews/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  await deleteReview(params.id);
  return NextResponse.json({ ok: true });
}
