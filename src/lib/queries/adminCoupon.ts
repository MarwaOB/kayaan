import { prisma } from "@/lib/db";

/**
 * ADMIN COUPON QUERIES (§2 marketing tools: "Coupons").
 * Discount application itself lives in src/lib/checkout.ts (createOrder) —
 * this file is just CRUD for the admin dashboard.
 */
export async function listCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export type CreateCouponInput = {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  expiresAt?: string | null;
};

export async function createCoupon(input: CreateCouponInput) {
  return prisma.coupon.create({
    data: {
      code: input.code.trim().toUpperCase(),
      discountType: input.discountType,
      discountValue: input.discountValue,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
    },
  });
}

export async function setCouponActive(id: string, active: boolean) {
  return prisma.coupon.update({ where: { id }, data: { active } });
}

export async function deleteCoupon(id: string) {
  return prisma.coupon.delete({ where: { id } });
}
