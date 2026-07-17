import { NextRequest, NextResponse } from "next/server";
import { getPublicProducts, getPublicProductsByIds } from "@/lib/queries/publicProduct";

// GET /api/products?category=hoodies&trending=true&take=4&ids=id1,id2
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");

  // Favorites (§8) look up a specific, ordered list of IDs — keep the
  // caller's order (e.g. most-recently-favorited-first) rather than DB order.
  if (idsParam) {
    const ids = idsParam.split(",").filter(Boolean);
    const products = await getPublicProductsByIds(ids);
    return NextResponse.json({ products });
  }

  const categorySlug = searchParams.get("category") ?? undefined;
  const trendingOnly = searchParams.get("trending") === "true";
  const take = searchParams.get("take") ? Number(searchParams.get("take")) : undefined;

  const products = await getPublicProducts({ categorySlug, trendingOnly, take });
  return NextResponse.json({ products });
}
