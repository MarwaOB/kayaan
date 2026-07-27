import Link from "next/link";
import { CONTACT, INFO_PAGES, type InfoPageIcon, type InfoPageMeta } from "@/data/site-pages";
import {
  IconDocument,
  IconExchange,
  IconMail,
  IconRuler,
  IconShield,
  IconSparkle,
  IconTruck,
  IconWhatsApp,
} from "@/components/ui/Icon";

const ICONS: Record<InfoPageIcon, (p: { className?: string }) => JSX.Element> = {
  about: IconSparkle,
  ruler: IconRuler,
  truck: IconTruck,
  exchange: IconExchange,
  document: IconDocument,
  shield: IconShield,
};

/**
 * Shell for the six standing information pages (`/pages/*`).
 *
 * Two decisions carry it:
 *
 * 1. **A masthead, not a centred stack.** The old layout centred an emoji, a
 *    title, an English subtitle and a rule inside a 2xl column, which read as a
 *    blog post. These are wayfinding pages, so they get the same wall-label
 *    logic as the home sections: a tinted band, an anchored icon plate, and a
 *    display title on the leading edge.
 * 2. **They are a set, not six orphans.** Every page shows its five siblings —
 *    a sticky rail on desktop, a scroll-snap strip on mobile — so a shopper
 *    checking the return policy can reach the size guide without going back to
 *    the footer. This is the single biggest usability gap in the old build.
 */
export function InfoPageShell({
  page,
  children,
}: {
  page: InfoPageMeta;
  children: React.ReactNode;
}) {
  const Icon = ICONS[page.icon];

  return (
    <main>
      {/* ---- Masthead ------------------------------------------------- */}
      <header className="border-b border-line bg-surface-sunken">
        <div className="container-k py-10 md:py-14">
          <nav aria-label="مسار التصفح" className="text-caption text-ink-muted">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="transition-colors duration-fast ease-k hover:text-brand-700">
                  الرئيسية
                </Link>
              </li>
              <li aria-hidden="true" className="h-px w-3 shrink-0 bg-line-strong" />
              <li aria-current="page" className="text-ink">
                {page.label}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex items-start gap-4 md:gap-5">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-brand-700 text-brand-200 md:h-14 md:w-14"
              aria-hidden="true"
            >
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-display-2 text-ink">{page.title}</h1>
              <p className="mt-2 max-w-[58ch] text-body-lg text-ink-muted">{page.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ---- Sibling nav, mobile ------------------------------------- */}
      <div className="border-b border-line lg:hidden">
        <nav aria-label="صفحات المعلومات" className="container-k py-4">
          {/* The strip bleeds into the gutter so the last chip is visibly cut
              off — that is the affordance that tells you it scrolls. */}
          <ul className="-ms-4 -me-4 flex snap-x snap-mandatory gap-2 overflow-x-auto ps-4 pe-4 md:-ms-6 md:-me-6 md:ps-6 md:pe-6">
            {INFO_PAGES.map((p) => {
              const active = p.slug === page.slug;
              return (
                <li key={p.slug} className="snap-start">
                  <Link
                    href={`/pages/${p.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "flex h-11 items-center whitespace-nowrap rounded-sm bg-brand-700 px-4 text-body-sm font-semibold text-white"
                        : "flex h-11 items-center whitespace-nowrap rounded-sm border border-line-strong px-4 text-body-sm text-ink-muted transition-colors duration-fast ease-k hover:border-brand-400 hover:text-ink"
                    }
                  >
                    {p.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* ---- Body ----------------------------------------------------- */}
      <div className="container-k py-12 md:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          {/* Content first in the DOM: it is what the page is for, and it is
              what a screen reader should reach first. */}
          <div className="min-w-0">
            <div className="max-w-[68ch] space-y-10 md:space-y-12">{children}</div>
            <HelpCard />
          </div>

          <SiblingRail activeSlug={page.slug} />
        </div>
      </div>
    </main>
  );
}

/** Desktop rail. Sticky, so it stays reachable through a long privacy policy. */
function SiblingRail({ activeSlug }: { activeSlug: string }) {
  return (
    <nav aria-label="صفحات المعلومات" className="hidden lg:block">
      <div className="sticky top-24">
        <div className="flex items-center gap-3">
          <span className="text-caption text-brand-600">المعلومات والسياسات</span>
          <span className="h-px flex-1 bg-line-strong" aria-hidden="true" />
        </div>

        <ul className="mt-5 space-y-1">
          {INFO_PAGES.map((p) => {
            const active = p.slug === activeSlug;
            return (
              <li key={p.slug}>
                <Link
                  href={`/pages/${p.slug}`}
                  aria-current={active ? "page" : undefined}
                  // The 2px start rule is always in the box, transparent when
                  // inactive — colouring it in cannot shift the text.
                  className={
                    "block border-s-2 py-2.5 ps-4 text-body-sm transition-colors duration-fast ease-k " +
                    (active
                      ? "border-brand-700 font-semibold text-brand-700"
                      : "border-transparent text-ink-muted hover:border-line-strong hover:text-ink")
                  }
                >
                  {p.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/**
 * Every one of these pages ends with the same unanswered question — "and if my
 * case isn't listed?". Spec §1 puts the answer on WhatsApp, so the page ends
 * there rather than at the last legal clause.
 */
function HelpCard() {
  return (
    <aside className="mt-14 max-w-[68ch] rounded-md border border-line bg-surface p-6 md:mt-16 md:p-8">
      <h2 className="text-h2 text-ink">لم تجد إجابتك؟</h2>
      <p className="mt-2 text-body text-ink-muted">
        فريق كيان يجيبك مباشرة على واتساب خلال ساعات العمل، أو عبر البريد الإلكتروني في أي وقت.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={CONTACT.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-brand-700 px-6 text-body-sm font-semibold text-white transition-colors duration-fast ease-k hover:bg-brand-800"
        >
          <IconWhatsApp className="h-[18px] w-[18px]" />
          راسلنا على واتساب
        </a>
        <a
          href={`mailto:${CONTACT.email}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-line-strong px-6 text-body-sm font-semibold text-brand-700 transition-colors duration-fast ease-k hover:border-brand-400 hover:bg-surface-sunken"
        >
          <IconMail className="h-[18px] w-[18px]" />
          راسلنا بالبريد
        </a>
      </div>

      <p className="mt-5 text-caption text-ink-muted">
        واتساب:{" "}
        <span dir="ltr" className="tabular">
          {CONTACT.whatsapp}
        </span>
      </p>
    </aside>
  );
}
