import { NextRequest, NextResponse } from "next/server";
import { getPublicProduct } from "@/lib/queries/publicProduct";

// GET /api/products/hoodie-jazairi
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const product = await getPublicProduct(params.slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
