import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getPublicProducts } from "@/lib/queries/publicProduct";
import { getPublicBundles, getPublicCollections } from "@/lib/queries/publicMerchandising";
import { getHomepageContent } from "@/lib/queries/siteSettings";

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

// Home page — section order follows spec §6 exactly, top to bottom.
export default async function Home() {
  const [categories, newDrops, trending, bundles, collections, homepageContent] = await Promise.all([
    getPublicCategories(),
    getPublicProducts({ take: 8 }),
    getPublicProducts({ trendingOnly: true, take: 4 }),
    getPublicBundles(),
    getPublicCollections(),
    getHomepageContent(),
  ]);

  return (
    <>
      {/* 1. Top banner */}
      <TopBanner messages={homepageContent.bannerMessages} />
      {/* 2. Header */}
      <Header categories={categories} />

      <main>
        {/* 3. Hero cover / carousel */}
        <HeroCarousel slides={homepageContent.heroSlides} />
        {/* 4. New drops carousel */}
        <NewDropsCarousel products={newDrops} />
        {/* 5. Embedded video AND running bar, stacked */}
        <VideoAndRunningBar videoUrl={homepageContent.videoUrl} items={homepageContent.runningBarItems} />
        {/* 6. Categories */}
        <CategoryTiles categories={categories} />
        {/* 7. Top Selling — top 4 individual products */}
        <TopSelling products={trending} />
        {/* 8. Bundles/Duos — separate section, directly under Top Selling */}
        <BundlesSection bundles={bundles} />
        {/* 9. Collections carousel */}
        <CollectionsCarousel collections={collections} />
        {/* 10. Client feedback / testimonials */}
        <Testimonials testimonials={homepageContent.testimonials} />
        {/* 11. Why choose us */}
        <WhyChooseUs />
        {/* 12. Follow us on Instagram / coupon / promo callout */}
        <InstagramCallout />
      </main>

      {/* 13. Footer */}
      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}
