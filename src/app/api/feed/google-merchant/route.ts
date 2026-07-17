import { NextResponse } from "next/server";
import { getMerchantFeedProducts } from "@/lib/queries/publicProductFeed";

type FeedProduct = Awaited<ReturnType<typeof getMerchantFeedProducts>>[number];
type FeedProductImage = FeedProduct["images"][number];

/**
 * GET /api/feed/google-merchant — Google Shopping / Merchant Center product
 * feed (RSS 2.0 + the `g:` namespace Google's spec requires). §13 Phase 4.
 *
 * Setup this code can't do for you (Google Merchant Center account setup,
 * not a coding task):
 *   1. Create a Merchant Center account at merchants.google.com.
 *   2. Verify + claim this site's URL (via Search Console).
 *   3. Products → Feeds → add a new feed, method "Scheduled fetch", and
 *      point it at this endpoint's full URL (e.g.
 *      https://kayaaanclothing.com/api/feed/google-merchant). No .xml
 *      extension is required — Merchant Center reads the Content-Type
 *      header and body, not the URL string.
 *   4. Algeria shows up as a supported-but-"beta" target country in
 *      Google's own country list — expect availability/rollout to differ
 *      from fully-rolled-out countries; this isn't something to fix in
 *      code, just a heads-up before promising the client full feature
 *      parity with, say, a French or US store on day one.
 *   5. Worth confirming with Merchant Center directly before going live:
 *      whether DZD is accepted as a submission currency for an
 *      Algeria-targeted feed, or whether prices need to be submitted in a
 *      different currency — this feed emits DZD as-is (matching how prices
 *      are already stored and displayed everywhere else in the app) since
 *      that's what the data actually is, but the acceptance question is
 *      Google account config, not something this code can resolve.
 *
 * What this code does handle: one <item> per product (not per variant —
 * see the comment in publicProductFeed.ts), required fields Google
 * actually rejects feeds without (id, title, link, image_link,
 * availability, price, condition), sale_price when a product has an active
 * discount, and identifier_exists=no since the schema has no GTIN/MPN/brand
 * fields to report honestly instead of inventing fake ones.
 */

const REQUIRED_FIELDS_NOTE =
  "id, title, description, link, image_link, availability, price, condition — Google Merchant Center rejects feed items missing any of these.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value: string): string {
  // CDATA so Arabic text, quotes, and ampersands in descriptions never need
  // manual escaping inside the tag body — still escaped defensively above
  // for the few fields Google expects as plain (unwrapped) text.
  return `<![CDATA[${value}]]>`;
}

export async function GET() {
  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    // Fail loudly rather than emit a feed full of broken/relative links
    // Google will silently reject — this is a one-line fix (.env), not a
    // real error, so surface it clearly instead of guessing a placeholder
    // domain that would quietly ship broken links to production.
    return NextResponse.json(
      { error: "SITE_URL is not set in .env — required to build absolute product links for the feed." },
      { status: 500 }
    );
  }

  const products = await getMerchantFeedProducts();

  const items = products
    .map((p: FeedProduct) => {
      const link = `${siteUrl}/products/${p.slug}`;
      const coverImage = p.images[0];
      if (!coverImage) return null; // image_link is required — a product with zero images can't be listed, skip rather than emit an invalid item

      const additionalImages = p.images
        .slice(1, 11) // Google allows up to 10 additional_image_link entries
        .map((img: FeedProductImage) => `<g:additional_image_link>${escapeXml(img.url)}</g:additional_image_link>`)
        .join("\n      ");

      const price = `${p.salePrice.toFixed(2)} DZD`;
      const salePriceTag =
        p.discountPrice != null ? `<g:sale_price>${p.discountPrice.toFixed(2)} DZD</g:sale_price>` : "";

      return `
    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <title>${cdata(p.name)}</title>
      <description>${cdata(p.description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(coverImage.url)}</g:image_link>
      ${additionalImages}
      <g:availability>${p.inStock ? "in stock" : "out of stock"}</g:availability>
      <g:price>${price}</g:price>
      ${salePriceTag}
      <g:condition>new</g:condition>
      <g:brand>Kayaan</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:product_type>${cdata(p.category.name)}</g:product_type>
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Required per Google Merchant Center item spec: ${REQUIRED_FIELDS_NOTE} -->
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Kayaan Clothing — Product Feed</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>Kayaan Clothing product catalog for Google Merchant Center</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Merchant Center's "scheduled fetch" hits this on its own cadence
      // (as often as daily); this just avoids this app's own layer serving
      // a stale cached copy for longer than that.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
