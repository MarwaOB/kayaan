"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/lib/store";
import { ProductCard, type ProductCardData } from "@/components/shared/ProductCard";

/**
 * Favorites page (§8) — no accounts, so favorited product IDs live in
 * localStorage via `useFavorites`. This page resolves those IDs back to
 * full product data through the same owner-field-safe public API used
 * everywhere else, then renders them with the normal ProductCard.
 */
export default function FavoritesPage() {
  const favoriteIds = useFavorites((s) => s.favoriteIds);
  const [products, setProducts] = useState<ProductCardData[] | null>(null);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setProducts([]);
      return;
    }
    fetch(`/api/products?ids=${favoriteIds.join(",")}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch(() => setProducts([]));
  }, [favoriteIds]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-xl font-bold">المفضلة</h1>

      {products === null ? (
        <p className="text-sm text-neutral-400">جاري التحميل...</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-5xl">🤍</p>
          <p className="text-lg font-bold">لا توجد عناصر في المفضلة</p>
          <Link href="/" className="rounded-full bg-kayaan-brown px-6 py-2.5 text-sm font-bold text-white">
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
