import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminCategories } from "@/lib/queries/adminProduct";

// GET /api/admin/categories — full list including hidden ones (§4).
// Public storefront uses /api/categories (publicCategory.ts) instead, which
// filters to visible=true only.
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const categories = await getAdminCategories();
  return NextResponse.json({ categories });
}
