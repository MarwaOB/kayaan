import { NextResponse } from "next/server";

// Communes are no longer fetched from Yalidine. Customers type their commune
// as a free-text field on the checkout form — this route is kept as a stub
// so any stale client requests don't 404.
export async function GET() {
  return NextResponse.json({ communes: [] });
}
