import type { Testimonial } from "@/lib/queries/siteSettings";
import type { ReviewSummary } from "@/lib/queries/publicReview";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconStar } from "@/components/ui/Icon";
import { formatRating, reviewCount } from "@/lib/format";

/**
 * Client feedback (spec §6.10).
 *
 * Set as pull-quotes, not cards: large display type on the open canvas, divided
 * by hairlines. A customer's sentence is the most persuasive content on the
 * page, and before the redesign it was 14px grey text inside a bordered box.
 *
 * Three structural problems remained after that first pass, all fixed here:
 *
 * 1. **It only worked at exactly two.** A two-column grid of display quotes
 *    left an empty cell on an odd count and became a wall of headlines once the
 *    admin added a fifth. It is now the same snap rail the rest of the home
 *    page uses, which reads correctly at one testimonial or twelve.
 *
 * 2. **No aggregate.** Individual quotes with no total behind them read as
 *    cherry-picked, and the number is the strongest element a proof section
 *    has. The strip above the rail carries it — sourced from the real approved
 *    reviews (§7.14), not from these admin-authored quotes, and suppressed
 *    below `MIN_REVIEWS_FOR_AVERAGE` because "5.0 من تقييمين" advertises how
 *    little evidence there is.
 *
 * 3. **Type didn't size to content.** One long testimonial set at `h2` blew the
 *    row height out and desynced the columns. Length now picks the treatment:
 *    a short line is a pull-quote, a paragraph is prose.
 *
 * Stars are drawn icons rather than repeated ⭐ emoji — the emoji version
 * changes shape per platform, can't be coloured, and reads to a screen reader
 * as five separate "star" announcements.
 */

/** Below this, an average says more about the sample size than the product. */
const MIN_REVIEWS_FOR_AVERAGE = 5;

/** Past this the section is a wall, not a proof — the rest add nothing. */
const MAX_TESTIMONIALS = 12;

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { name: "سارة", quote: "الجودة ممتازة والتصميم مميز جداً.", rating: 5 },
  { name: "يوسف", quote: "التوصيل كان سريعاً والتعامل راقٍ.", rating: 5 },
];

export function Testimonials({
  testimonials,
  reviewSummary,
}: {
  testimonials: Testimonial[];
  /** Real approved-review aggregate. Omit where it isn't available. */
  reviewSummary?: ReviewSummary;
}) {
  const visible = (testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS).slice(
    0,
    MAX_TESTIMONIALS,
  );

  const showAverage =
    reviewSummary != null && reviewSummary.count >= MIN_REVIEWS_FOR_AVERAGE;

  return (
    <section className="section-k">
      <div className="container-k-wide">
        <SectionHeader index={7} title="آراء عملائنا" subtitle="ما يقوله من اقتنى قطعة من كيان." />

        {showAverage && <AverageStrip summary={reviewSummary} />}

        {/* Same rail vocabulary as the drops and collections rows: bleeds past
            the gutter so the last panel is visibly cut off, which is the
            cheapest honest signal that a row scrolls.

            `tabIndex` because a scroll container is not focusable by default in
            every browser — without it the rail is the one part of the page a
            keyboard cannot reach past the first panel (§9). */}
        <div
          role="group"
          aria-label="آراء العملاء"
          tabIndex={0}
          className="-mx-4 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:gap-10 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {visible.map((t, i) => (
            <QuotePanel key={`${t.name}-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The number, stated once and plainly.
 *
 * Labelled "على منتجات كيان" rather than left bare, because these are product
 * reviews and the quotes beside them are testimonials — two different things,
 * and blurring them is exactly what makes a proof section stop working.
 */
function AverageStrip({ summary }: { summary: ReviewSummary }) {
  return (
    <div className="mb-10 flex flex-col gap-5 border-y border-line py-6 sm:flex-row sm:items-center sm:gap-8 md:mb-14">
      <div className="flex items-center gap-4">
        <span className="font-display text-display-2 tabular text-brand-800">
          {formatRating(summary.average)}
        </span>

        <div>
          <Rating value={summary.average} label={`${formatRating(summary.average)} من 5`} />
          <p className="mt-1.5 text-body-sm text-ink-muted">
            {reviewCount(summary.count)} على منتجات كيان
          </p>
        </div>
      </div>

      <span className="hidden h-10 w-px bg-line sm:block" aria-hidden="true" />

      {/* Claims moderation, which is true (§7.14 — nothing shows until an admin
          approves it). Does not claim verified purchase, which is not. */}
      <p className="max-w-[44ch] text-caption text-ink-muted">
        تُراجَع كل التقييمات قبل نشرها، ولا نحذف رأياً لأنه غير مُرضٍ.
      </p>
    </div>
  );
}

/**
 * Length picks the treatment. A short sentence earns display type; a paragraph
 * is prose and gets body type, because `h2` on 200 characters of Arabic is a
 * wall rather than a quote.
 *
 * The long case also switches to `font-sans`: only Almarai's 700 and 800 are
 * loaded, so body-weight text set in the display family would be snapped back
 * up to 700 and lose the distinction entirely.
 */
function quoteTypography(quote: string): string {
  // `leading-snug` belongs to the display cases only. Applied to the prose
  // case it would override body-lg's 1.75 with 1.375, and Arabic at that
  // leading collides its own diacritics between lines (§3.2).
  if (quote.length <= 90) return "font-display text-h2 leading-snug";
  if (quote.length <= 180) return "font-display text-h3 leading-snug";
  return "font-sans text-body-lg";
}

function QuotePanel({ testimonial }: { testimonial: Testimonial }) {
  const name = testimonial.name.trim();

  return (
    <figure className="flex w-[80vw] shrink-0 snap-start flex-col border-t border-line pt-7 sm:w-[52vw] lg:w-[26rem]">
      <blockquote>
        {/* Six lines is the ceiling: one over-long entry must not set the
            height of every panel beside it. */}
        <p className={`line-clamp-6 text-ink ${quoteTypography(testimonial.quote)}`}>
          {testimonial.quote}
        </p>
      </blockquote>

      {/* `mt-auto` in a stretched flex row aligns every attribution to the same
          baseline regardless of how long the quote above it is. */}
      <figcaption className="mt-auto flex items-center gap-3 pt-7">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-pill bg-brand-100 text-body-sm font-semibold text-brand-700"
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>

        <div className="min-w-0">
          <p className="truncate text-body-sm text-ink">{name}</p>
          <Rating value={testimonial.rating} size="sm" />
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * One `role="img"` with the whole reading, not five announcements. The stars
 * inside are already `aria-hidden` (see Icon.tsx), so the label is the only
 * thing spoken.
 */
function Rating({
  value,
  label,
  size = "md",
}: {
  value: number;
  /** Overrides the default "N من 5 نجوم" reading. */
  label?: string;
  size?: "sm" | "md";
}) {
  // Floor, not round. An individual rating is a whole number so the two agree,
  // but an average of 4.75 rounded up paints five gold stars beside the text
  // "4.8" — and of the two directions to be wrong in, a proof section must
  // never be the flattering one.
  const clamped = Math.min(Math.max(Math.floor(value), 0), 5);
  const dimension = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div
      className="mt-0.5 flex items-center gap-1"
      role="img"
      aria-label={label ?? `${clamped} من 5 نجوم`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <IconStar
          key={i}
          filled={i < clamped}
          className={`${dimension} ${i < clamped ? "text-brand-300" : "text-line-strong"}`}
        />
      ))}
    </div>
  );
}
