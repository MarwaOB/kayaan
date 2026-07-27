import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getPublicProducts } from "@/lib/queries/publicProduct";
import { getPublicBundles, getPublicCollections } from "@/lib/queries/publicMerchandising";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { getPublicReviewSummary } from "@/lib/queries/publicReview";

import { TopBanner } from "@/components/home/TopBanner";
import { Header } from "@/components/home/Header";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { NewDropsCarousel } from "@/components/home/NewDropsCarousel";
import { VideoAndRunningBar } from "@/components/home/VideoAndRunningBar";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { TopSelling } from "@/components/home/TopSelling";
import { BundlesSection } from "@/components/home/BundlesSection";
import { CollectionsCarousel } from "@/components/home/CollectionsCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs, InstagramCallout } from "@/components/home/WhyChooseUsAndInstagram";
import { Footer } from "@/components/home/Footer";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";
import { Reveal } from "@/components/ui/Reveal";

// Home page — section order follows spec §6 exactly, top to bottom.
export default async function Home() {
  const [categories, newDrops, trending, bundles, collections, homepageContent, reviewSummary] =
    await Promise.all([
      getPublicCategories(),
      getPublicProducts({ take: 8 }),
      getPublicProducts({ trendingOnly: true, take: 4 }),
      getPublicBundles(),
      getPublicCollections(),
      getHomepageContent(),
      getPublicReviewSummary(),
    ]);

  return (
    <>
      {/* 1. Top banner */}
      <TopBanner messages={homepageContent.bannerMessages} />
      {/* 2. Header */}
      <Header categories={categories} />

      {/* Everything below the fold arrives on scroll (components/ui/Reveal).
          The hero is deliberately not wrapped — it is the LCP element and must
          paint immediately. */}
      <main>
        {/* 3. Hero cover / carousel */}
        <HeroCarousel slides={homepageContent.heroSlides} />
        {/* 4. New drops carousel */}
        <Reveal>
          <NewDropsCarousel products={newDrops} />
        </Reveal>
        {/* 5. Embedded video AND running bar, stacked */}
        <Reveal>
          <VideoAndRunningBar videoUrl={homepageContent.videoUrl} items={homepageContent.runningBarItems} />
        </Reveal>
        {/* 6. Categories */}
        <Reveal>
          <CategoryTiles categories={categories} />
        </Reveal>
        {/* 7. Top Selling — top 4 individual products */}
        <Reveal>
          <TopSelling products={trending} />
        </Reveal>
        {/* 8. Bundles/Duos — separate section, directly under Top Selling */}
        <Reveal>
          <BundlesSection bundles={bundles} />
        </Reveal>
        {/* 9. Collections carousel */}
        <Reveal>
          <CollectionsCarousel collections={collections} />
        </Reveal>
        {/* 10. Client feedback / testimonials */}
        <Reveal>
          <Testimonials testimonials={homepageContent.testimonials} reviewSummary={reviewSummary} />
        </Reveal>
        {/* 11. Why choose us */}
        <Reveal>
          <WhyChooseUs />
        </Reveal>
        {/* 12. Follow us on Instagram / coupon / promo callout */}
        <Reveal>
          <InstagramCallout />
        </Reveal>
      </main>

      {/* 13. Footer */}
      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}
