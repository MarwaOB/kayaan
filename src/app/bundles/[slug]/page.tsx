import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getPublicBundleBySlug } from "@/lib/queries/publicMerchandising";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { TopBanner } from "@/components/home/TopBanner";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";
import { ProductCard } from "@/components/shared/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { IconWhatsApp } from "@/components/ui/Icon";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingEmpty } from "@/components/listing/ProductGrid";
import { toListingProduct } from "@/lib/listing";
import { formatDZD, formatNumber } from "@/lib/format";
import { LOOKBOOK, toEditorialFrame, type EditorialFrame } from "@/lib/lookbook";
import { CONTACT } from "@/data/site-pages";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const bundle = await getPublicBundleBySlug(params.slug);
  if (!bundle) return {};
  return {
    title: `${bundle.name} | كيان`,
    description: bundle.description ?? `عرض ${bundle.name} من كيان بسعر خاص.`,
  };
}

/**
 * Bundle / duo page (spec §6.8).
 *
 * The old page showed the bundle price as a small pink pill and then a grid of
 * product cards, each nested inside its own bordered white box — so the one
 * number that justifies a bundle's existence, *what you save by buying it
 * together*, was never on the page at all. A customer had to add up three
 * product cards in their head to find out whether the offer was an offer.
 *
 * The saving is now the headline: full price struck through, bundle price set
 * as the primary figure, and the difference stated in both dinars and percent.
 * All three are derived from the same item list rendered below, so the maths is
 * always the maths of what is actually shown.
 */
export default async function BundlePage({ params }: { params: { slug: string } }) {
  const [categories, bundle, homepageContent] = await Promise.all([
    getPublicCategories(),
    getPublicBundleBySlug(params.slug),
    getHomepageContent(),
  ]);

  if (!bundle) notFound();

  // Sum what these items cost bought separately, at whatever each one is
  // selling for today — comparing against the pre-discount price would inflate
  // the saving with a discount the customer could have had anyway.
  const separately = bundle.items.reduce(
    (total, item) => total + (item.product.discountPrice ?? item.product.salePrice) * item.quantity,
    0,
  );
  const savings = Math.max(separately - bundle.bundlePrice, 0);
  const savingsPercent = separately > 0 ? Math.round((savings / separately) * 100) : 0;
  const pieces = bundle.items.reduce((total, item) => total + item.quantity, 0);

  const hero: EditorialFrame | null = bundle.coverImage
    ? { src: bundle.coverImage, alt: bundle.name }
    : toEditorialFrame(LOOKBOOK[1] ?? null);

  const orderHref = `${CONTACT.whatsappHref}?text=${encodeURIComponent(
    `السلام عليكم، أريد طلب عرض «${bundle.name}» بسعر ${formatDZD(bundle.bundlePrice)}.`,
  )}`;

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <main>
        <ListingHero
          crumbs={[{ label: "الرئيسية", href: "/" }, { label: bundle.name }]}
          eyebrow="عرض"
          title={bundle.name}
          description={bundle.description ?? "قطع مختارة معاً بسعر أقل من شرائها منفردة."}
          frame={hero}
        />

        {/* ---- The offer ------------------------------------------------- */}
        <section aria-label="تفاصيل العرض" className="border-b border-line bg-surface">
          <div className="container-k-wide grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-center md:py-12">
            <div>
              <p className="text-caption text-brand-600">سعر العرض</p>

              <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-display text-display-2 tabular text-brand-800">
                  {formatDZD(bundle.bundlePrice)}
                </span>
                {savings > 0 && (
                  <span className="tabular text-body-lg text-ink-subtle line-through">
                    {formatDZD(separately)}
                  </span>
                )}
              </div>

              {savings > 0 && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-xs bg-danger px-3 py-1.5 text-caption text-white">
                  توفّر {formatDZD(savings)}
                  {savingsPercent > 0 && <span className="tabular">— {formatNumber(savingsPercent)}٪</span>}
                </p>
              )}

              <p className="mt-4 text-body-sm text-ink-muted">
                {pieces > 0 && `${formatNumber(pieces)} قطع في العرض · `}
                الدفع عند الاستلام · توصيل لكل الولايات
              </p>
            </div>

            {/* A bundle spans several products, each with its own colour and
                size, so there is no single variant to put in the cart — the
                order is completed on WhatsApp, the same channel that confirms
                every order on this store (spec §13). */}
            <div className="md:justify-self-end">
              <a
                href={orderHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-brand-700 px-7 text-body-sm font-semibold text-white transition-colors duration-fast ease-k hover:bg-brand-800 md:w-auto"
              >
                <IconWhatsApp className="h-[18px] w-[18px]" />
                اطلب العرض عبر واتساب
              </a>
              <p className="mt-3 max-w-[34ch] text-caption text-ink-muted">
                نؤكّد معك المقاسات والألوان قبل الإرسال.
              </p>
            </div>
          </div>
        </section>

        {/* ---- What's inside --------------------------------------------- */}
        {bundle.items.length === 0 ? (
          <ListingEmpty
            title="العرض قيد التحضير"
            body="لم تُضَف قطع هذا العرض بعد. تصفّح بقية المتجر في الأثناء."
            frame={hero}
          />
        ) : (
          <section className="container-k-wide py-14 md:py-20">
            <div className="mb-8 flex items-center gap-3 md:mb-12">
              <h2 className="font-display text-display-2 text-ink">ما يحتويه العرض</h2>
              <span className="h-px flex-1 bg-line-strong" aria-hidden="true" />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-14 xl:grid-cols-4">
              {bundle.items.map((item, i) => (
                <Reveal key={item.product.id} delay={(i % 4) * 70}>
                  {/* The quantity sits above the card rather than as a badge on
                      the image, where it would land on the discount badge. */}
                  <p className="mb-2 text-caption tabular text-brand-600">
                    الكمية: {formatNumber(item.quantity)}
                  </p>
                  <ProductCard product={toListingProduct(item.product)} priority={i < 4} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}
