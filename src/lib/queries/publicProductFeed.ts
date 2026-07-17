import { getPublicProducts } from "@/lib/queries/publicProduct";

/**
 * GOOGLE MERCHANT CENTER PRODUCT FEED (§13 Phase 4).
 *
 * Deliberately built on top of `getPublicProducts()` rather than a new
 * Prisma query — that function already does the two things a feed can't
 * get wrong: excludes masked categories (§4) and never selects the
 * owner-only cost/rawPrice/sponsorSpend/profit fields (§3, §14.1). A feed
 * generator is exactly the kind of code that could accidentally leak those
 * if it queried Prisma directly, so it doesn't.
 *
 * One feed item per PRODUCT, not per variant. Google's spec supports a
 * fuller variant-level feed (separate item per color/size combination, tied
 * together with item_group_id + color/size attributes) — that's a
 * reasonable future enhancement if per-variant Shopping ads ever matter,
 * but it's real added complexity (variant-level availability, image
 * selection per color, etc.) that wasn't asked for here.
 */
export async function getMerchantFeedProducts() {
  return getPublicProducts();
}
