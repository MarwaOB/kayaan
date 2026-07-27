"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HeroSlide } from "@/lib/queries/siteSettings";
import { HERO_SHOTS } from "@/lib/lookbook";
import { toSrcSet } from "@/lib/media";
import { toArabicIndex } from "@/lib/format";
import { IconChevronEnd, IconChevronStart } from "@/components/ui/Icon";
import { ProtectedImage } from "@/components/ui/ProtectedImage";

/**
 * Hero (spec §6.3, brief R6 — "Based on Love" reference).
 *
 * The brief is specific: on large screens the main image is swipable with **no
 * gap between images**, and on mobile it must not become "small rectangles".
 * So: true full-bleed, zero gutter, no rounding, one slide per viewport width
 * on mobile, and a 92vw slide on desktop so the next frame peeks in at the
 * leading edge and advertises that the rail moves.
 *
 * Built on CSS scroll-snap rather than a carousel library — it gives native
 * touch momentum, keyboard scrolling and reduced-motion behaviour for free, and
 * ships no JavaScript to do it. The buttons just call `scrollBy`.
 *
 * Progress is a numbered rule set rather than dots: it matches the section
 * numbering used down the rest of the page.
 */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Editorial photography stands in when a slide has no image, or still points
  // at one of the grey /images/seed placeholders. Presentation-layer only —
  // whatever the admin sets always wins.
  const resolved = (slides.length > 0 ? slides : HERO_SHOTS.map(toSlide)).map((slide, i) => {
    const isPlaceholder = !slide.imageUrl || slide.imageUrl.includes("/images/seed/");
    const shot = HERO_SHOTS[i % Math.max(HERO_SHOTS.length, 1)];
    return {
      ...slide,
      imageUrl: isPlaceholder && shot ? shot.image.src : slide.imageUrl,
      srcSet: isPlaceholder && shot ? toSrcSet(shot.image) : undefined,
    };
  });

  const onScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const slideWidth = rail.scrollWidth / Math.max(resolved.length, 1);
    // scrollLeft is negative in RTL on standards-compliant engines.
    setIndex(Math.round(Math.abs(rail.scrollLeft) / Math.max(slideWidth, 1)));
  }, [resolved.length]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollTo = (i: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const clamped = Math.min(Math.max(i, 0), resolved.length - 1);
    const slideWidth = rail.scrollWidth / Math.max(resolved.length, 1);
    const direction = getComputedStyle(rail).direction === "rtl" ? -1 : 1;
    rail.scrollTo({ left: direction * clamped * slideWidth, behavior: "smooth" });
  };

  if (resolved.length === 0) return null;

  return (
    // No `bleed-k`: this section's parent is <main>, which carries no
    // container, so it is already document-width. Adding the utility would
    // force `width: 100vw` — wider than the document by the scrollbar — and
    // reintroduce the horizontal overflow it exists to avoid.
    <section aria-label="الواجهة" className="relative">
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {resolved.map((slide, i) => (
          <div
            key={i}
            className="relative w-full shrink-0 snap-start lg:w-[92vw]"
            aria-roledescription="شريحة"
            aria-label={`${i + 1} من ${resolved.length}`}
          >
            {/* The shoot is portrait. A 16:9 desktop crop of a 4:5 source cuts
                the model off at the waist, so the frame stays taller than a
                conventional hero and the crop is anchored high. */}
            <div className="relative aspect-product sm:aspect-[4/3] lg:aspect-[16/10]">
              <ProtectedImage
                src={slide.imageUrl}
                srcSet={slide.srcSet}
                sizes="100vw"
                alt={slide.headline}
                // First slide is the LCP element — never lazy, never deferred.
                priority={i === 0}
                className="h-full w-full object-cover object-[center_22%]"
              />
              <div className="scrim-k absolute inset-0" />

              {/* Only the active slide shows its copy. The peeking neighbour
                  should read as an image edge, not as clipped half-words. */}
              <div
                aria-hidden={i !== index}
                className={`absolute inset-x-0 bottom-0 transition-opacity duration-slow ease-k ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="container-k-wide pb-14 pt-10 md:pb-20">
                  <div className="max-w-[34rem]">
                    <div className="flex items-center gap-3">
                      <span className="h-px w-10 bg-brand-200/60" aria-hidden="true" />
                      <span className="text-caption text-brand-200">من الجزائر</span>
                    </div>

                    {/* `ch` here would resolve against the parent's body size,
                        not the display size, and squeeze the line to one word. */}
                    <h1 className="mt-4 max-w-[14ch] font-display text-display-1 text-white">
                      {slide.headline}
                    </h1>

                    {slide.ctaLabel && slide.ctaHref && (
                      <Link
                        href={slide.ctaHref}
                        className="mt-7 inline-flex h-12 items-center rounded-sm bg-white px-7 text-body font-semibold text-brand-800 transition duration-fast ease-k hover:bg-brand-200"
                      >
                        {slide.ctaLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {resolved.length > 1 && (
        <>
          <div className="pointer-events-none absolute inset-y-0 start-0 hidden items-center ps-4 md:flex">
            <HeroControl onClick={() => scrollTo(index - 1)} disabled={index === 0} label="الشريحة السابقة">
              <IconChevronStart className="h-5 w-5" />
            </HeroControl>
          </div>
          <div className="pointer-events-none absolute inset-y-0 end-0 hidden items-center pe-4 md:flex">
            <HeroControl
              onClick={() => scrollTo(index + 1)}
              disabled={index === resolved.length - 1}
              label="الشريحة التالية"
            >
              <IconChevronEnd className="h-5 w-5" />
            </HeroControl>
          </div>

          {/* Numbered progress — echoes the section numbering (SectionHeader). */}
          <div className="absolute inset-x-0 bottom-5 md:bottom-7">
            <div className="container-k-wide flex items-center gap-3">
              <span className="tabular text-caption text-white">{toArabicIndex(index + 1)}</span>
              <div className="flex flex-1 gap-1.5" role="tablist" aria-label="الشرائح">
                {resolved.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`الشريحة ${i + 1}`}
                    onClick={() => scrollTo(i)}
                    className="group h-4 flex-1"
                  >
                    <span
                      className={`block h-px w-full transition-colors duration-base ease-k ${
                        i === index ? "bg-white" : "bg-white/35 group-hover:bg-white/60"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="tabular text-caption text-white/60">{toArabicIndex(resolved.length)}</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function toSlide(shot: (typeof HERO_SHOTS)[number]): HeroSlide {
  return {
    imageUrl: shot.image.src,
    headline: "كيان… أكثر من ستايل",
    ctaLabel: "تصفّح المجموعة",
    ctaHref: "/top-selling",
  };
}

function HeroControl({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="pointer-events-auto grid h-11 w-11 place-items-center rounded-pill bg-white/85 text-ink backdrop-blur-sm transition duration-fast ease-k hover:bg-white disabled:pointer-events-none disabled:opacity-0"
    >
      {children}
    </button>
  );
}
