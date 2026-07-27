// The listing (product-list) model, shared by /categories, /collections,
// /top-selling and /favorites.
//
// Kept as a pure module — no React, no DOM — for two reasons: the facet maths
// is the part most worth testing, and both the server pages and the client grid
// import from it without dragging a component tree along.
//
// Faceting follows the standard e-commerce contract: OR *within* a group (two
// sizes selected means either size), AND *across* groups (a size and a colour
// means both). Option counts are computed against every other group but not the
// group being counted — otherwise selecting "أسود" would zero out every other
// colour and the counts would tell you nothing.

import type { ProductCardData } from "@/components/shared/ProductCard";
import { formatDZD, formatNumber, sizeLabel } from "@/lib/format";

export type ListingVariant = { color: string; size: string; stock: number };

/** What the grid renders plus the two attributes it filters on. */
export type ListingProduct = ProductCardData & { variants: ListingVariant[] };

/** Shape of a product coming out of PUBLIC_PRODUCT_SELECT. */
type PublicishProduct = {
  id: string;
  slug: string;
  name: string;
  salePrice: number;
  discountPrice: number | null;
  trending: boolean;
  inStock: boolean;
  images: { url: string; altText: string | null }[];
  variants: ListingVariant[];
};

/**
 * Narrows a full public product to the listing shape.
 *
 * This is a payload decision as much as a typing one: the public select also
 * carries `description`, `careInstructions`, `metaDescription` and the entire
 * review list, none of which a grid tile renders. Passing the raw rows into a
 * client component ships all of it to the browser as serialised RSC payload —
 * on a 40-product category page that is tens of kilobytes for nothing, on
 * exactly the mid-range Android the design system is written for.
 */
export function toListingProduct(product: PublicishProduct): ListingProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    salePrice: product.salePrice,
    discountPrice: product.discountPrice,
    trending: product.trending,
    inStock: product.inStock,
    images: product.images.slice(0, 1).map((image) => ({
      url: image.url,
      altText: image.altText,
    })),
    variants: product.variants.map((variant) => ({
      color: variant.color,
      size: variant.size,
      stock: variant.stock,
    })),
  };
}

/** What the customer actually pays — the basis for every price facet and sort. */
export function effectivePrice(product: ListingProduct): number {
  return product.discountPrice ?? product.salePrice;
}

/* -------------------------------------------------------------------------
   Sorting
   ------------------------------------------------------------------------- */

export type SortKey = "default" | "price-asc" | "price-desc" | "discount" | "trending";

/**
 * Baymard's four essential sorts are price, rating, best-selling and newest.
 * There is no rating on a card here, so the slot goes to discount depth, which
 * is the axis a sale-led Algerian catalogue is actually browsed along.
 *
 * `default` keeps whatever order the server sent — newest for a category,
 * curated position for a collection, most-recently-favourited for /favorites —
 * so its label is passed in by the page rather than fixed here.
 */
export const SORT_OPTIONS: { key: Exclude<SortKey, "default">; label: string }[] = [
  { key: "trending", label: "الأكثر رواجاً" },
  { key: "price-asc", label: "السعر: من الأقل" },
  { key: "price-desc", label: "السعر: من الأعلى" },
  { key: "discount", label: "أكبر تخفيض" },
];

function sortProducts(products: ListingProduct[], sort: SortKey): ListingProduct[] {
  if (sort === "default") return products;

  // Copy first — the caller's array is React state coming down as a prop.
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-desc":
      return sorted.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "discount":
      return sorted.sort((a, b) => discountShare(b) - discountShare(a));
    case "trending":
      return sorted.sort((a, b) => Number(b.trending) - Number(a.trending));
  }
}

function discountShare(product: ListingProduct): number {
  if (product.discountPrice == null || product.salePrice <= 0) return 0;
  return (product.salePrice - product.discountPrice) / product.salePrice;
}

/* -------------------------------------------------------------------------
   Facet state
   ------------------------------------------------------------------------- */

export type FacetState = {
  sizes: string[];
  colors: string[];
  /** Id of the selected price band, or null. Single-select — bands are ranges. */
  bandId: string | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
};

export const EMPTY_FACETS: FacetState = {
  sizes: [],
  colors: [],
  bandId: null,
  inStockOnly: false,
  onSaleOnly: false,
};

/** How many individual filters are on — drives the badge on the filter button. */
export function activeFacetCount(state: FacetState): number {
  return (
    state.sizes.length +
    state.colors.length +
    (state.bandId ? 1 : 0) +
    (state.inStockOnly ? 1 : 0) +
    (state.onSaleOnly ? 1 : 0)
  );
}

/* -------------------------------------------------------------------------
   Price bands
   ------------------------------------------------------------------------- */

export type PriceBand = { id: string; label: string; min: number; max: number };

/** Nearest multiple of `step`, used to keep band edges on round money. */
function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Three bands derived from the catalogue rather than hardcoded, so a page of
 * tote bags and a page of winter hoodies each get boundaries that mean
 * something.
 *
 * Returns `[]` — i.e. no price facet at all — when the range is too narrow or
 * the page too short for banding to help. A filter that can only ever return
 * everything is worse than no filter: it costs a tap and teaches nothing.
 */
export function buildPriceBands(products: ListingProduct[]): PriceBand[] {
  if (products.length < 6) return [];

  const prices = products.map(effectivePrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (max - min < 1000) return [];

  const step = Math.max(roundTo((max - min) / 3, 500), 500);
  const low = roundTo(min + step, 500);
  const high = roundTo(min + step * 2, 500);
  if (low >= high || low <= min || high >= max) return [];

  return [
    { id: "lo", label: `أقل من ${formatDZD(low)}`, min: 0, max: low - 1 },
    { id: "mid", label: `من ${formatNumber(low)} إلى ${formatDZD(high)}`, min: low, max: high },
    { id: "hi", label: `أكثر من ${formatDZD(high)}`, min: high + 1, max: Number.POSITIVE_INFINITY },
  ];
}

/* -------------------------------------------------------------------------
   Matching
   ------------------------------------------------------------------------- */

type FacetGroupId = "sizes" | "colors" | "band" | "stock" | "sale";

/**
 * Does this product survive the filter state, optionally ignoring one group?
 * The `except` parameter is what makes honest option counts possible.
 */
function matches(
  product: ListingProduct,
  state: FacetState,
  bands: PriceBand[],
  except?: FacetGroupId,
): boolean {
  if (except !== "sizes" && state.sizes.length > 0) {
    if (!product.variants.some((v) => state.sizes.includes(v.size))) return false;
  }

  if (except !== "colors" && state.colors.length > 0) {
    if (!product.variants.some((v) => state.colors.includes(v.color))) return false;
  }

  if (except !== "band" && state.bandId) {
    const band = bands.find((b) => b.id === state.bandId);
    if (band) {
      const price = effectivePrice(product);
      if (price < band.min || price > band.max) return false;
    }
  }

  if (except !== "stock" && state.inStockOnly && !product.inStock) return false;

  if (except !== "sale" && state.onSaleOnly && product.discountPrice == null) return false;

  return true;
}

/* -------------------------------------------------------------------------
   Facet groups
   ------------------------------------------------------------------------- */

export type FacetOption = {
  value: string;
  label: string;
  /** Products that would remain if this option were selected. Zero = disabled. */
  count: number;
  selected: boolean;
};

export type FacetGroups = {
  sizes: FacetOption[];
  colors: FacetOption[];
  bands: FacetOption[];
  /** Only offered when the page actually contains something out of stock. */
  stock: FacetOption | null;
  /** Only offered when something on the page is discounted. */
  sale: FacetOption | null;
};

// S–XXL first in the order a customer expects to read them; anything the
// catalogue invents later sorts alphabetically after, rather than vanishing.
const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL"];

function compareSizes(a: string, b: string): number {
  const ai = SIZE_ORDER.indexOf(a.toUpperCase());
  const bi = SIZE_ORDER.indexOf(b.toUpperCase());
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.localeCompare(b, "ar");
}

function distinct(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))];
}

/**
 * Every facet the page can offer, each option carrying the count it would
 * yield. Baymard puts option counts among the highest-impact things a filter UI
 * can do — they let a customer avoid the dead end before spending the tap.
 */
export function buildFacetGroups(
  products: ListingProduct[],
  state: FacetState,
  bands: PriceBand[],
): FacetGroups {
  const countWhere = (except: FacetGroupId, predicate: (p: ListingProduct) => boolean) =>
    products.filter((p) => matches(p, state, bands, except) && predicate(p)).length;

  const sizes = distinct(products.flatMap((p) => p.variants.map((v) => v.size)))
    .sort(compareSizes)
    .map((size) => ({
      value: size,
      label: sizeLabel(size),
      count: countWhere("sizes", (p) => p.variants.some((v) => v.size === size)),
      selected: state.sizes.includes(size),
    }));

  const colors = distinct(products.flatMap((p) => p.variants.map((v) => v.color)))
    .sort((a, b) => a.localeCompare(b, "ar"))
    .map((color) => ({
      value: color,
      label: color,
      count: countWhere("colors", (p) => p.variants.some((v) => v.color === color)),
      selected: state.colors.includes(color),
    }));

  const bandOptions = bands.map((band) => ({
    value: band.id,
    label: band.label,
    count: countWhere("band", (p) => {
      const price = effectivePrice(p);
      return price >= band.min && price <= band.max;
    }),
    selected: state.bandId === band.id,
  }));

  const hasOutOfStock = products.some((p) => !p.inStock);
  const hasSale = products.some((p) => p.discountPrice != null);

  return {
    // A facet with one option cannot narrow anything — drop it rather than
    // render a control that does nothing when tapped.
    sizes: sizes.length > 1 ? sizes : [],
    colors: colors.length > 1 ? colors : [],
    bands: bandOptions,
    stock: hasOutOfStock
      ? {
          value: "in-stock",
          label: "المتوفر فقط",
          count: countWhere("stock", (p) => p.inStock),
          selected: state.inStockOnly,
        }
      : null,
    sale: hasSale
      ? {
          value: "on-sale",
          label: "المخفّض فقط",
          count: countWhere("sale", (p) => p.discountPrice != null),
          selected: state.onSaleOnly,
        }
      : null,
  };
}

/** True when the page has at least one facet worth showing a filter button for. */
export function hasAnyFacet(groups: FacetGroups): boolean {
  return (
    groups.sizes.length > 0 ||
    groups.colors.length > 0 ||
    groups.bands.length > 0 ||
    groups.stock !== null ||
    groups.sale !== null
  );
}

/** Filter, then sort. The one entry point the grid calls. */
export function applyListing(
  products: ListingProduct[],
  state: FacetState,
  bands: PriceBand[],
  sort: SortKey,
): ListingProduct[] {
  return sortProducts(
    products.filter((p) => matches(p, state, bands)),
    sort,
  );
}

/* -------------------------------------------------------------------------
   Copy
   ------------------------------------------------------------------------- */

/**
 * Arabic counts the way Arabic counts: singular, a dual form, a plural for
 * 3–10, then back to the singular noun above that. "1 قطعة" is the kind of
 * machine-translated result that quietly tells a customer the shop is not
 * really theirs.
 */
export function pieceCount(n: number): string {
  if (n === 0) return "لا توجد قطع";
  if (n === 1) return "قطعة واحدة";
  if (n === 2) return "قطعتان";
  if (n <= 10) return `${formatNumber(n)} قطع`;
  return `${formatNumber(n)} قطعة`;
}
