import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Logo } from "@/components/brand/Logo";
import { LOOKBOOK, STATEMENT_SHOT } from "@/lib/lookbook";
import { toSrcSet } from "@/lib/media";
import { toArabicIndex } from "@/lib/format";
import { IconArrowEnd, IconInstagram } from "@/components/ui/Icon";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

/**
 * Why Kayaaan (spec §6.11).
 *
 * The previous version — three numbered columns of body text on a white band —
 * was correct on tokens and wrong on substance, in three ways:
 *
 * 1. **It was the only section on the home page with no photograph**, sitting
 *    between the testimonials (text) and the Instagram band (images). The first
 *    principle of the design system is that the photograph is the design; this
 *    was the flattest moment on the page.
 *
 * 2. **Its claims were the kind any shop could make.** "تصاميم أصيلة / جودة
 *    عالية / تجربة مختلفة" as bare headlines are indistinguishable from every
 *    other store's, and an unsupported claim in a purchase funnel costs trust
 *    rather than building it. The section now leads with the client's own
 *    sentence from spec §1 — "لا نصنع ملابس فقط، بل نصنع تجربة" — which is
 *    specific, is theirs, and does the persuading the three headlines could not.
 *    Every line below is §1 verbatim or close to it; nothing here is invented,
 *    and in particular nothing claims a provenance or a process the spec does
 *    not record.
 *
 * 3. **It was a dead end.** A reader convinced by this section has exactly one
 *    next step — the about page — and there was no way to get there.
 *
 * Structural fixes: three `h2` headings under one `display-2` flattened the
 * hierarchy, so the points drop to `h3`; and three columns of Arabic at 768px
 * gave each a ~230px measure, which is far too tight for the script. Stacking
 * them beside the photograph gives every line a comfortable measure at every
 * width.
 *
 * Service reasons (cash on delivery, 58 wilayas, customer service) are
 * deliberately absent — the running bar carries those four items directly above
 * (§6.5), and repeating them here would trade a brand argument for an echo.
 */
export function WhyChooseUs() {
  // Spec §1, "ماذا نقدم؟" — kept close to the client's wording rather than
  // rewritten into marketing copy.
  const points = [
    {
      title: "تصاميم أصيلة",
      text: "تصاميم مستوحاة من الثقافة العربية والإسلامية، تُروى بخط عربي معاصر.",
    },
    {
      title: "جودة عالية",
      text: "خامات مختارة واهتمام بأدق التفاصيل في كل قطعة.",
    },
    {
      title: "تجربة مختلفة",
      text: "كل تصميم له فكرة، وكل قطعة لها قصة.",
    },
  ];

  return (
    <section className="section-k bg-surface">
      <div className="container-k-wide">
        <SectionHeader index={8} title="لماذا كيان؟" />

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24">
          {/* 4:3 on phones so a portrait crop doesn't push the argument a full
              screen down; the taller 4:5 only once it has a column to itself. */}
          {STATEMENT_SHOT && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-sunken lg:aspect-product">
              <ProtectedImage
                src={STATEMENT_SHOT.image.src}
                srcSet={toSrcSet(STATEMENT_SHOT.image)}
                sizes="(min-width: 1024px) 46vw, 100vw"
                alt={STATEMENT_SHOT.alt}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div>
            {/* The client's own sentence, spec §1. */}
            {/* No `leading-*` override: `display-2` already carries 1.2, and
                `leading-snug` is 1.375 — it would loosen the quote, not tighten
                it. The scale's line-heights are set for Arabic (§3.2). */}
            <p className="max-w-[18ch] font-display text-display-2 text-ink">
              لا نصنع ملابس فقط، بل نصنع تجربة.
            </p>

            {/* A list, not an ordered list: these are three reasons, not a
                ranking, so the numerals are editorial marks — the same ones the
                section headers use — and are hidden from screen readers rather
                than read out as positions. */}
            <ul className="mt-9">
              {points.map((point, i) => (
                <li key={point.title} className="flex gap-4 border-t border-line py-6 md:gap-6">
                  <span className="mt-1 shrink-0 tabular text-caption text-brand-600" aria-hidden="true">
                    {toArabicIndex(i + 1)}
                  </span>
                  <div>
                    <h3 className="font-display text-h3 text-ink">{point.title}</h3>
                    <p className="mt-1.5 max-w-[46ch] text-body text-ink-muted">{point.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 max-w-[46ch] text-body text-ink-muted">
              وكل عميل هو جزء من هذا الأثر.
            </p>

            <Link
              href="/pages/about"
              className="group mt-6 inline-flex h-11 items-center gap-2 rounded-sm border border-line-strong px-6 text-body-sm font-semibold text-brand-700 transition-colors duration-fast ease-k hover:border-brand-400 hover:bg-surface-sunken"
            >
              اقرأ قصة كيان
              {/* RTL: "forward" is leftward, so the nudge is negative. */}
              <IconArrowEnd className="h-4 w-4 transition-transform duration-base ease-k group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Instagram / community callout (spec §6.12).
 *
 * An espresso band carrying the real lockup and a strip of lookbook frames —
 * the section is an invitation to see more of the brand, so it should show the
 * brand rather than describe it. The old version was a translucent rounded box
 * with a bare text link.
 */
export function InstagramCallout() {
  const frames = LOOKBOOK.slice(0, 6);

  return (
    <section className="section-k bg-brand-900">
      <div className="container-k-wide">
        <div className="flex flex-col items-center text-center">
          <Logo mark="lockup-stacked" colorway="sand" width={148} />

          <h2 className="mt-8 max-w-[20ch] font-display text-display-2 text-brand-50">
            تابعونا على إنستغرام
          </h2>
          <p className="mt-3 max-w-[46ch] text-body text-brand-200/80">
            أحدث الإصدارات، الخصومات الخاصة، والكواليس — أولاً مع مجتمع كيان.
          </p>

          <a
            href="https://instagram.com/kayaaan.clothing"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex h-12 items-center gap-2.5 rounded-sm bg-brand-200 px-7 text-body font-semibold text-brand-900 transition duration-fast ease-k hover:bg-white"
          >
            <IconInstagram className="h-[18px] w-[18px]" />
            @kayaaan.clothing
          </a>
        </div>
      </div>

      {frames.length > 0 && (
        <div className="mt-12 grid grid-cols-3 gap-0.5 md:grid-cols-6">
          {frames.map((shot, i) => (
            <div key={i} className="aspect-square overflow-hidden bg-brand-800">
              <ProtectedImage
                src={shot.image.srcset["400"] ?? shot.image.src}
                srcSet={toSrcSet(shot.image)}
                sizes="(min-width: 768px) 17vw, 33vw"
                alt={shot.alt}
                className="h-full w-full object-cover opacity-90 transition duration-slow ease-k hover:opacity-100"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
