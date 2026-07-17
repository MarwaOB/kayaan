import { notFound } from "next/navigation";

import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getPublicBundleBySlug } from "@/lib/queries/publicMerchandising";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { TopBanner } from "@/components/home/TopBanner";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";
import { ProductCard } from "@/components/shared/ProductCard";

export default async function BundlePage({ params }: { params: { slug: string } }) {
  const [categories, bundle, homepageContent] = await Promise.all([
    getPublicCategories(),
    getPublicBundleBySlug(params.slug),
    getHomepageContent(),
  ]);

  if (!bundle) notFound();

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-kayaan-ink">{bundle.name}</h1>
              <p className="mt-2 text-sm text-neutral-600">{bundle.description ?? "عرض bundle مختار مع سعر مميز."}</p>
            </div>
            <span className="rounded-full bg-kayaan-pink px-4 py-2 text-sm font-semibold text-kayaan-brown">
              {bundle.bundlePrice.toLocaleString("ar-DZ")} د.ج
            </span>
          </div>
        </div>

        {bundle.items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-kayaan-pink/30 p-10 text-center text-neutral-700">
            لم يتم إضافة منتجات لهذا العرض بعد.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bundle.items.map((item) => (
              <div key={item.product.id} className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
                <ProductCard product={item.product} />
                <p className="mt-3 text-sm text-neutral-700">العدد: {item.quantity}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}
