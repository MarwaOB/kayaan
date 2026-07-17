import "./setupDb";
import { describe, it, expect, afterAll } from "vitest";
import { disconnectDb } from "./setupDb";

afterAll(disconnectDb);

describe("§14.1 — owner-only fields must never leak through public queries", () => {
  it("getPublicProducts() omits cost/rawPrice/sponsorSpend/profit", async () => {
    const { getPublicProducts } = await import("../src/lib/queries/publicProduct");
    const products = await getPublicProducts();

    expect(products.length).toBeGreaterThan(0);
    const OWNER_ONLY_FIELDS = ["costPrice", "rawPrice", "sponsorSpend", "profit"];
    for (const product of products) {
      for (const field of OWNER_ONLY_FIELDS) {
        expect(product).not.toHaveProperty(field);
      }
    }
  });

  it("getPublicProduct(slug) omits cost/rawPrice/sponsorSpend/profit", async () => {
    const { getPublicProduct } = await import("../src/lib/queries/publicProduct");
    const product = await getPublicProduct("hoodie-jazairi");

    expect(product).not.toBeNull();
    const OWNER_ONLY_FIELDS = ["costPrice", "rawPrice", "sponsorSpend", "profit"];
    for (const field of OWNER_ONLY_FIELDS) {
      expect(product).not.toHaveProperty(field);
    }
  });

  it("a raw JSON.stringify of the public product response contains no owner-only values", async () => {
    const { getPublicProduct } = await import("../src/lib/queries/publicProduct");
    const product = await getPublicProduct("hoodie-jazairi");
    const serialized = JSON.stringify(product);

    expect(serialized).not.toContain('"costPrice"');
    expect(serialized).not.toContain('"rawPrice"');
    expect(serialized).not.toContain('"sponsorSpend"');
    expect(serialized).not.toContain('"profit"');
  });

  it("getPublicCategories() never returns a masked category", async () => {
    const { getPublicCategories } = await import("../src/lib/queries/publicCategory");
    const categories = await getPublicCategories();

    const slugs = categories.map((c: { slug: string }) => c.slug);
    expect(slugs).toContain("hoodies");
    expect(slugs).not.toContain("joggers");
    expect(slugs).not.toContain("shorts");
    expect(slugs).not.toContain("backpacks");
  });

  it("getPublicProduct() returns null for a product in a masked category", async () => {
    const { getPublicProduct } = await import("../src/lib/queries/publicProduct");
    const product = await getPublicProduct("does-not-exist-slug");
    expect(product).toBeNull();
  });
});

describe("§14.11 — homepage content has usable defaults", () => {
  it("returns fallback homepage content when the database has no site settings", async () => {
    const { getHomepageContent } = await import("../src/lib/queries/siteSettings");
    const content = await getHomepageContent();

    expect(content.bannerMessages.length).toBeGreaterThan(0);
    expect(content.heroSlides.length).toBeGreaterThan(0);
    expect(content.runningBarItems.length).toBeGreaterThan(0);
    expect(content.testimonials.length).toBeGreaterThan(0);
  });
});

describe("§14.7 — order status pipeline only allows valid transitions", () => {
  it("allows AWAITING_PAYMENT -> CONFIRMED", async () => {
    const { isValidTransition } = await import("../src/lib/orderStatus");
    expect(isValidTransition("AWAITING_PAYMENT", "CONFIRMED")).toBe(true);
  });

  it("rejects skipping straight to DELIVERED", async () => {
    const { isValidTransition } = await import("../src/lib/orderStatus");
    expect(isValidTransition("AWAITING_PAYMENT", "DELIVERED")).toBe(false);
  });

  it("rejects any transition out of a terminal state", async () => {
    const { isValidTransition } = await import("../src/lib/orderStatus");
    expect(isValidTransition("DELIVERED", "CONFIRMED")).toBe(false);
    expect(isValidTransition("LOST", "CONFIRMED")).toBe(false);
  });

  it("rejects a no-op transition to the same status", async () => {
    const { isValidTransition } = await import("../src/lib/orderStatus");
    expect(isValidTransition("CONFIRMED", "CONFIRMED")).toBe(false);
  });
});

describe("§1 — wilaya validation", () => {
  it("exports all 58 wilayas", async () => {
    const { WILAYAS } = await import("../src/lib/wilayas");
    expect(WILAYAS).toHaveLength(58);
  });
});
