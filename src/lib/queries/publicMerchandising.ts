import { prisma } from "@/lib/db";
import { PUBLIC_PRODUCT_SELECT } from "@/lib/queries/publicProduct";

function withComputedStock<T extends { variants: { stock: number }[] }>(product: T) {
  return {
    ...product,
    inStock: product.variants.some((v) => v.stock > 0),
  };
}

/** Bundles/Duos (§6.8) — storefront listing. */
export async function getPublicBundles() {
  return prisma.bundle.findMany({
    where: { visible: true },
    select: { id: true, slug: true, name: true, bundlePrice: true, coverImage: true },
    orderBy: { createdAt: "desc" },
  });
}

/** Bundles page (§6.8) — details for a single bundle URL. */
export async function getPublicBundleBySlug(slug: string) {
  const bundle = await prisma.bundle.findFirst({
    where: { slug, visible: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      bundlePrice: true,
      coverImage: true,
      items: {
        select: {
          quantity: true,
          product: { select: PUBLIC_PRODUCT_SELECT },
        },
        orderBy: { quantity: "desc" },
      },
    },
  });

  if (!bundle) return null;

  return {
    ...bundle,
    items: bundle.items.map((item) => ({
      ...item,
      product: withComputedStock(item.product),
    })),
  };
}

/** Collections carousel (§6.9) — admin-created, not fixed. */
export async function getPublicCollections() {
  return prisma.collection.findMany({
    where: { visible: true },
    select: { id: true, slug: true, name: true, nameAr: true, coverImage: true },
    orderBy: { position: "asc" },
  });
}

/** Collection page (§6.9) — details for a single collection URL. */
export async function getPublicCollectionBySlug(slug: string) {
  const collection = await prisma.collection.findFirst({
    where: { slug, visible: true },
    select: {
      id: true,
      name: true,
      nameAr: true,
      slug: true,
      description: true,
      coverImage: true,
      products: {
        orderBy: { position: "asc" },
        select: { product: { select: PUBLIC_PRODUCT_SELECT } },
      },
    },
  });

  if (!collection) return null;

  return {
    ...collection,
    products: collection.products.map((entry) => withComputedStock(entry.product)),
  };
}

/** Related bundles for a product detail page (§7 item 12) — bundles this product is part of. */
export async function getBundlesForProduct(productId: string) {
  return prisma.bundle.findMany({
    where: { visible: true, items: { some: { productId } } },
    select: { id: true, slug: true, name: true, bundlePrice: true, coverImage: true },
    orderBy: { createdAt: "desc" },
  });
}
