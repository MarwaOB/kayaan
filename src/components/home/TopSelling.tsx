import { ProductCard, type ProductCardData } from "@/components/shared/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LOOKBOOK } from "@/lib/lookbook";

/** Fallbacks only render before the catalogue is seeded — real photography, not grey SVGs. */
const FALLBACK_PRODUCTS: ProductCardData[] = [
  {
    id: "fallback-hoodie",
    slug: "hoodie-jazairi",
    name: "هودي «جزائري»",
    salePrice: 4500,
    discountPrice: 3800,
    trending: true,
    inStock: true,
    images: [{ url: LOOKBOOK[5]?.image.src ?? "", altText: "هودي جزائري" }],
  },
  {
    id: "fallback-tshirt",
    slug: "tshirt-kayaan-arabic",
    name: "تيشيرت «حرية»",
    salePrice: 2800,
    discountPrice: null,
    trending: false,
    inStock: true,
    images: [{ url: LOOKBOOK[0]?.image.src ?? "", altText: "تيشيرت حرية" }],
  },
  {
    id: "fallback-totebag",
    slug: "totebag-hikma",
    name: "تيشيرت كيان الصيفي",
    salePrice: 1800,
    discountPrice: null,
    trending: false,
    inStock: true,
    images: [{ url: LOOKBOOK[1]?.image.src ?? "", altText: "تيشيرت كيان" }],
  },
  {
    id: "fallback-jogger",
    slug: "joggers",
    name: "هودي كيان الأبيض",
    salePrice: 3200,
    discountPrice: null,
    trending: false,
    inStock: false,
    images: [{ url: LOOKBOOK[2]?.image.src ?? "", altText: "هودي كيان" }],
  },
];

/** Top selling (spec §6.7) — top 4 individual products, with "view more". */
export function TopSelling({ products }: { products: ProductCardData[] }) {
  const visibleProducts = products.length > 0 ? products.slice(0, 4) : FALLBACK_PRODUCTS;

  return (
    <section className="section-k">
      <div className="container-k-wide">
        <SectionHeader
          index={4}
          title="الأكثر مبيعاً"
          subtitle="القطع التي اختارها عملاؤنا أكثر من غيرها."
          actionHref="/top-selling"
          actionLabel="عرض المزيد"
        />

        {/* Falls back to fewer columns when the catalogue has fewer than four
            trending products, rather than leaving empty cells. */}
        <div
          className={`grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-5 ${
            visibleProducts.length >= 4
              ? "md:grid-cols-4"
              : visibleProducts.length === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-2"
          }`}
        >
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
