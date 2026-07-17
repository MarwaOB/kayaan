import { prisma } from "@/lib/db";

/**
 * PUBLIC PRODUCT QUERIES
 * ----------------------
 * Spec §3 / §14.1: costPrice, rawPrice, sponsorSpend, and profit must NEVER
 * reach the browser. The only safe way to guarantee that is to never ask
 * Prisma for them in the first place — an explicit `select` allowlist, not
 * a `findMany()`/`findUnique()` that returns the whole row and relies on
 * the frontend to hide fields.
 *
 * DO NOT change PUBLIC_PRODUCT_SELECT to use `include` or spread `...`.
 * DO NOT add cost/rawPrice/sponsorSpend/profit to this object.
 * See tests/publicProduct.test.ts, which asserts this at the CI level (§14.1).
 */
export const PUBLIC_PRODUCT_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  careInstructions: true,
  salePrice: true,
  discountPrice: true,
  trending: true,
  metaDescription: true, // exposed only for <meta>, rendering is the frontend's job
  category: {
    select: { id: true, name: true, nameAr: true, slug: true },
  },
  images: {
    select: { id: true, url: true, altText: true, position: true, isLifestyle: true },
    orderBy: { position: "asc" as const },
  },
  variants: {
    select: { id: true, color: true, size: true, stock: true },
  },
  reviews: {
    where: { approved: true },
    select: { id: true, customerName: true, rating: true, comment: true, createdAt: true },
    orderBy: { createdAt: "desc" as const },
  },
} satisfies import("@prisma/client").Prisma.ProductSelect;

export type PublicProduct = Awaited<ReturnType<typeof getPublicProduct>>;

/** Derives a simple in-stock/out-of-stock flag from variant stock levels (§3, §5). */
function withComputedStock<T extends { variants: { stock: number }[] }>(product: T) {
  return {
    ...product,
    inStock: product.variants.some((v) => v.stock > 0),
  };
}

/**
 * Fetch a single product for the storefront by its SEO slug.
 * Returns null if the product doesn't exist OR its category is currently
 * masked (§4) — a masked category's products shouldn't be reachable even
 * via a direct/shared link.
 */
export async function getPublicProduct(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, category: { visible: true } },
    select: PUBLIC_PRODUCT_SELECT,
  });

  if (!product) return null;
  return withComputedStock(product);
}

/**
 * Fetch products for storefront listings (category grids, Top Selling,
 * collections, etc). Only ever returns products in unmasked categories.
 */
export async function getPublicProducts(options?: {
  categorySlug?: string;
  trendingOnly?: boolean;
  ids?: string[];
  take?: number;
}) {
  const products = await prisma.product.findMany({
    where: {
      category: {
        visible: true,
        ...(options?.categorySlug ? { slug: options.categorySlug } : {}),
      },
      ...(options?.trendingOnly ? { trending: true } : {}),
      ...(options?.ids ? { id: { in: options.ids } } : {}),
    },
    select: PUBLIC_PRODUCT_SELECT,
    take: options?.take,
    orderBy: { createdAt: "desc" },
  });

  return products.map(withComputedStock);
}

/**
 * Favorites (§8) — the storefront only ever holds product IDs client-side
 * (localStorage). This resolves those IDs back to full public product data
 * for rendering the favorites page, still going through the same masked-
 * category + owner-field-safe select as everything else.
 */
export async function getPublicProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const products = await getPublicProducts({ ids });
  // Preserve the client's favorite order rather than DB order.
  const byId = new Map(products.map((p: (typeof products)[number]) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}

/** Hotspots for a lifestyle image, resolved to their linked public product (§7 item 4). */
export async function getPublicHotspotsForImage(imageId: string) {
  const hotspots = await prisma.hotspot.findMany({
    where: { imageId, linkedProduct: { category: { visible: true } } },
    select: {
      id: true,
      xPercent: true,
      yPercent: true,
      linkedProduct: { select: PUBLIC_PRODUCT_SELECT },
    },
  });

  return hotspots.map((h: (typeof hotspots)[number]) => ({
    id: h.id,
    xPercent: h.xPercent,
    yPercent: h.yPercent,
    linkedProduct: withComputedStock(h.linkedProduct),
  }));
}
