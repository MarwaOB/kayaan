import { notFound } from "next/navigation";

import { getPublicCategories, getPublicCategoryBySlug } from "@/lib/queries/publicCategory";
import { getPublicProducts } from "@/lib/queries/publicProduct";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { TopBanner } from "@/components/home/TopBanner";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";
import { ProductCard } from "@/components/shared/ProductCard";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [categories, category, products, homepageContent] = await Promise.all([
    getPublicCategories(),
    getPublicCategoryBySlug(params.slug),
    getPublicProducts({ categorySlug: params.slug }),
    getHomepageContent(),
  ]);

  if (!category) notFound();

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-kayaan-ink">{category.nameAr}</h1>
          <p className="mt-2 text-sm text-neutral-600">استعرض أفضل منتجات هذا القسم.</p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-kayaan-pink/30 p-10 text-center text-neutral-700">
            لا يوجد منتجات في هذا القسم حالياً. يرجى العودة لاحقاً.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}
