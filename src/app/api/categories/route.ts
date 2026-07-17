import { NextResponse } from "next/server";
import { getPublicCategories } from "@/lib/queries/publicCategory";

// GET /api/categories — only unmasked categories (§4)
export async function GET() {
  const categories = await getPublicCategories();
  return NextResponse.json({ categories });
}
