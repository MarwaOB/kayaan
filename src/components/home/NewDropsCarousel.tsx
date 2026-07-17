import { ProductCard, type ProductCardData } from "@/components/shared/ProductCard";

/** New drops carousel (§6.4) — 2-row grid of newest products, horizontally scrollable. */
export function NewDropsCarousel({ products }: { products: ProductCardData[] }) {
  if (products.length === 0) return null;

  return (
    <section className="px-4 py-8">
      <h2 className="mb-4 text-lg font-bold">أحدث الإصدارات</h2>
      <div className="grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-2" style={{ gridAutoColumns: "45%" }}>
        {products.map((p) => (
          <div key={p.id} className="w-full sm:w-56">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
