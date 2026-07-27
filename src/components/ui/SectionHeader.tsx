import Link from "next/link";
import { toArabicIndex } from "@/lib/format";
import { IconArrowEnd } from "@/components/ui/Icon";

/**
 * Section header — the storefront's signature rhythm.
 *
 * Exhibition wall-label logic: a numeral, a hairline that runs to the edge of
 * the measure, then the title. It gives every section the same spine without
 * decoration, and it solves the Arabic problem that the old design had — it
 * reached for wide-tracked Latin eyebrows ("Shop by Category", "Best Sellers"),
 * which broke the Arabic-only rule and, applied to Arabic, break the cursive
 * joins outright (docs/DESIGN-SYSTEM.md §3.4).
 *
 * Here the eyebrow is a number, so it carries structure with no language at all.
 * The numeral is Arabic-Indic on purpose — decorative, not data (see
 * src/lib/format.ts).
 */
export function SectionHeader({
  index,
  title,
  subtitle,
  actionHref,
  actionLabel,
  tone = "light",
}: {
  /** Position in the page's running order. */
  index: number;
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  /** `dark` inverts for the espresso bands. */
  tone?: "light" | "dark";
}) {
  const muted = tone === "dark" ? "text-brand-200/70" : "text-ink-muted";
  const rule = tone === "dark" ? "bg-brand-200/25" : "bg-line-strong";
  const numeral = tone === "dark" ? "text-brand-200" : "text-brand-600";
  const heading = tone === "dark" ? "text-brand-50" : "text-ink";
  const action = tone === "dark" ? "text-brand-200 hover:text-white" : "text-brand-700 hover:text-brand-800";

  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center gap-3">
        <span className={`text-caption tabular ${numeral}`}>{toArabicIndex(index)}</span>
        <span className={`h-px w-10 ${rule}`} aria-hidden="true" />
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h2 className={`font-display text-display-2 ${heading}`}>{title}</h2>
          {subtitle && <p className={`mt-1.5 max-w-[52ch] text-body-sm ${muted}`}>{subtitle}</p>}
        </div>

        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className={`group inline-flex shrink-0 items-center gap-2 text-body-sm font-semibold transition-colors duration-fast ease-k ${action}`}
          >
            {actionLabel}
            {/* RTL: "forward" is leftward, so the nudge is negative. */}
            <IconArrowEnd className="h-4 w-4 transition-transform duration-base ease-k group-hover:-translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
