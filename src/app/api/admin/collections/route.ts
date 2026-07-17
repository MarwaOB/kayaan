import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listCollections, createCollection } from "@/lib/queries/adminCollection";

// GET  /api/admin/collections
// POST /api/admin/collections   body: { name, nameAr?, slug, description?, coverImage?, visible?, position? }
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const collections = await listCollections();
  return NextResponse.json({ collections });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  try {
    const collection = await createCollection(body);
    return NextResponse.json({ collection }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A collection with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}
