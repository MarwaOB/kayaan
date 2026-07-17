import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminProducts, createAdminProduct } from "@/lib/queries/adminProduct";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? undefined;

  const products = await getAdminProducts({ search });
  return NextResponse.json({ products }); // includes cost/rawPrice/sponsorSpend/profit — admin-only route
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  // TODO: validate body against a zod schema before hitting Prisma (§14.2).
  const product = await createAdminProduct(body);
  return NextResponse.json({ product }, { status: 201 });
}
