import { prisma } from "@/lib/db";

/**
 * ADMIN REVIEW MODERATION (§2 "Ratings/reviews management — التقييمات").
 *
 * There is currently no on-site "leave a review" form anywhere in the
 * storefront (checked — nothing posts to a review-create endpoint). Reviews
 * today only get into the table via `prisma/seed.ts` or a future manual
 * admin "add on customer's behalf" flow. This file is moderation only
 * (approve/unapprove/delete) since that's the concrete, spec-named feature;
 * flagging the missing submission path in PROGRESS.md rather than guessing
 * at an unspec'd public review form.
 */

export type ReviewFilter = "all" | "pending" | "approved";

export async function listReviews(filter: ReviewFilter = "all") {
  return prisma.review.findMany({
    where: filter === "all" ? {} : { approved: filter === "approved" },
    select: {
      id: true,
      customerName: true,
      rating: true,
      comment: true,
      approved: true,
      createdAt: true,
      product: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function setReviewApproved(id: string, approved: boolean) {
  return prisma.review.update({ where: { id }, data: { approved } });
}

export async function deleteReview(id: string) {
  return prisma.review.delete({ where: { id } });
}
