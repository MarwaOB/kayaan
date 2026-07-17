import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { OrderStatus } from "@/lib/orderStatus";

// GET /api/admin/orders?status=CONFIRMED — mirrors the dashboard tabs in §2.
export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as OrderStatus | null;

  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true, statusHistory: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
