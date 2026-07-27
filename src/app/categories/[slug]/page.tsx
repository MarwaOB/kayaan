import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPublicCategories, getPublicCategoryBySlug } from "@/lib/queries/publicCategory";
import { getPublicProducts } from "@/lib/queries/publicProduct";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { TopBanner } from "@/components/home/TopBanner";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";
import { ListingHero } from "@/components/listing/ListingHero";
import { CategoryRail } from "@/components/listing/CategoryRail";
import { ListingEmpty, ProductGrid } from "@/components/listing/ProductGrid";
import { toListingProduct } from "@/lib/listing";
import { categoryShot, editorialFrames, frameOffset, toEditorialFrame } from "@/lib/lookbook";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getPublicCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: `${category.nameAr} | كيان`,
    description: `تصفّح قطع ${category.nameAr} من كيان — توصيل لكل الولايات والدفع عند الاستلام.`,
  };
}

/**
 * Category listing (spec §4, §5).
 *
 * Was: a white `rounded-3xl` box holding a 24px title, then an unfiltered,
 * unsorted grid, with no route to any other category except back through the
 * header. Now it opens with the section's own photograph, carries its siblings
 * with it, and can actually be narrowed.
 */
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [categories, category, products, homepageContent] = await Promise.all([
    getPublicCategories(),
    getPublicCategoryBySlug(params.slug),
    getPublicProducts({ categorySlug: params.slug }),
    getHomepageContent(),
  ]);

  if (!category) notFound();

  const position = Math.max(
    categories.findIndex((c) => c.slug === params.slug),
    0,
  );
  const hero = toEditorialFrame(categoryShot(params.slug, position));

  // Offset from the slug so two categories visited in a row don't break on the
  // same photograph — and offset past the hero so the page never shows one
  // frame twice.
  const editorial = editorialFrames(2, frameOffset(params.slug) + 1, [
    `${category.nameAr} — بطابع كيان`,
  ]);

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <main>
        <ListingHero
          crumbs={[
            { label: "الرئيسية", href: "/" },
            { label: category.nameAr },
          ]}
          eyebrow="القسم"
          title={category.nameAr}
          // No manufacturing claim: the spec records where the brand is from,
          // not where the garments are made, and a storefront must not invent
          // provenance.
          description={`كل قطع ${category.nameAr} المتوفرة الآن في متجر كيان.`}
          count={products.length}
          frame={hero}
        />

        <CategoryRail categories={categories} activeSlug={params.slug} />

        <ProductGrid
          products={products.map(toListingProduct)}
          defaultSortLabel="الأحدث"
          editorial={editorial}
          empty={
            <ListingEmpty
              title="هذا القسم في طريقه إليك"
              body={`لم تُضَف قطع ${category.nameAr} بعد. تصفّح بقية الأقسام في الأثناء، أو تابعنا لتعرف موعد الإطلاق أولاً.`}
              frame={hero}
              actionHref="/top-selling"
              actionLabel="شاهد الأكثر مبيعاً"
            />
          }
        />
      </main>

      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}
