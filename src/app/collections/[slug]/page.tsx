import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getPublicCollectionBySlug } from "@/lib/queries/publicMerchandising";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { TopBanner } from "@/components/home/TopBanner";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingEmpty, ProductGrid } from "@/components/listing/ProductGrid";
import { toListingProduct } from "@/lib/listing";
import { editorialFrames, frameOffset, toEditorialFrame, STATEMENT_SHOT, type EditorialFrame } from "@/lib/lookbook";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = await getPublicCollectionBySlug(params.slug);
  if (!collection) return {};
  const name = collection.nameAr ?? collection.name;
  return {
    title: `${name} | كيان`,
    description: collection.description ?? `تشكيلة ${name} من كيان.`,
  };
}

/**
 * Collection listing (spec §6.9).
 *
 * A collection is a curated statement, not a warehouse shelf — so unlike the
 * category page it keeps its own order as the default sort ("ترتيب التشكيلة"),
 * and it leads with the admin's cover image where one exists rather than
 * substituting a stock shot from the lookbook.
 */
export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const [categories, collection, homepageContent] = await Promise.all([
    getPublicCategories(),
    getPublicCollectionBySlug(params.slug),
    getHomepageContent(),
  ]);

  if (!collection) notFound();

  const name = collection.nameAr ?? collection.name;

  // The admin's own cover wins. Only when there isn't one does the page borrow
  // a lookbook frame — an editorial page with no image at the top is not an
  // option, and a grey placeholder is worse than a borrowed photograph.
  const hero: EditorialFrame | null = collection.coverImage
    ? { src: collection.coverImage, alt: name }
    : toEditorialFrame(STATEMENT_SHOT);

  const editorial = editorialFrames(2, frameOffset(params.slug), [name]);

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <main>
        <ListingHero
          crumbs={[{ label: "الرئيسية", href: "/" }, { label: name }]}
          eyebrow="تشكيلة"
          title={name}
          description={collection.description ?? "قطع مختارة معاً، بنفس الروح."}
          count={collection.products.length}
          frame={hero}
        />

        <ProductGrid
          products={collection.products.map(toListingProduct)}
          defaultSortLabel="ترتيب التشكيلة"
          editorial={editorial}
          empty={
            <ListingEmpty
              title="التشكيلة قيد التحضير"
              body="لم تُضَف قطع هذه التشكيلة بعد. عُد قريباً — أو تصفّح ما هو متاح الآن في المتجر."
              frame={hero}
            />
          }
        />
      </main>

      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}
