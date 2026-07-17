/**
 * Manual delivery-time estimates per wilaya (§13) — NOT from Yalidine's API,
 * which only exposes price, not ETA (confirmed: no such field in any
 * request/response shape found in their public SDKs/docs). This is a table
 * Kayaaan maintains by hand.
 *
 * IMPORTANT: every value below is a PLACEHOLDER, not real data — deliberately
 * flat/uniform so it's obviously not meant to be mistaken for a real,
 * researched per-wilaya breakdown. Replace with actual figures once you have
 * them (from the client's own experience with Yalidine, or by asking
 * Yalidine directly).
 *
 * Keyed by Yalidine's numeric wilaya ID (same IDs used everywhere else in
 * the delivery integration, e.g. src/lib/yalidine.ts). Assumes Yalidine's
 * wilaya IDs match Algeria's official 1-58 government wilaya codes, which
 * is the common convention — verify this once you have real API access by
 * checking a GET /api/delivery/wilayas response against the known official
 * list order.
 */
const DEFAULT_ETA_LABEL = "2-4 أيام عمل (تقديري)";

// Override specific wilayas here once you have real numbers, e.g.:
//   16: "1-2 أيام عمل", // الجزائر
const ETA_OVERRIDES: Record<number, string> = {};

export function getDeliveryEtaLabel(wilayaId: number): string {
  return ETA_OVERRIDES[wilayaId] ?? DEFAULT_ETA_LABEL;
}
