import { prisma } from "@/lib/db";

/**
 * ADMIN BLOCKLIST QUERIES (§2)
 * ----------------------------
 * BlockedNumber: blocked from ordering entirely (الارقام المحظورة من الطلب).
 * Must sit behind /admin auth — enforced in the route handlers, not here.
 */

export async function listBlockedNumbers() {
  return prisma.blockedNumber.findMany({ orderBy: { blockedAt: "desc" } });
}

export async function addBlockedNumber(phone: string, reason?: string) {
  return prisma.blockedNumber.upsert({
    where: { phone },
    create: { phone, reason },
    update: { reason },
  });
}

export async function removeBlockedNumber(id: string) {
  return prisma.blockedNumber.delete({ where: { id } });
}
