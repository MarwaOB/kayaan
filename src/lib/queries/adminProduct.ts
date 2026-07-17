import { prisma } from "@/lib/db";

/**
 * ADMIN PRODUCT QUERIES
 * ---------------------
 * Full row access, INCLUDING owner-only fields (costPrice, rawPrice,
 * sponsorSpend, profit). Every caller of these functions MUST sit behind
 * the /admin auth check (see src/app/api/admin/* route handlers) — these
 * functions do not check auth themselves.
 *
 * Never import this module from anything that serves the public storefront.
 * If a page/route needs product data for a shopper, use
 * src/lib/queries/publicProduct.ts instead.
 */
export async function getAdminProducts(options?: { search?: string }) {
  return prisma.product.findMany({
    where: options?.search
      ? {
          OR: [
            { name: { contains: options.search } },
            { variants: { some: { sku: { contains: options.search } } } },
          ],
        }
      : undefined,
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
      reviews: true,
      hotspotLinks: true,
    },
  });
}

export type AdminProductInput = {
  name: string;
  slug: string;
  description: string;
  careInstructions?: string | null;
  salePrice: number;
  discountPrice?: number | null;
  costPrice?: number | null;
  rawPrice?: number | null;
  sponsorSpend?: number | null;
  profit?: number | null;
  trending?: boolean;
  metaDescription?: string | null;
  categoryId: string;
  variants?: { id?: string; color: string; size: string; sku: string; stock: number }[];
  images?: string[];
};

/**
 * Admin product create/update take a flat shape (categoryId, variants[])
 * rather than raw Prisma nested-write syntax — the dashboard form posts
 * this directly. Variant diffing on update is intentionally simple: existing
 * variants (matched by id) are updated, new ones (no id) are created, and
 * any variant no longer present in the payload is deleted. Fine for a
 * single-admin dashboard; revisit if concurrent edits become a concern.
 */
export async function createAdminProduct(input: AdminProductInput) {
  const { categoryId, variants, images, ...fields } = input;
  return prisma.product.create({
    data: {
      ...fields,
      category: { connect: { id: categoryId } },
      variants: variants?.length ? { create: variants.map(({ id, ...v }) => v) } : undefined,
      images: images?.length ? { create: images.map((url, index) => ({ url, position: index })) } : undefined,
    },
    include: { category: true, variants: true, images: true },
  });
}

export async function updateAdminProduct(id: string, input: Partial<AdminProductInput>) {
  const { categoryId, variants, images, ...fields } = input;

  return prisma.$transaction(
    async (tx) => {
      if (variants) {
        const existing = await tx.productVariant.findMany({ where: { productId: id }, select: { id: true } });
        const keepIds = new Set(variants.filter((v) => v.id).map((v) => v.id));
        const toDelete = existing.filter((v) => !keepIds.has(v.id)).map((v) => v.id);
        if (toDelete.length) await tx.productVariant.deleteMany({ where: { id: { in: toDelete } } });

        // Fire all variant writes concurrently instead of one round-trip at a
        // time — this was the main cause of the transaction timing out
        // (P2028) once there were more than a couple of variants.
        await Promise.all(
          variants.map((v) =>
            v.id
              ? tx.productVariant.update({
                  where: { id: v.id },
                  data: { color: v.color, size: v.size, sku: v.sku, stock: v.stock },
                })
              : tx.productVariant.create({ data: { ...v, productId: id } })
          )
        );
      }

      if (images?.length) {
        const imageCount = await tx.productImage.count({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((url, index) => ({ productId: id, url, position: imageCount + index })),
        });
      }

      return tx.product.update({
        where: { id },
        data: {
          ...fields,
          ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
        },
        include: { category: true, variants: true, images: true },
      });
    },
    { timeout: 15000 } // headroom above the 5000ms default while the round-trips above stay sequential-ish in dev
  );
}

export async function deleteAdminProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

/** Category masking toggle (§4) — the actual admin feature that must be a click, not a code change. */
export async function setCategoryVisibility(categoryId: string, visible: boolean) {
  return prisma.category.update({ where: { id: categoryId }, data: { visible } });
}

/** Full category list for the admin dashboard (§4) — includes hidden ones, unlike publicCategory.ts. */
export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });
}