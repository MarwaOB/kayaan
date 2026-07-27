"use client";

import { useEffect, useRef, useState } from "react";
import { useFavorites, useStoreHydration } from "@/lib/store";
import { toListingProduct, type ListingProduct } from "@/lib/listing";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingEmpty, ProductGrid } from "@/components/listing/ProductGrid";
import { IconAlert } from "@/components/ui/Icon";
import type { EditorialFrame } from "@/lib/lookbook";

/**
 * Favourites (§8). No accounts, so the page holds product *IDs* in
 * localStorage and resolves them through the same owner-field-safe public API
 * everything else uses.
 *
 * Three things the old version got wrong, all of them about time:
 *
 * 1. It refetched the whole list on every heart tap, so un-favouriting one
 *    product blanked and rebuilt the grid. Resolved products are cached by ID
 *    and the *display* list is derived from `favoriteIds`, so removal is
 *    instant and re-adding within the session costs no request at all.
 * 2. It rendered "جاري التحميل..." in 14px grey. A skeleton in the shape of the
 *    grid tells you what is coming and keeps the layout from jumping when it
 *    arrives.
 * 3. It ignored a failed fetch entirely — the catch set an empty array, so a
 *    dropped connection was indistinguishable from having no favourites, and
 *    the page confidently told you that you had saved nothing. That is the
 *    worst possible lie for this particular page to tell.
 */
export function FavoritesView({ emptyFrame }: { emptyFrame: EditorialFrame | null }) {
  const favoriteIds = useFavorites((s) => s.favoriteIds);
  const hydrated = useStoreHydration((s) => s.hydrated);

  const [resolved, setResolved] = useState<Record<string, ListingProduct>>({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  // Every ID we have already asked the server about. Without this, an ID whose
  // product has since been deleted or masked never appears in the response,
  // stays "missing" forever, and the effect refetches on every render.
  const requested = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hydrated) return;

    const missing = favoriteIds.filter((id) => !requested.current.has(id));
    if (missing.length === 0) return;
    for (const id of missing) requested.current.add(id);

    let cancelled = false;
    setLoading(true);
    setFailed(false);

    fetch(`/api/products?ids=${missing.map(encodeURIComponent).join(",")}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { products?: Parameters<typeof toListingProduct>[0][] }) => {
        if (cancelled) return;
        setResolved((prev) => {
          const next = { ...prev };
          for (const product of data.products ?? []) next[product.id] = toListingProduct(product);
          return next;
        });
      })
      .catch(() => {
        if (cancelled) return;
        // Let them be retried — the failure was the network, not the ID.
        for (const id of missing) requested.current.delete(id);
        setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [favoriteIds, hydrated]);

  // Derived, not stored: the order is the order they were favourited in, and a
  // removed favourite disappears without waiting for a round-trip.
  const products = favoriteIds
    .map((id) => resolved[id])
    .filter((p): p is ListingProduct => Boolean(p));

  const settling = !hydrated || (loading && products.length === 0);

  return (
    <main>
      <ListingHero
        crumbs={[{ label: "الرئيسية", href: "/" }, { label: "المفضلة" }]}
        eyebrow="على هذا الجهاز"
        title="المفضلة"
        description="القطع التي حفظتها. تبقى محفوظة على هذا الجهاز وحده — بلا حساب وبلا تسجيل دخول."
        count={settling ? undefined : products.length}
      />

      {settling ? (
        <GridSkeleton />
      ) : failed && products.length === 0 ? (
        <LoadFailed />
      ) : products.length === 0 ? (
        <ListingEmpty
          title="مفضلتك فارغة"
          body="اضغط على القلب في أي قطعة لحفظها هنا، وارجع إليها متى شئت. لا تحتاج حساباً — نحفظها على جهازك."
          frame={emptyFrame}
          actionHref="/top-selling"
          actionLabel="ابدأ بالأكثر مبيعاً"
        />
      ) : (
        <>
          {failed && <PartialFailure />}
          <ProductGrid products={products} defaultSortLabel="ترتيب الإضافة" empty={null} />
        </>
      )}
    </main>
  );
}

/**
 * Placeholders in the shape of the grid they become, so nothing moves when the
 * products land. `animate-pulse` is opacity-only and the global reduced-motion
 * rule already flattens it (§5).
 */
function GridSkeleton() {
  return (
    <div className="container-k-wide py-10 md:py-14" aria-hidden="true">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-product rounded-md bg-surface-sunken" />
            <div className="mt-3 h-3.5 w-3/4 rounded-xs bg-surface-sunken" />
            <div className="mt-2 h-3.5 w-2/5 rounded-xs bg-surface-sunken" />
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadFailed() {
  return (
    <div className="container-k-wide py-16 text-center md:py-24">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-pill bg-surface-sunken text-brand-700">
        <IconAlert className="h-6 w-6" />
      </span>
      <h2 className="mt-5 font-display text-h1 text-ink">تعذّر تحميل مفضلتك</h2>
      <p className="mx-auto mt-3 max-w-[44ch] text-body text-ink-muted">
        قطعك محفوظة على جهازك ولم تُفقَد — المشكلة في الاتصال بالخادم فقط. تحقّق من الشبكة وأعد المحاولة.
      </p>
    </div>
  );
}

/** Some favourites resolved and some did not — say so instead of quietly dropping them. */
function PartialFailure() {
  return (
    <div className="container-k-wide pt-5">
      <p className="flex items-center gap-2 rounded-sm border border-line bg-surface-sunken px-4 py-3 text-body-sm text-ink-muted">
        <IconAlert className="h-[18px] w-[18px] shrink-0 text-warning" />
        تعذّر تحميل بعض القطع المحفوظة. أعد تحميل الصفحة لعرضها كاملة.
      </p>
    </div>
  );
}
