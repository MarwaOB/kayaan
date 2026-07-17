import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listSubscribers, addSubscriber } from "@/lib/queries/adminNewsletter";

// GET  /api/admin/newsletter
// POST /api/admin/newsletter   body: { contact: string }  (manual add — see adminNewsletter.ts note)
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const subscribers = await listSubscribers();
  return NextResponse.json({ subscribers });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  if (!body.contact || typeof body.contact !== "string" || !body.contact.trim()) {
    return NextResponse.json({ error: "contact is required" }, { status: 400 });
  }

  try {
    const subscriber = await addSubscriber(body.contact);
    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "This contact is already subscribed." }, { status: 409 });
    }
    throw err;
  }
}
