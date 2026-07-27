"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart, useStoreHydration } from "@/lib/store";
import { formatDZD } from "@/lib/format";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { LOOKBOOK } from "@/lib/lookbook";
import { toSrcSet } from "@/lib/media";
import { IconArrowEnd, IconClose, IconTruck, IconWallet } from "@/components/ui/Icon";

type CartLine = ReturnType<typeof useCart.getState>["lines"][number];

/**
 * Cart — no customer accounts (§8), so this reads straight from the persisted
 * `useCart` store. Quantities and removals are client-side; price and stock are
 * re-validated server-side at checkout (§14.2, §14.6) and never trusted here.
 *
 * Two things carry this page:
 *
 * - **Undo on remove.** Removing a line is one tap from a small ✕ next to a
 *   quantity stepper, and getting it wrong means rebuilding a variant selection
 *   from the product page. The line is held for ten seconds with an undo bar
 *   instead of vanishing.
 * - **A sticky summary** alongside the items on desktop, so the total and the
 *   checkout button stay on screen however long the list gets.
 */
export default function CartPage() {
  const { lines, removeLine, setQuantity, totalPrice } = useCart();
  const hydrated = useStoreHydration((s) => s.hydrated);

  // Hold removed lines briefly so they can be restored. Keyed by variantId,
  // with the index so an undo puts the line back where it was.
  const [undo, setUndo] = useState<{ line: CartLine; index: number } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }, []);

  function handleRemove(line: CartLine) {
    const index = lines.findIndex((l) => l.variantId === line.variantId);
    removeLine(line.variantId);
    setUndo({ line, index });
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndo(null), 10000);
  }

  function handleUndo() {
    if (!undo) return;
    // addLine appends; restoring the exact position needs a direct set.
    useCart.setState((state) => {
      const next = [...state.lines];
      next.splice(Math.min(undo.index, next.length), 0, undo.line);
      return { lines: next };
    });
    setUndo(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }

  const subtotal = totalPrice();
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  // Until localStorage has been read, we genuinely don't know whether the cart
  // is empty — showing the empty state here would flash it at every returning
  // customer.
  if (!hydrated) return <CartSkeleton />;

  if (lines.length === 0) {
    return <EmptyCart onUndo={undo ? handleUndo : undefined} />;
  }

  return (
    <main className="section-k">
      <div className="container-k-wide">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-display-2 text-ink">السلة</h1>
          <span className="tabular text-body text-ink-muted">
            {count} {count === 1 ? "قطعة" : "قطع"}
          </span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          {/* Lines */}
          <div>
            <ul className="border-t border-line">
              {lines.map((line) => (
                <li key={line.variantId} className="flex gap-4 border-b border-line py-5">
                  <Link
                    href={`/products/${line.productId}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="aspect-product w-20 shrink-0 overflow-hidden rounded-xs bg-surface-sunken sm:w-24"
                  >
                    {line.imageUrl && (
                      <ProtectedImage
                        src={line.imageUrl}
                        alt=""
                        sizes="96px"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>

                  {/* Details take the free space; quantity, price and remove
                      cluster together at the end. Letting each one sit at its
                      own edge of a ~950px row strands them from the product
                      they belong to. */}
                  <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body font-medium text-ink">{line.productName}</p>
                      <p className="mt-1 text-body-sm text-ink-muted">
                        {line.color} · {line.size}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                      <QuantityStepper
                        value={line.quantity}
                        label={line.productName}
                        onChange={(q) => setQuantity(line.variantId, q)}
                      />

                      <div className="flex-1 text-end sm:w-28 sm:flex-none">
                        <p className="tabular text-price text-brand-800">
                          {formatDZD(line.unitPrice * line.quantity)}
                        </p>
                        {line.quantity > 1 && (
                          <p className="tabular mt-0.5 text-caption text-ink-subtle">
                            {formatDZD(line.unitPrice)} × {line.quantity}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(line)}
                        aria-label={`إزالة ${line.productName} من السلة`}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-pill text-ink-subtle transition duration-fast ease-k hover:bg-surface-sunken hover:text-ink"
                      >
                        <IconClose className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/top-selling"
              className="mt-6 inline-flex items-center gap-2 text-body-sm font-semibold text-brand-700 transition-colors duration-fast ease-k hover:text-brand-800"
            >
              <IconArrowEnd className="h-4 w-4" />
              متابعة التسوق
            </Link>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-md bg-surface-sunken p-6">
              <h2 className="text-body font-semibold text-ink">ملخص الطلب</h2>

              <dl className="mt-5 space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-body-sm text-ink-muted">المجموع الفرعي</dt>
                  <dd className="tabular text-body-sm text-ink">{formatDZD(subtotal)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-body-sm text-ink-muted">التوصيل</dt>
                  <dd className="text-body-sm text-ink-muted">يُحسب عند إتمام الطلب</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line-strong pt-5">
                <span className="text-body font-semibold text-ink">الإجمالي</span>
                <span className="tabular font-display text-h2 text-brand-800">{formatDZD(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex h-12 items-center justify-center rounded-sm bg-brand-700 text-body font-semibold text-white transition duration-fast ease-k hover:bg-brand-800"
              >
                إتمام الطلب
              </Link>

              <ul className="mt-5 space-y-2.5">
                <li className="flex items-center gap-2.5 text-body-sm text-ink-muted">
                  <IconWallet className="h-[18px] w-[18px] shrink-0 text-brand-600" />
                  الدفع عند الاستلام
                </li>
                <li className="flex items-center gap-2.5 text-body-sm text-ink-muted">
                  <IconTruck className="h-[18px] w-[18px] shrink-0 text-brand-600" />
                  توصيل إلى 58 ولاية
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <UndoBar undo={undo} onUndo={handleUndo} onDismiss={() => setUndo(null)} />
    </main>
  );
}

function QuantityStepper({
  value,
  label,
  onChange,
}: {
  value: number;
  label: string;
  onChange: (q: number) => void;
}) {
  return (
    <div className="flex items-center rounded-sm border border-line-strong">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={`إنقاص كمية ${label}`}
        className="grid h-10 w-10 place-items-center text-ink transition duration-fast ease-k hover:bg-surface-sunken disabled:cursor-not-allowed disabled:text-ink-subtle"
      >
        <span aria-hidden="true" className="block h-px w-3.5 bg-current" />
      </button>

      <span aria-live="polite" className="tabular w-8 text-center text-body-sm text-ink">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={`زيادة كمية ${label}`}
        className="relative grid h-10 w-10 place-items-center text-ink transition duration-fast ease-k hover:bg-surface-sunken"
      >
        <span aria-hidden="true" className="absolute h-px w-3.5 bg-current" />
        <span aria-hidden="true" className="absolute h-3.5 w-px bg-current" />
      </button>
    </div>
  );
}

/** Toast offering to restore the line just removed. */
function UndoBar({
  undo,
  onUndo,
  onDismiss,
}: {
  undo: { line: CartLine } | null;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-4 transition-all duration-base ease-k ${
        undo ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {undo && (
        <div className="pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-4 rounded-sm bg-brand-900 px-4 py-3 shadow-2">
          <p className="truncate text-body-sm text-brand-100">
            تمت إزالة «{undo.line.productName}»
          </p>
          <button
            type="button"
            onClick={onUndo}
            className="shrink-0 text-body-sm font-semibold text-brand-200 underline underline-offset-4 transition-colors duration-fast ease-k hover:text-white"
          >
            تراجع
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="إخفاء"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-pill text-brand-200/70 transition-colors duration-fast ease-k hover:text-white"
          >
            <IconClose className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/** Matches the loaded layout's shape so nothing jumps when the cart arrives. */
function CartSkeleton() {
  return (
    <main className="section-k" aria-busy="true" aria-live="polite">
      <div className="container-k-wide">
        <span className="sr-only">جاري تحميل السلة…</span>
        <div className="h-9 w-40 animate-pulse rounded-sm bg-surface-sunken" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <div className="border-t border-line">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-4 border-b border-line py-5">
                <div className="aspect-product w-20 shrink-0 animate-pulse rounded-xs bg-surface-sunken sm:w-24" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-2/5 animate-pulse rounded-xs bg-surface-sunken" />
                  <div className="h-3 w-1/4 animate-pulse rounded-xs bg-surface-sunken" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-md bg-surface-sunken" />
        </div>
      </div>
    </main>
  );
}

/**
 * Empty state. An empty cart is a browsing opportunity, not an error — so it
 * shows the product photography and a route back in, rather than a 🛍️ emoji
 * and a dead end.
 */
function EmptyCart({ onUndo }: { onUndo?: () => void }) {
  const shot = LOOKBOOK[2] ?? LOOKBOOK[0];

  return (
    <main className="section-k">
      <div className="container-k-wide">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-display text-display-2 text-ink">سلتك فارغة</h1>
            <p className="mt-4 max-w-[42ch] text-body text-ink-muted">
              لم تضف أي قطعة بعد. تصفّح أحدث الإصدارات واختر ما يعبّر عنك.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/top-selling"
                className="flex h-12 items-center rounded-sm bg-brand-700 px-7 text-body font-semibold text-white transition duration-fast ease-k hover:bg-brand-800"
              >
                تصفّح المنتجات
              </Link>
              <Link
                href="/"
                className="flex h-12 items-center rounded-sm border border-line-strong px-7 text-body font-semibold text-ink transition duration-fast ease-k hover:border-brand-400"
              >
                العودة للرئيسية
              </Link>
            </div>

            {onUndo && (
              <button
                type="button"
                onClick={onUndo}
                className="mt-6 text-body-sm font-semibold text-brand-700 underline underline-offset-4"
              >
                تراجع عن إزالة آخر قطعة
              </button>
            )}
          </div>

          {shot && (
            <div className="aspect-product overflow-hidden rounded-md bg-surface-sunken lg:aspect-[4/3]">
              <ProtectedImage
                src={shot.image.src}
                srcSet={toSrcSet(shot.image)}
                sizes="(min-width: 1024px) 45vw, 100vw"
                alt={shot.alt}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
