import { NextResponse } from "next/server";
import { WILAYAS } from "@/lib/deliveryPricing";

// Static list — no external API call needed.
export async function GET() {
  const wilayas = WILAYAS.map(({ id, name }) => ({ id, name }));
  return NextResponse.json({ wilayas });
}
