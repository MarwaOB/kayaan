import { prisma } from "@/lib/db";

/**
 * ADMIN COLLECTION QUERIES
 * ------------------------
 * Collections were fully modeled and live on the storefront
 * (/collections/[slug], homepage) but had NO admin management surface until
 * now — the only way to create one was directly in the database. This is
 * plain CRUD + a product-assignment endpoint, same shape as adminCoupon.ts.
 */
export async function listCollections() {
  return prisma.collection.findMany({
    include: { products: { include: { product: true }, orderBy: { position: "asc" } } },
    orderBy: { position: "asc" },
  });
}

export type CollectionInput = {
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  coverImage?: string;
  visible?: boolean;
  position?: number;
};

export async function createCollection(input: CollectionInput) {
  return prisma.collection.create({ data: input });
}

export async function updateCollection(id: string, input: Partial<CollectionInput>) {
  return prisma.collection.update({ where: { id }, data: input });
}

export async function deleteCollection(id: string) {
  return prisma.collection.delete({ where: { id } });
}

/** Replaces the full product list for a collection — position = array order. */
export async function setCollectionProducts(id: string, productIds: string[]) {
  return prisma.$transaction([
    prisma.collectionProduct.deleteMany({ where: { collectionId: id } }),
    prisma.collectionProduct.createMany({
      data: productIds.map((productId, position) => ({ collectionId: id, productId, position })),
    }),
  ]);
}
