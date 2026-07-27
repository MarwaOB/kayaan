import Image from "next/image";
import { getLogo, type LogoColorway, type LogoMark } from "@/lib/media";

export type { LogoColorway, LogoMark };

/**
 * The Kayaaan logo. Five lockups × four colourways, built from the masters by
 * `npm run assets:prepare` into /public/brand.
 *
 * Always render the logo through this component — it pulls real dimensions from
 * the manifest (no layout shift, no drift when assets are rebuilt) and enforces
 * the minimum widths and "never distort" rule from docs/DESIGN-SYSTEM.md §2.5.
 *
 * Marks:
 *   wordmark          Arabic كيان alone — header, favicon, tight spaces
 *   lockup-horizontal Arabic + KAYAAAN CLOTHING — footer, email, wide headers
 *   lockup-stacked    arched KAYAAAN over Arabic — hero overlay, loading, social
 *   badge-framed      double-ruled frame — packaging and print, not UI chrome
 *   tile-solid        knockout tile — social avatar, OG image, app icon
 *
 * Colourways: espresso (default, on light) · sand (on dark/photo) ·
 * taupe (muted) · rosewood (alternate).
 */

/** §2.5 — below these widths the Arabic strokes break up. */
const MIN_WIDTH: Record<LogoMark, number> = {
  wordmark: 88,
  "lockup-horizontal": 180,
  "lockup-stacked": 120,
  "badge-framed": 120,
  "tile-solid": 48,
};

export function Logo({
  mark = "wordmark",
  colorway = "espresso",
  width,
  priority = false,
  className,
  title = "كيان",
  decorative = false,
}: {
  mark?: LogoMark;
  colorway?: LogoColorway;
  /** Rendered width in px. Clamped to the mark's minimum. */
  width?: number;
  priority?: boolean;
  className?: string;
  /** Arabic alt text. Ignored when `decorative`. */
  title?: string;
  /** Set when the logo sits beside a text label that already names the brand. */
  decorative?: boolean;
}) {
  const asset = getLogo(mark, colorway);
  const renderWidth = Math.max(width ?? MIN_WIDTH[mark], MIN_WIDTH[mark]);
  const renderHeight = Math.round((renderWidth * asset.height) / asset.width);

  return (
    <Image
      src={asset.webp}
      alt={decorative ? "" : title}
      aria-hidden={decorative || undefined}
      width={renderWidth}
      height={renderHeight}
      priority={priority}
      className={className}
      // Already trimmed and compressed by the pipeline at a fixed size — running
      // it through the image optimiser again buys nothing.
      unoptimized
    />
  );
}
