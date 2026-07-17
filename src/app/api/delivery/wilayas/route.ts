import { NextResponse } from "next/server";
import { listWilayas } from "@/lib/yalidine";

// Cached in-memory for the life of the server process — Algeria's 58
// wilayas don't change. Avoids hitting Yalidine's API on every checkout
// page load.
let cache: Awaited<ReturnType<typeof listWilayas>> | null = null;

export async function GET() {
  try {
    if (!cache) cache = await listWilayas();
    return NextResponse.json({ wilayas: cache });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Yalidine error" }, { status: 502 });
  }
}
