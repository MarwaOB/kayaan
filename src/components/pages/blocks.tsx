// Content primitives for the information pages.
//
// The old /pages route styled every block inline, which is how it ended up with
// `text-xs` body copy (12px — the floor is 15px, §3.2), `neutral-*` greys, four
// radii and a shadow on every card. Fixing that once per page would have left
// the same drift a month later, so the vocabulary is fixed here instead: a page
// composes these and cannot reach for a raw value.
//
// Everything below is a server component — no page here needs interactivity.

import { toArabicIndex } from "@/lib/format";
import { IconAlert, IconCheck, IconInfo, IconSparkle } from "@/components/ui/Icon";
import { Logo } from "@/components/brand/Logo";
import type { SizeTableSpec } from "@/data/size-guide";

/* ---------------------------------------------------------------- text --- */

/** A titled block. The hairline gives the page the same spine as the home sections. */
export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <span className="block h-px w-10 bg-line-strong" aria-hidden="true" />
      <h2 className="mt-4 font-display text-h1 text-ink">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

/**
 * The opening statement. Set larger than the body and hung off a sand rule —
 * it is the one paragraph a shopper who skims will actually read.
 */
export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-s-2 border-brand-300 ps-5 text-body-lg font-medium text-ink">{children}</p>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-body-lg text-ink-muted">{children}</p>;
}

/** Inline emphasis inside a paragraph. */
export function Em({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>;
}

/* ------------------------------------------------------------ callouts --- */

type CalloutTone = "note" | "tip" | "warn";

const CALLOUT: Record<CalloutTone, { border: string; icon: string; Icon: typeof IconInfo }> = {
  note: { border: "border-line", icon: "text-brand-600", Icon: IconInfo },
  tip: { border: "border-line", icon: "text-brand-600", Icon: IconSparkle },
  warn: { border: "border-warning", icon: "text-warning", Icon: IconAlert },
};

/**
 * Tone is carried by an icon and a title as well as the border colour — colour
 * is never the only signal (§9).
 */
export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: CalloutTone;
  title: string;
  children: React.ReactNode;
}) {
  const { border, icon, Icon } = CALLOUT[tone];

  return (
    <div className={`flex gap-4 rounded-md border ${border} bg-surface-sunken p-5 md:p-6`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${icon}`} />
      <div className="min-w-0">
        <p className="text-body font-semibold text-ink">{title}</p>
        <div className="mt-1.5 space-y-2 text-body text-ink-muted">{children}</div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- lists --- */

/** Numbered timeline. The connector is rendered per item rather than as a
 *  pseudo-element so the last step does not trail a stub of line. */
export function Steps({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4">
          <div className="flex flex-col items-center">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-brand-700 text-body-sm font-semibold text-brand-200">
              {toArabicIndex(i + 1)}
            </span>
            {i < steps.length - 1 && (
              <span className="mt-2 w-px flex-1 bg-line-strong" aria-hidden="true" />
            )}
          </div>

          <div className={i < steps.length - 1 ? "pb-8" : ""}>
            <h3 className="text-h3 text-ink">{step.title}</h3>
            <p className="mt-1.5 text-body text-ink-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Ticked list — used wherever the copy is a set of guarantees or conditions. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <IconCheck className="mt-1 h-4 w-4 shrink-0 text-success" weight={2} />
          <span className="text-body text-ink-muted">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Excluded / not-permitted items. Reads as the inverse of CheckList. */
export function ExcludeList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-xs border border-danger px-3 py-1.5 text-caption text-danger"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Numbered legal clauses. The ghost numeral gives ten near-identical paragraphs
 * a scannable edge without a heavier device like a card or an accordion.
 */
export function Clauses({
  clauses,
}: {
  clauses: { title: string; body: React.ReactNode }[];
}) {
  return (
    <ol className="border-t border-line">
      {clauses.map((clause, i) => (
        <li key={clause.title} className="border-b border-line py-6">
          <div className="flex gap-4 md:gap-5">
            {/* 22px at weight 700 — above the size floor where --k-brand-400
                clears contrast on the canvas (§2.4). */}
            <span className="shrink-0 font-display text-h2 text-brand-400" aria-hidden="true">
              {toArabicIndex(i + 1)}
            </span>
            <div className="min-w-0">
              <h3 className="text-h3 text-ink">{clause.title}</h3>
              <div className="mt-2 space-y-2 text-body text-ink-muted">{clause.body}</div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* --------------------------------------------------------------- cards --- */

/** Side-by-side statements — vision/mission, or who-pays-what. */
export function Panels({
  panels,
}: {
  panels: { title: string; body: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {panels.map((panel) => (
        <div key={panel.title} className="rounded-md border border-line bg-surface p-6">
          <h3 className="text-h3 text-brand-700">{panel.title}</h3>
          <p className="mt-2 text-body text-ink-muted">{panel.body}</p>
        </div>
      ))}
    </div>
  );
}

/** One number worth pulling out of a paragraph — a deadline, a window. */
export function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-5 rounded-md border border-line bg-surface p-6">
      <div className="flex shrink-0 items-baseline gap-1.5">
        <span className="tabular font-display text-display-2 text-brand-700">{value}</span>
        <span className="text-body font-semibold text-brand-600">{unit}</span>
      </div>
      <p className="text-body text-ink-muted">{label}</p>
    </div>
  );
}

/**
 * The brand line, given the one moment of full contrast on the page. Espresso
 * field and the sand lockup is the pairing the logo masters were drawn for
 * (§2.5) — it is also the only place these pages carry the mark.
 */
export function BrandQuote({ line, sub }: { line: string; sub: string }) {
  return (
    <div className="rounded-md bg-brand-900 px-6 py-10 text-center md:px-10 md:py-12">
      <Logo mark="lockup-stacked" colorway="sand" width={120} decorative className="mx-auto" />
      <p className="mt-7 font-display text-h1 text-brand-200">{line}</p>
      <p className="mx-auto mt-3 max-w-[42ch] text-body text-brand-100">{sub}</p>
    </div>
  );
}

/* -------------------------------------------------------------- tables --- */

/**
 * Size chart. Wide content scrolls inside its own container so the page body
 * never scrolls sideways (§4.4). Numerals are isolated with `dir="ltr"` — a
 * range like 70–80 reverses inside an RTL run otherwise (§8).
 */
export function SizeTable({ spec }: { spec: SizeTableSpec }) {
  return (
    <div className="overflow-x-auto rounded-md border border-line bg-surface">
      <table className="w-full min-w-[26rem] border-collapse text-body-sm">
        <caption className="sr-only">{`${spec.title} — القياسات بالسنتيمتر`}</caption>
        <thead>
          <tr className="border-b border-line-strong bg-surface-sunken">
            {spec.columns.map((col) => (
              <th key={col} scope="col" className="px-4 py-3 text-start text-caption text-ink-muted">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.rows.map((row) => (
            <tr key={row.size} className="border-b border-line last:border-0">
              <th scope="row" className="px-4 py-3 text-start font-semibold text-ink">
                {row.size}
              </th>
              {row.values.map((value, i) => (
                <td key={spec.columns[i + 1]} className="px-4 py-3 text-start text-ink-muted">
                  <span dir="ltr" className="tabular">
                    {value}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
