import Link from "next/link";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { pieceCount } from "@/lib/listing";
import type { EditorialFrame } from "@/lib/lookbook";

export type Crumb = { label: string; href?: string };

/**
 * Masthead for every product-listing page.
 *
 * Replaces what all four listing pages used to open with — a white
 * `rounded-3xl` box holding a 24px title and a line of grey text — which
 * announced the page in the smallest, least confident way available and put a
 * card between the customer and the first product.
 *
 * The photograph is the design (DESIGN-SYSTEM.md §1). A category is a *place*
 * in the shop, so it gets a full-bleed frame with the name set over it, the
 * same treatment the home page gives its category tiles. Where there is no
 * photograph to use — /favorites, an unphotographed collection — it falls back
 * to the tinted band from the information pages rather than inventing a
 * gradient.
 *
 * Fixed heights, not an aspect ratio: a masthead should be the same band on
 * every page and at every width. `aspect-[21/9]` would be 820px tall on a 1920
 * monitor and push the first product below the fold, which is the one thing a
 * listing page must never do.
 */
export function ListingHero({
  crumbs,
  title,
  description,
  count,
  frame,
  eyebrow,
}: {
  crumbs: Crumb[];
  title: string;
  description?: string | null;
  /** Product count, rendered as an Arabic-correct piece count. Omit to hide. */
  count?: number;
  /** Background photograph. Falls back to the tinted band when absent. */
  frame?: EditorialFrame | null;
  /** Short label above the title — "تشكيلة", "عرض", and so on. */
  eyebrow?: string;
}) {
  return (
    <header>
      <div className="container-k-wide">
        <Breadcrumb crumbs={crumbs} />
      </div>

      {frame ? (
        <div className="relative h-80 overflow-hidden bg-surface-sunken md:h-96 xl:h-[28rem]">
          <ProtectedImage
            src={frame.src}
            srcSet={frame.srcSet}
            sizes="100vw"
            alt={frame.alt}
            priority
            className="h-full w-full object-cover"
          />

          {/* Never trust the photograph to be dark enough (§2.4). */}
          <div className="scrim-k absolute inset-0" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="container-k-wide pb-8 md:pb-12">
              <Title
                eyebrow={eyebrow}
                title={title}
                description={description}
                count={count}
                tone="dark"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="border-y border-line bg-surface-sunken">
          <div className="container-k-wide py-12 md:py-16">
            <Title
              eyebrow={eyebrow}
              title={title}
              description={description}
              count={count}
              tone="light"
            />
          </div>
        </div>
      )}
    </header>
  );
}

function Title({
  eyebrow,
  title,
  description,
  count,
  tone,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  count?: number;
  tone: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div>
      {eyebrow && (
        <div className="flex items-center gap-3">
          <span className={`text-caption ${dark ? "text-brand-200" : "text-brand-600"}`}>{eyebrow}</span>
          <span
            className={`h-px w-10 ${dark ? "bg-brand-200/40" : "bg-line-strong"}`}
            aria-hidden="true"
          />
        </div>
      )}

      <h1
        className={`font-display text-display-1 ${eyebrow ? "mt-3" : ""} ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h1>

      {description && (
        <p
          className={`mt-3 max-w-[56ch] text-body-lg ${
            dark ? "text-brand-100" : "text-ink-muted"
          }`}
        >
          {description}
        </p>
      )}

      {count != null && (
        <p className={`mt-4 text-body-sm ${dark ? "text-brand-200" : "text-ink-muted"}`}>
          {pieceCount(count)}
        </p>
      )}
    </div>
  );
}

/**
 * Breadcrumb sits above the photograph rather than over it. Two scrims on one
 * image — one at each end — grey out the middle of the frame and defeat the
 * point of running a full-bleed photograph at all.
 */
function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="مسار التصفح" className="py-4 text-caption text-ink-muted md:py-5">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="h-px w-3 shrink-0 bg-line-strong" />}
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="transition-colors duration-fast ease-k hover:text-brand-700"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-ink" : undefined}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
