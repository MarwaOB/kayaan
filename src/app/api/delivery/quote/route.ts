import { NextRequest, NextResponse } from "next/server";
import { calculateFee } from "@/lib/yalidine";
import { getDeliveryEtaLabel } from "@/lib/deliveryEta";

// GET /api/delivery/quote?wilayaId=16 — fee for both home and office
// delivery to that wilaya, plus a manually-maintained ETA label (Yalidine's
// API doesn't provide delivery-time estimates — see src/lib/deliveryEta.ts).
export async function GET(req: NextRequest) {
  const wilayaId = Number(req.nextUrl.searchParams.get("wilayaId"));
  if (!wilayaId) {
    return NextResponse.json({ error: "wilayaId query param required" }, { status: 400 });
  }

  try {
    const fee = await calculateFee(wilayaId);
    return NextResponse.json({ ...fee, etaLabel: getDeliveryEtaLabel(wilayaId) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Yalidine error" }, { status: 502 });
  }
}
