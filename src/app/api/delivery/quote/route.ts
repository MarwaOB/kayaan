import { NextRequest, NextResponse } from "next/server";
import { getDeliveryFee } from "@/lib/deliveryPricing";

// GET /api/delivery/quote?wilayaId=1
// Returns home and desk fees for the given wilaya ID, looked up from the
// static pricing table — no external API call.
export async function GET(req: NextRequest) {
  const wilayaId = Number(req.nextUrl.searchParams.get("wilayaId"));
  if (!wilayaId) {
    return NextResponse.json({ error: "wilayaId query param required" }, { status: 400 });
  }

  const fee = getDeliveryFee(wilayaId);
  if (!fee) {
    return NextResponse.json({ error: "Unknown wilaya ID" }, { status: 404 });
  }

  // officeFee alias kept for backwards compat with the checkout page.
  return NextResponse.json({ homeFee: fee.homeFee, officeFee: fee.deskFee });
}
