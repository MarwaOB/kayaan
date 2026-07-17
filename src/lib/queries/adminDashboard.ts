import { prisma } from "@/lib/db";

export async function getAdminDashboardStats() {
  const [ordersTotal, productsTotal, categoriesTotal, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
  ]);

  return {
    ordersTotal,
    productsTotal,
    categoriesTotal,
    recentOrders,
  };
}
