import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/shared/ProductCard";

/** Top Selling (§6.7) — top 4 individual products (not collections), with a "view more" link. */
export function TopSelling({ products }: { products: ProductCardData[] }) {
  const visibleProducts = products.length > 0 ? products.slice(0, 4) : [
    { id: "fallback-hoodie", slug: "hoodie-jazairi", name: 'هوودي "جزائري"', salePrice: 4500, discountPrice: 3800, trending: true, inStock: true, images: [{ url: "/images/seed/hoodie.svg", altText: "هوودي جزائري" }] },
    { id: "fallback-tshirt", slug: "tshirt-kayaan-arabic", name: "تيشيرت خط عربي", salePrice: 2800, discountPrice: null, trending: false, inStock: true, images: [{ url: "/images/seed/tshirt.svg", altText: "تيشيرت عربي" }] },
    { id: "fallback-totebag", slug: "totebag-hikma", name: 'توت باغ "حكمة"', salePrice: 1800, discountPrice: null, trending: false, inStock: true, images: [{ url: "/images/seed/totebag.svg", altText: "توت باغ" }] },
    { id: "fallback-jogger", slug: "joggers", name: "Jogger", salePrice: 3200, discountPrice: null, trending: false, inStock: false, images: [{ url: "/images/seed/jogger.svg", altText: "Jogger" }] },
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-kayaan-brown">Best Sellers</p>
          <h2 className="text-xl font-bold text-kayaan-ink">الأكثر مبيعاً</h2>
        </div>
        <Link href="/top-selling" className="text-sm font-semibold text-kayaan-brown transition hover:text-kayaan-brownDark">
          عرض المزيد
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {visibleProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
