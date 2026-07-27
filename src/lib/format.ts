// Formatting helpers for the storefront.
//
// Numerals: prices, quantities and phone numbers use Western digits
// (`ar-DZ-u-nu-latn`) per docs/DESIGN-BRIEF.md §3 — Algerian retail convention,
// and what the live site shows. Arabic-Indic digits are reserved for the
// decorative section numbering in SectionHeader, where they read as an
// editorial accent rather than data.

const GROUPED = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

// No-break space as the thousands separator. `ar-DZ` groups with a full stop —
// "3.800 د.ج" reads as three-point-eight to a lot of people, which is a bad
// thing for a price tag to be ambiguous about. A space is the Algerian and
// French convention and cannot be misread as a decimal point.
//
// U+00A0, not the typographically nicer U+202F: neither Almarai nor IBM Plex
// Sans Arabic ships a glyph for the narrow variant, so it collapsed to nothing
// and prices rendered as "3800".
const GROUP_SEPARATOR = " ";

function group(value: number): string {
  return GROUPED.format(value).replace(/,/g, GROUP_SEPARATOR);
}

/** `3 800 د.ج` — the canonical price format. Currency follows the number (§8). */
export function formatDZD(amount: number): string {
  return `${group(amount)} د.ج`;
}

/** Whole numbers in Western digits — quantities, counts, order numbers. */
export function formatNumber(value: number): string {
  return group(value);
}

/**
 * Arabic counts the way Arabic counts — singular, a dual, a plural for 3–10,
 * then the singular noun again above that. "1 تقييمات" is the kind of
 * machine-translated result that tells a customer the shop is not really
 * theirs.
 */
export function reviewCount(n: number): string {
  if (n === 0) return "لا توجد تقييمات";
  if (n === 1) return "تقييم واحد";
  if (n === 2) return "تقييمان";
  if (n <= 10) return `${group(n)} تقييمات`;
  return `${group(n)} تقييماً`;
}

/** Average rating to one decimal — Western digits, per DESIGN-BRIEF §3. */
export function formatRating(value: number): string {
  return value.toFixed(1);
}

const ARABIC_INDIC = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * Zero-padded Arabic-Indic numeral for section labels: 3 -> "٠٣".
 * Decorative only — never use for prices or any value a customer reads as data.
 */
export function toArabicIndex(n: number): string {
  return String(n)
    .padStart(2, "0")
    .split("")
    .map((d) => ARABIC_INDIC[Number(d)] ?? d)
    .join("");
}

// Size codes (S / M / L / XL …) are international retail notation and read the
// same in Arabic, so they pass through. Spelled-out English sizes do not —
// "One Size" on an Arabic-only storefront is a straight R1 violation, and it is
// what the catalogue actually stores for single-size items.
const SIZE_LABELS: Record<string, string> = {
  "one size": "مقاس واحد",
  onesize: "مقاس واحد",
  "free size": "مقاس واحد",
  free: "مقاس واحد",
};

/** Customer-facing label for a variant size. */
export function sizeLabel(size: string): string {
  return SIZE_LABELS[size.trim().toLowerCase()] ?? size.trim();
}

/** Percentage saved, for the discount badge. Returns null when not on sale. */
export function discountPercent(salePrice: number, discountPrice: number | null): number | null {
  if (discountPrice == null || salePrice <= 0 || discountPrice >= salePrice) return null;
  return Math.round(((salePrice - discountPrice) / salePrice) * 100);
}
