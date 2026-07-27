import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublicProduct, getPublicHotspotsForImage } from "@/lib/queries/publicProduct";
import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getBundlesForProduct } from "@/lib/queries/publicMerchandising";
import { getHomepageContent } from "@/lib/queries/siteSettings";

import { TopBanner } from "@/components/home/TopBanner";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";

import { Breadcrumb } from "@/components/product/Breadcrumb";
import { CategoryBar } from "@/components/product/CategoryBar";
import { ProductGallery, type GalleryHotspot } from "@/components/product/ProductGallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductInfoTabs } from "@/components/product/ProductInfoTabs";
import { ProductContactForm } from "@/components/product/ProductContactForm";
import { RelatedBundles } from "@/components/product/RelatedBundles";
import { ServiceMessage } from "@/components/product/ServiceMessage";
import { ProductReviews } from "@/components/product/ProductReviews";

// Product detail page — section order follows spec §7 exactly.
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getPublicProduct(params.slug);
  if (!product) notFound();

  const [categories, bundles, homepageContent, hotspotEntries] = await Promise.all([
    getPublicCategories(),
    getBundlesForProduct(product.id),
    getHomepageContent(),
    // Hotspots (§7 item 4) only apply to lifestyle photos, resolved per-image
    // via the same owner-field-safe query used everywhere else (§14.1) — a
    // linked product's card only ever needs a few of its safe fields, so we
    // narrow the shape here rather than re-querying Prisma directly.
    Promise.all(
      product.images
        .filter((img: { id: string; isLifestyle: boolean }) => img.isLifestyle)
        .map(async (img: { id: string }) => {
          const hotspots = await getPublicHotspotsForImage(img.id);
          const narrowed: GalleryHotspot[] = hotspots.map((h: Awaited<ReturnType<typeof getPublicHotspotsForImage>>[number]) => ({
            id: h.id,
            xPercent: h.xPercent,
            yPercent: h.yPercent,
            linkedProduct: {
              id: h.linkedProduct.id,
              slug: h.linkedProduct.slug,
              name: h.linkedProduct.name,
              salePrice: h.linkedProduct.salePrice,
              discountPrice: h.linkedProduct.discountPrice,
              images: h.linkedProduct.images.slice(0, 1),
            },
          }));
          return [img.id, narrowed] as [string, GalleryHotspot[]];
        })
    ),
  ]);

  const hotspotsByImage = Object.fromEntries(hotspotEntries);

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <main>
        {/* 1-2. Breadcrumb + swipeable category bar, together in one thin band
            so the gallery starts as high up the page as possible. */}
        <div className="border-b border-line">
          <div className="container-k-wide py-3">
            <Breadcrumb
              categoryName={product.category.nameAr}
              categorySlug={product.category.slug}
              productName={product.name}
            />
          </div>
        </div>
        <div className="border-b border-line">
          <div className="container-k-wide">
            <CategoryBar
              categories={categories.map((c: { slug: string; nameAr: string }) => ({ slug: c.slug, nameAr: c.nameAr }))}
              activeSlug={product.category.slug}
            />
          </div>
        </div>

        {/* Kith reference, mirrored for RTL: gallery takes the leading (right)
            column, details sit alongside on the left and stay pinned while the
            imagery scrolls past. Stacks in spec order on mobile. */}
        <div className="container-k-wide pb-16 pt-8 md:pt-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-14">
            {/* 3-4. Product image(s) + shop-the-look hotspots */}
            <ProductGallery images={product.images} hotspotsByImage={hotspotsByImage} />

            <div className="lg:sticky lg:top-28 lg:self-start">
              {/* 5-9. Name+price, description+size guide, delivery, colour/size, add to cart */}
              <PurchasePanel
                productId={product.id}
                productName={product.name}
                slug={product.slug}
                salePrice={product.salePrice}
                discountPrice={product.discountPrice}
                shortDescription={product.description.slice(0, 140)}
                variants={product.variants}
                imageUrl={product.images[0]?.url}
              />

              {/* 10. Description / care / shipping accordions */}
              <ProductInfoTabs
                description={product.description}
                careInstructions={product.careInstructions}
              />
            </div>
          </div>
        </div>

        {/* 11. Contact form — separate section */}
        <ProductContactForm productName={product.name} />

        {/* 12. Related bundles — separate section */}
        <RelatedBundles bundles={bundles} />

        {/* 13. Our service + message */}
        <ServiceMessage />

        {/* 14. Client feedback, under each product */}
        <ProductReviews reviews={product.reviews} slug={product.slug} />
      </main>

      {/* 15. Footer */}
      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getPublicProduct(params.slug);
  if (!product) return {};

  return {
    title: `${product.name} | كيان`,
    // §3: metaDescription is exposed only inside <meta>, never rendered on the page itself.
    description: product.metaDescription ?? product.description.slice(0, 160),
  };
}
