import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listReviews, ReviewFilter } from "@/lib/queries/adminReview";

// GET /api/admin/reviews?filter=all|pending|approved  (default: all)
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const filterParam = req.nextUrl.searchParams.get("filter");
  const filter: ReviewFilter =
    filterParam === "pending" || filterParam === "approved" ? filterParam : "all";

  const reviews = await listReviews(filter);
  return NextResponse.json({ reviews });
}
