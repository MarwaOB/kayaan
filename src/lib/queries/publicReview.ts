import { prisma } from "@/lib/db";

/**
 * PUBLIC REVIEW SUBMISSION (§7 item 14 — "client feedback shown under each
 * product"). This is the write-side counterpart to the read-only, already-
 * safe `reviews: { where: { approved: true } }` block in
 * `publicProduct.ts` — that one only ever returns admin-approved reviews;
 * this one is how a review gets INTO the table from the storefront at all.
 *
 * New submissions always land with approved:false — nothing a visitor
 * submits is ever shown until an admin approves it in
 * `/admin/reviews` (`src/lib/queries/adminReview.ts`).
 */

export type SubmitReviewInput = {
  customerName: string;
  rating: number;
  comment?: string | null;
};

export class ReviewValidationError extends Error {}
export class ProductNotFoundError extends Error {}

const MAX_NAME_LENGTH = 80;
const MAX_COMMENT_LENGTH = 1000;

export async function submitReview(slug: string, input: SubmitReviewInput) {
  const customerName = input.customerName?.trim();
  const comment = input.comment?.trim() || null;

  if (!customerName || customerName.length > MAX_NAME_LENGTH) {
    throw new ReviewValidationError("Name is required and must be under 80 characters.");
  }
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new ReviewValidationError("Rating must be a whole number from 1 to 5.");
  }
  if (comment && comment.length > MAX_COMMENT_LENGTH) {
    throw new ReviewValidationError("Comment must be under 1000 characters.");
  }

  // Only allow reviews on products that are actually publicly reachable
  // (unmasked category) — same rule getPublicProduct() already enforces for reads.
  const product = await prisma.product.findFirst({
    where: { slug, category: { visible: true } },
    select: { id: true },
  });
  if (!product) throw new ProductNotFoundError("Product not found.");

  return prisma.review.create({
    data: {
      productId: product.id,
      customerName,
      rating: input.rating,
      comment,
      approved: false,
    },
    select: { id: true },
  });
}
