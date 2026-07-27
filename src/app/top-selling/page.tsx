import type { Metadata } from "next";

import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { getPublicProducts } from "@/lib/queries/publicProduct";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { TopBanner } from "@/components/home/TopBanner";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";
import { ProductCard } from "@/components/shared/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { ListingHero } from "@/components/listing/ListingHero";
import { CategoryRail } from "@/components/listing/CategoryRail";
import { ListingEmpty, ProductGrid } from "@/components/listing/ProductGrid";
import { toListingProduct, type ListingProduct } from "@/lib/listing";
import { editorialFrames, HERO_SHOTS, toEditorialFrame } from "@/lib/lookbook";
import { toArabicIndex } from "@/lib/format";

export const metadata: Metadata = {
  title: "الأكثر مبيعاً | كيان",
  description: "القطع التي اختارها عملاء كيان أكثر من غيرها — الترتيب الحالي.",
};

/**
 * Top selling (spec §6.7 "view more" destination).
 *
 * The one listing page where *order is the content*. A flat grid throws that
 * away — every tile the same size says every product is equally popular, which
 * is the opposite of what the page is for. So the first three are ranked
 * explicitly, with the numeral set as a wall label above the card rather than
 * as a badge over the photograph, where it would collide with the discount
 * badge on the leading corner and the favourite button on the trailing one.
 */
export default async function TopSellingPage() {
  const [categories, products, homepageContent] = await Promise.all([
    getPublicCategories(),
    getPublicProducts({ trendingOnly: true, take: 20 }),
    getHomepageContent(),
  ]);

  const listing = products.map(toListingProduct);
  const podium = listing.slice(0, 3);
  const rest = listing.slice(3);
  const hero = toEditorialFrame(HERO_SHOTS[1] ?? HERO_SHOTS[0] ?? null);

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <main>
        <ListingHero
          crumbs={[{ label: "الرئيسية", href: "/" }, { label: "الأكثر مبيعاً" }]}
          eyebrow="الترتيب الحالي"
          title="الأكثر مبيعاً"
          description="القطع التي اختارها عملاؤنا أكثر من غيرها هذا الموسم."
          count={listing.length}
          frame={hero}
        />

        <CategoryRail categories={categories} activeSlug="top-selling" />

        {listing.length === 0 ? (
          <ListingEmpty
            title="الترتيب يُحسَب الآن"
            body="لم تُحدَّد قطع رائجة بعد. تصفّح الأقسام — كل ما في المتجر جديد."
            frame={hero}
          />
        ) : (
          <>
            <Podium products={podium} />

            {rest.length > 0 && (
              <ProductGrid
                products={rest}
                defaultSortLabel="ترتيب المبيعات"
                editorial={editorialFrames(1, 3, ["الأكثر طلباً هذا الموسم"])}
                empty={null}
              />
            )}
          </>
        )}
      </main>

      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}

/**
 * The first three, ranked. Number one takes the full row on mobile — the
 * hierarchy has to survive at 360px, where three equal tiles would flatten it
 * back out and leave an orphan in a two-column grid.
 */
function Podium({ products }: { products: ListingProduct[] }) {
  return (
    <section aria-label="المراكز الثلاثة الأولى" className="container-k-wide pb-4 pt-10 md:pb-8 md:pt-14">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={i * 80} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
            <div className="mb-3 flex items-center gap-3">
              {/* Arabic-Indic here for the same reason as SectionHeader: it is
                  an editorial mark, not a value the customer reads as data. */}
              <span className="font-display text-h2 tabular text-brand-600">{toArabicIndex(i + 1)}</span>
              <span className="h-px flex-1 bg-line-strong" aria-hidden="true" />
            </div>
            <ProductCard product={product} priority={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
