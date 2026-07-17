import { NextRequest, NextResponse } from "next/server";
import { listCommunes } from "@/lib/yalidine";

// Cached per wilaya in-memory — communes within a wilaya don't change either.
const cache = new Map<number, Awaited<ReturnType<typeof listCommunes>>>();

export async function GET(req: NextRequest) {
  const wilayaId = Number(req.nextUrl.searchParams.get("wilayaId"));
  if (!wilayaId) {
    return NextResponse.json({ error: "wilayaId query param required" }, { status: 400 });
  }

  try {
    if (!cache.has(wilayaId)) {
      cache.set(wilayaId, await listCommunes(wilayaId));
    }
    return NextResponse.json({ communes: cache.get(wilayaId) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Yalidine error" }, { status: 502 });
  }
}
