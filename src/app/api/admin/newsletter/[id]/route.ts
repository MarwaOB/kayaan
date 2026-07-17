import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { setSubscriberActive, deleteSubscriber } from "@/lib/queries/adminNewsletter";

// PATCH /api/admin/newsletter/:id   body: { active: boolean }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { active } = await req.json();
  if (typeof active !== "boolean") {
    return NextResponse.json({ error: "`active` must be a boolean" }, { status: 400 });
  }

  const subscriber = await setSubscriberActive(params.id, active);
  return NextResponse.json({ subscriber });
}

// DELETE /api/admin/newsletter/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  await deleteSubscriber(params.id);
  return NextResponse.json({ ok: true });
}
