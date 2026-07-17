import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listBundles, createBundle } from "@/lib/queries/adminBundle";

// GET  /api/admin/bundles
// POST /api/admin/bundles   body: { name, slug, description?, bundlePrice, coverImage?, visible? }
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const bundles = await listBundles();
  return NextResponse.json({ bundles });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  if (!body.name || !body.slug || typeof body.bundlePrice !== "number") {
    return NextResponse.json({ error: "name, slug, and bundlePrice are required" }, { status: 400 });
  }

  try {
    const bundle = await createBundle(body);
    return NextResponse.json({ bundle }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A bundle with this slug already exists." }, { status: 409 });
    }
    throw err;
  }
}
