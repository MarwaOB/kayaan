"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { Reveal } from "@/components/ui/Reveal";
import { Modal } from "@/components/ui/Modal";
import { IconChevronDown, IconClose } from "@/components/ui/Icon";
import type { EditorialFrame } from "@/lib/lookbook";
import {
  activeFacetCount,
  applyListing,
  buildFacetGroups,
  buildPriceBands,
  EMPTY_FACETS,
  hasAnyFacet,
  pieceCount,
  SORT_OPTIONS,
  type FacetGroups,
  type FacetOption,
  type FacetState,
  type ListingProduct,
  type SortKey,
} from "@/lib/listing";

/** One product per this many tiles, an editorial frame breaks the grid. */
const TILES_PER_BREAK = 8;

/**
 * Tracks the `lg` breakpoint in JavaScript, which the filter surfaces need and
 * a media query alone cannot give them: `Modal` portals to `<body>`, so a
 * `lg:hidden` wrapper around it hides nothing — the panel escapes the wrapper
 * and the desktop would get the sheet *and* the inline panel at once.
 *
 * Starts `false` so the server render and the first client render agree; the
 * real value lands in the effect, before any of this is interactive.
 */
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

/**
 * The product grid every listing page shares — /categories, /collections,
 * /top-selling, /favorites.
 *
 * Three things it does that the old grids did not:
 *
 * 1. **Filter and sort.** A category page was a bare `grid` with no way to
 *    narrow it. Faceting follows the standard contract (see src/lib/listing.ts)
 *    and every option carries the count it would return, which Baymard's
 *    product-list research puts among the highest-impact changes a filter UI
 *    can make — you can see the dead end before you spend the tap on it.
 *
 * 2. **Two filter surfaces, one state.** Desktop gets an inline panel that
 *    updates the results live. Below `lg` the same fields move into a
 *    bottom sheet whose primary action reads "عرض ١٢ قطعة" and updates as you
 *    choose, which is the mobile pattern that research settles on.
 *
 * 3. **Editorial breaks.** Full-bleed photography spliced between rows, so a
 *    forty-product page reads like a lookbook rather than a spreadsheet. They
 *    are suppressed the moment a filter is applied: once someone is narrowing,
 *    photography between the rows is an obstacle between them and the answer.
 *
 * Facets are adaptive. A group with fewer than two distinct values is dropped,
 * price banding switches itself off on a short or narrow-priced page, and when
 * nothing is left worth filtering, the toolbar reduces to a count and a sort.
 * A page of six favourites should not carry the chrome of a page of sixty.
 */
export function ProductGrid({
  products,
  defaultSortLabel,
  editorial = [],
  empty,
}: {
  products: ListingProduct[];
  /** Names the server's own ordering — "الأحدث", "ترتيب التشكيلة", … */
  defaultSortLabel: string;
  /** Frames woven between rows. Pass `[]` to keep the grid uninterrupted. */
  editorial?: EditorialFrame[];
  /** Shown when the page itself has no products (not when filters exclude all). */
  empty: React.ReactNode;
}) {
  const [sort, setSort] = useState<SortKey>("default");
  const [facets, setFacets] = useState<FacetState>(EMPTY_FACETS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isDesktop = useIsDesktop();

  const bands = useMemo(() => buildPriceBands(products), [products]);
  const groups = useMemo(() => buildFacetGroups(products, facets, bands), [products, facets, bands]);
  const visible = useMemo(() => applyListing(products, facets, bands, sort), [products, facets, bands, sort]);

  const activeCount = activeFacetCount(facets);
  const filterable = hasAnyFacet(groups);

  if (products.length === 0) return <>{empty}</>;

  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const fields = (
    <FacetFields
      groups={groups}
      onToggleSize={(v) => setFacets((f) => ({ ...f, sizes: toggleIn(f.sizes, v) }))}
      onToggleColor={(v) => setFacets((f) => ({ ...f, colors: toggleIn(f.colors, v) }))}
      onSelectBand={(v) => setFacets((f) => ({ ...f, bandId: f.bandId === v ? null : v }))}
      onToggleStock={() => setFacets((f) => ({ ...f, inStockOnly: !f.inStockOnly }))}
      onToggleSale={() => setFacets((f) => ({ ...f, onSaleOnly: !f.onSaleOnly }))}
    />
  );

  return (
    <div>
      {/* ---- Toolbar ------------------------------------------------------
          Pinned under the header via the --k-header-h token, so "التصفية"
          stays reachable at product forty without a scroll back to the top. */}
      <div className="sticky top-header z-30 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="container-k-wide flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2">
            {filterable && (
              <button
                type="button"
                onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen}
                className="flex h-11 items-center gap-2 rounded-sm border border-line-strong px-4 text-body-sm font-semibold text-ink transition-colors duration-fast ease-k hover:border-brand-400 hover:bg-surface-sunken"
              >
                التصفية
                {activeCount > 0 && (
                  <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-pill bg-brand-700 px-1 text-caption tabular text-white">
                    {activeCount}
                  </span>
                )}
                <IconChevronDown
                  className={`hidden h-4 w-4 transition-transform duration-base ease-k lg:block ${
                    filtersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}

            <p aria-live="polite" className="text-body-sm text-ink-muted">
              {pieceCount(visible.length)}
            </p>
          </div>

          <SortSelect value={sort} onChange={setSort} defaultLabel={defaultSortLabel} />
        </div>

        {/* Desktop: inline panel, results update live as options are chosen. */}
        {filterable && filtersOpen && (
          <div className="hidden border-t border-line lg:block">
            <div className="container-k-wide py-6">{fields}</div>
          </div>
        )}
      </div>

      {/* ---- Applied filters --------------------------------------------- */}
      {activeCount > 0 && (
        <div className="container-k-wide pt-5">
          <AppliedChips
            groups={groups}
            onClearSize={(v) => setFacets((f) => ({ ...f, sizes: f.sizes.filter((s) => s !== v) }))}
            onClearColor={(v) => setFacets((f) => ({ ...f, colors: f.colors.filter((c) => c !== v) }))}
            onClearBand={() => setFacets((f) => ({ ...f, bandId: null }))}
            onClearStock={() => setFacets((f) => ({ ...f, inStockOnly: false }))}
            onClearSale={() => setFacets((f) => ({ ...f, onSaleOnly: false }))}
            onClearAll={() => setFacets(EMPTY_FACETS)}
          />
        </div>
      )}

      {/* ---- Grid --------------------------------------------------------- */}
      <div className="container-k-wide pb-16 pt-8 md:pb-24 md:pt-10">
        {visible.length === 0 ? (
          <NoMatches onClear={() => setFacets(EMPTY_FACETS)} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-14 xl:grid-cols-4">
            {visible.map((product, i) => {
              // Breaks only when the customer is browsing, never mid-filter.
              const breakIndex = (i + 1) / TILES_PER_BREAK - 1;
              const frame =
                activeCount === 0 &&
                Number.isInteger(breakIndex) &&
                i !== visible.length - 1 &&
                breakIndex < editorial.length
                  ? editorial[breakIndex]
                  : null;

              return (
                <Fragment key={product.id}>
                  {/* Stagger runs across the row, not down the page — a 4-wide
                      row appearing left-to-right reads as one gesture. */}
                  <Reveal delay={(i % 4) * 70}>
                    <ProductCard product={product} priority={i < 4} />
                  </Reveal>

                  {frame && (
                    <div className="col-span-full my-2 md:my-6">
                      <EditorialBreak frame={frame} />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ---- Mobile / tablet filter sheet --------------------------------
          `Modal` already renders as a bottom sheet below `sm` and a centred
          dialog above it, with the focus trap, Esc and scroll lock the design
          system requires — so this reuses it rather than hand-rolling a second
          overlay that would have to re-earn all four. */}
      <Modal
        open={filterable && filtersOpen && !isDesktop}
        onClose={() => setFiltersOpen(false)}
        title="التصفية"
      >
        {fields}

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="h-12 flex-1 rounded-sm bg-brand-700 px-6 text-body-sm font-semibold text-white transition-colors duration-fast ease-k hover:bg-brand-800"
          >
            عرض {pieceCount(visible.length)}
          </button>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setFacets(EMPTY_FACETS)}
              className="h-12 rounded-sm border border-line-strong px-5 text-body-sm font-semibold text-ink-muted transition-colors duration-fast ease-k hover:border-brand-400 hover:text-ink"
            >
              مسح
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Sort
   ------------------------------------------------------------------------- */

/**
 * A native `<select>`, deliberately.
 *
 * A custom listbox here would have to re-earn keyboard navigation, typeahead,
 * screen-reader semantics and the platform's own mobile wheel picker — all to
 * change a border. 16px text because anything smaller makes iOS zoom the
 * viewport on focus (§6.7).
 */
function SortSelect({
  value,
  onChange,
  defaultLabel,
}: {
  value: SortKey;
  onChange: (key: SortKey) => void;
  defaultLabel: string;
}) {
  return (
    <div className="relative shrink-0">
      <label htmlFor="listing-sort" className="sr-only">
        ترتيب المنتجات
      </label>
      <select
        id="listing-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="h-11 w-full appearance-none rounded-sm border border-line-strong bg-surface ps-4 pe-10 text-base text-ink transition-colors duration-fast ease-k hover:border-brand-400"
      >
        <option value="default">{defaultLabel}</option>
        {SORT_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
      <IconChevronDown
        className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Facet fields
   ------------------------------------------------------------------------- */

function FacetFields({
  groups,
  onToggleSize,
  onToggleColor,
  onSelectBand,
  onToggleStock,
  onToggleSale,
}: {
  groups: FacetGroups;
  onToggleSize: (value: string) => void;
  onToggleColor: (value: string) => void;
  onSelectBand: (value: string) => void;
  onToggleStock: () => void;
  onToggleSale: () => void;
}) {
  return (
    <div className="grid gap-7 lg:grid-cols-4 lg:gap-8">
      {groups.sizes.length > 0 && (
        <FacetGroup title="المقاس">
          {groups.sizes.map((option) => (
            <FacetChip key={option.value} option={option} onToggle={() => onToggleSize(option.value)} />
          ))}
        </FacetGroup>
      )}

      {groups.colors.length > 0 && (
        <FacetGroup title="اللون">
          {groups.colors.map((option) => (
            <FacetChip key={option.value} option={option} onToggle={() => onToggleColor(option.value)} />
          ))}
        </FacetGroup>
      )}

      {groups.bands.length > 0 && (
        <FacetGroup title="السعر">
          {groups.bands.map((option) => (
            <FacetChip key={option.value} option={option} onToggle={() => onSelectBand(option.value)} />
          ))}
        </FacetGroup>
      )}

      {(groups.stock || groups.sale) && (
        <FacetGroup title="التوفر والعروض">
          {groups.stock && <FacetChip option={groups.stock} onToggle={onToggleStock} />}
          {groups.sale && <FacetChip option={groups.sale} onToggle={onToggleSale} />}
        </FacetGroup>
      )}
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-caption text-brand-600">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/**
 * `aria-pressed` rather than a checkbox: these are toggle buttons that filter a
 * live list, not fields inside a form that gets submitted. Selection is carried
 * by fill *and* by the pressed state, never by colour alone (§9).
 *
 * A zero-count option is disabled rather than hidden — options appearing and
 * disappearing as you tick boxes is the single most disorienting thing a filter
 * panel can do.
 */
function FacetChip({ option, onToggle }: { option: FacetOption; onToggle: () => void }) {
  const disabled = option.count === 0 && !option.selected;

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={option.selected}
      className={
        "flex h-11 items-center gap-2 rounded-sm border px-3.5 text-body-sm transition-colors duration-fast ease-k " +
        (option.selected
          ? "border-brand-700 bg-brand-700 font-semibold text-white"
          : disabled
            ? "cursor-not-allowed border-line bg-surface-sunken text-ink-subtle"
            : "border-line-strong text-ink hover:border-brand-400 hover:bg-surface-sunken")
      }
    >
      <span>{option.label}</span>
      <span className={`text-caption tabular ${option.selected ? "text-brand-200" : "text-ink-subtle"}`}>
        {option.count}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------------------
   Applied filters
   ------------------------------------------------------------------------- */

function AppliedChips({
  groups,
  onClearSize,
  onClearColor,
  onClearBand,
  onClearStock,
  onClearSale,
  onClearAll,
}: {
  groups: FacetGroups;
  onClearSize: (value: string) => void;
  onClearColor: (value: string) => void;
  onClearBand: () => void;
  onClearStock: () => void;
  onClearSale: () => void;
  onClearAll: () => void;
}) {
  const applied: { key: string; label: string; clear: () => void }[] = [
    ...groups.sizes.filter((o) => o.selected).map((o) => ({
      key: `size-${o.value}`,
      label: `المقاس: ${o.label}`,
      clear: () => onClearSize(o.value),
    })),
    ...groups.colors.filter((o) => o.selected).map((o) => ({
      key: `color-${o.value}`,
      label: `اللون: ${o.label}`,
      clear: () => onClearColor(o.value),
    })),
    ...groups.bands.filter((o) => o.selected).map((o) => ({
      key: `band-${o.value}`,
      label: o.label,
      clear: onClearBand,
    })),
    ...(groups.stock?.selected ? [{ key: "stock", label: groups.stock.label, clear: onClearStock }] : []),
    ...(groups.sale?.selected ? [{ key: "sale", label: groups.sale.label, clear: onClearSale }] : []),
  ];

  if (applied.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-caption text-ink-muted">التصفية المطبّقة</span>

      {applied.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.clear}
          aria-label={`إزالة ${chip.label}`}
          className="flex h-9 items-center gap-1.5 rounded-pill bg-brand-100 ps-3 pe-2 text-caption text-brand-800 transition-colors duration-fast ease-k hover:bg-brand-200"
        >
          {chip.label}
          <IconClose className="h-3.5 w-3.5" weight={2} />
        </button>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="h-9 px-2 text-caption font-semibold text-brand-700 underline underline-offset-4 transition-colors duration-fast ease-k hover:text-brand-800"
      >
        مسح الكل
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Editorial break
   ------------------------------------------------------------------------- */

/**
 * `bleed-k` escapes the container from inside a `col-span-full` grid item, so
 * the frame runs edge to edge without the grid needing to be split in two —
 * which would break the row rhythm on either side of it.
 */
function EditorialBreak({ frame }: { frame: EditorialFrame }) {
  return (
    <Reveal>
      <div className="bleed-k relative aspect-[4/3] overflow-hidden bg-surface-sunken sm:aspect-hero">
        <ProtectedImage
          src={frame.src}
          srcSet={frame.srcSet}
          sizes="100vw"
          alt={frame.alt}
          className="h-full w-full object-cover"
        />
        {frame.caption && (
          <>
            <div className="scrim-k absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0">
              <div className="container-k-wide pb-6 md:pb-10">
                <p className="font-display text-display-2 max-w-[20ch] text-white">{frame.caption}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Reveal>
  );
}

/* ---------------------------------------------------------------------------
   Empty results
   ------------------------------------------------------------------------- */

/**
 * Filters excluded everything. Distinct from an empty page: the fix is one
 * button away, so the button is the loudest thing here.
 */
function NoMatches({ onClear }: { onClear: () => void }) {
  return (
    <div className="mx-auto max-w-[46ch] py-16 text-center md:py-24">
      <h2 className="font-display text-h1 text-ink">لا توجد قطع بهذه المواصفات</h2>
      <p className="mt-3 text-body text-ink-muted">
        جرّب توسيع البحث بإزالة أحد الخيارات، أو تصفّح القسم كاملاً.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-7 inline-flex h-11 items-center justify-center rounded-sm bg-brand-700 px-6 text-body-sm font-semibold text-white transition-colors duration-fast ease-k hover:bg-brand-800"
      >
        مسح عوامل التصفية
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Empty page
   ------------------------------------------------------------------------- */

/**
 * Shared empty state for a genuinely empty page. Photographic, because the
 * dashed-border box the four listing pages used to share said "something is
 * broken" when what it meant was "come back soon".
 */
export function ListingEmpty({
  title,
  body,
  frame,
  actionHref = "/",
  actionLabel = "تصفّح المتجر",
}: {
  title: string;
  body: string;
  frame?: EditorialFrame | null;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="container-k-wide py-12 md:py-16">
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        {frame && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-sunken md:aspect-product">
            <ProtectedImage
              src={frame.src}
              srcSet={frame.srcSet}
              sizes="(min-width: 768px) 45vw, 100vw"
              alt={frame.alt}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className={frame ? "" : "mx-auto max-w-[52ch] text-center"}>
          <h2 className="font-display text-display-2 text-ink">{title}</h2>
          <p className="mt-4 max-w-[46ch] text-body-lg text-ink-muted">{body}</p>
          <Link
            href={actionHref}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-sm bg-brand-700 px-7 text-body-sm font-semibold text-white transition-colors duration-fast ease-k hover:bg-brand-800"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
