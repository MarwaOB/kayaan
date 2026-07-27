import { describe, it, expect } from "vitest";
import {
  activeFacetCount,
  applyListing,
  buildFacetGroups,
  buildPriceBands,
  EMPTY_FACETS,
  hasAnyFacet,
  pieceCount,
  toListingProduct,
  type ListingProduct,
} from "@/lib/listing";

// The facet engine is the one piece of the listing pages with real logic in it,
// it has no database dependency, and every one of its failure modes is silent —
// a wrong count reads as a plausible number, a broken AND/OR reads as a short
// list. So it gets tests.

function product(
  id: string,
  overrides: Partial<ListingProduct> & { variants?: ListingProduct["variants"] } = {},
): ListingProduct {
  return {
    id,
    slug: id,
    name: id,
    salePrice: 3000,
    discountPrice: null,
    trending: false,
    inStock: true,
    images: [],
    variants: [{ color: "أسود", size: "M", stock: 5 }],
    ...overrides,
  };
}

const CATALOGUE: ListingProduct[] = [
  product("a", { salePrice: 2000, variants: [{ color: "أسود", size: "S", stock: 3 }] }),
  product("b", { salePrice: 3000, variants: [{ color: "أبيض", size: "M", stock: 2 }] }),
  product("c", {
    salePrice: 5000,
    discountPrice: 4000,
    variants: [{ color: "أسود", size: "L", stock: 0 }],
    inStock: false,
  }),
  product("d", { salePrice: 6000, trending: true, variants: [{ color: "بيج", size: "M", stock: 1 }] }),
  product("e", { salePrice: 8000, variants: [{ color: "أبيض", size: "L", stock: 4 }] }),
  product("f", { salePrice: 9000, variants: [{ color: "أسود", size: "M", stock: 7 }] }),
];

describe("faceted filtering", () => {
  it("ORs within a group", () => {
    const result = applyListing(CATALOGUE, { ...EMPTY_FACETS, sizes: ["S", "L"] }, [], "default");
    expect(result.map((p) => p.id)).toEqual(["a", "c", "e"]);
  });

  it("ANDs across groups", () => {
    const result = applyListing(
      CATALOGUE,
      { ...EMPTY_FACETS, sizes: ["M"], colors: ["أبيض"] },
      [],
      "default",
    );
    expect(result.map((p) => p.id)).toEqual(["b"]);
  });

  it("filters out-of-stock only when asked, and never hides it otherwise (§5)", () => {
    expect(applyListing(CATALOGUE, EMPTY_FACETS, [], "default")).toHaveLength(6);
    const inStock = applyListing(CATALOGUE, { ...EMPTY_FACETS, inStockOnly: true }, [], "default");
    expect(inStock.map((p) => p.id)).not.toContain("c");
  });

  it("filters to discounted products", () => {
    const onSale = applyListing(CATALOGUE, { ...EMPTY_FACETS, onSaleOnly: true }, [], "default");
    expect(onSale.map((p) => p.id)).toEqual(["c"]);
  });

  it("keeps the server's order under the default sort", () => {
    const result = applyListing(CATALOGUE, EMPTY_FACETS, [], "default");
    expect(result.map((p) => p.id)).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  it("sorts on the discounted price, not the crossed-out one", () => {
    // c lists at 5000 but sells at 4000, so it must sort below b (3000) and
    // above d (6000) — sorting on salePrice would put it after d.
    const result = applyListing(CATALOGUE, EMPTY_FACETS, [], "price-asc");
    expect(result.map((p) => p.id)).toEqual(["a", "b", "c", "d", "e", "f"]);
  });

  it("does not mutate the array it is given", () => {
    const order = CATALOGUE.map((p) => p.id);
    applyListing(CATALOGUE, EMPTY_FACETS, [], "price-desc");
    expect(CATALOGUE.map((p) => p.id)).toEqual(order);
  });
});

describe("option counts", () => {
  it("counts against the other groups but not its own", () => {
    // With size M selected, the size counts must still report every size —
    // otherwise selecting M would zero out S and L and the customer could never
    // widen the search from the panel they narrowed it in.
    const groups = buildFacetGroups(CATALOGUE, { ...EMPTY_FACETS, sizes: ["M"] }, []);
    const bySize = Object.fromEntries(groups.sizes.map((o) => [o.value, o.count]));
    expect(bySize.S).toBe(1);
    expect(bySize.M).toBe(3);
    expect(bySize.L).toBe(2);

    // Colour counts, however, are narrowed by the selected size.
    const byColor = Object.fromEntries(groups.colors.map((o) => [o.value, o.count]));
    expect(byColor["أسود"]).toBe(1); // f only — a is size S, c is size L
    expect(byColor["أبيض"]).toBe(1); // b
    expect(byColor["بيج"]).toBe(1); // d
  });

  it("marks the selected options", () => {
    const groups = buildFacetGroups(CATALOGUE, { ...EMPTY_FACETS, colors: ["أسود"] }, []);
    expect(groups.colors.find((o) => o.value === "أسود")?.selected).toBe(true);
    expect(groups.colors.find((o) => o.value === "أبيض")?.selected).toBe(false);
  });
});

describe("adaptive facets", () => {
  it("drops a group that cannot narrow anything", () => {
    const oneSize = [product("x"), product("y"), product("z")];
    const groups = buildFacetGroups(oneSize, EMPTY_FACETS, []);
    expect(groups.sizes).toEqual([]);
    expect(groups.colors).toEqual([]);
  });

  it("offers stock and sale toggles only when the page contains one", () => {
    const allInStockNoSale = [product("x"), product("y")];
    const groups = buildFacetGroups(allInStockNoSale, EMPTY_FACETS, []);
    expect(groups.stock).toBeNull();
    expect(groups.sale).toBeNull();
    expect(hasAnyFacet(groups)).toBe(false);

    expect(hasAnyFacet(buildFacetGroups(CATALOGUE, EMPTY_FACETS, []))).toBe(true);
  });

  it("switches price banding off on a short or narrow-priced page", () => {
    expect(buildPriceBands(CATALOGUE.slice(0, 4))).toEqual([]);

    const narrow = Array.from({ length: 8 }, (_, i) => product(`n${i}`, { salePrice: 3000 + i * 10 }));
    expect(buildPriceBands(narrow)).toEqual([]);
  });

  it("bands the catalogue contiguously and covers the whole range", () => {
    const bands = buildPriceBands(CATALOGUE);
    expect(bands).toHaveLength(3);

    // Contiguous: each band starts exactly where the previous one ended, so no
    // price can fall between two of them.
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i].min).toBe(bands[i - 1].max + 1);
    }
    expect(bands[0].min).toBe(0);
    expect(bands[bands.length - 1].max).toBe(Number.POSITIVE_INFINITY);

    // Every product falls into exactly one band — no gaps, no overlaps.
    for (const p of CATALOGUE) {
      const price = p.discountPrice ?? p.salePrice;
      const hits = bands.filter((b) => price >= b.min && price <= b.max);
      expect(hits).toHaveLength(1);
    }
  });
});

describe("payload trimming", () => {
  it("strips the fields a grid tile never renders", () => {
    const raw = {
      id: "p",
      slug: "p",
      name: "قطعة",
      salePrice: 1000,
      discountPrice: null,
      trending: false,
      inStock: true,
      description: "نص طويل".repeat(200),
      images: [
        { id: "i1", url: "/a.webp", altText: "أ", position: 0, isLifestyle: false },
        { id: "i2", url: "/b.webp", altText: "ب", position: 1, isLifestyle: false },
      ],
      variants: [{ id: "v", color: "أسود", size: "M", stock: 1 }],
      reviews: [{ id: "r", rating: 5 }],
    };

    const trimmed = toListingProduct(raw as never);

    expect(trimmed).not.toHaveProperty("description");
    expect(trimmed).not.toHaveProperty("reviews");
    // Only the cover image is rendered on a card.
    expect(trimmed.images).toEqual([{ url: "/a.webp", altText: "أ" }]);
    expect(trimmed.variants).toEqual([{ color: "أسود", size: "M", stock: 1 }]);
  });
});

describe("copy", () => {
  it("counts the way Arabic counts", () => {
    expect(pieceCount(0)).toBe("لا توجد قطع");
    expect(pieceCount(1)).toBe("قطعة واحدة");
    expect(pieceCount(2)).toBe("قطعتان");
    expect(pieceCount(7)).toBe("7 قطع");
    expect(pieceCount(11)).toBe("11 قطعة");
  });

  it("counts active filters across every group", () => {
    expect(activeFacetCount(EMPTY_FACETS)).toBe(0);
    expect(
      activeFacetCount({
        sizes: ["S", "M"],
        colors: ["أسود"],
        bandId: "lo",
        inStockOnly: true,
        onSaleOnly: false,
      }),
    ).toBe(5);
  });
});
