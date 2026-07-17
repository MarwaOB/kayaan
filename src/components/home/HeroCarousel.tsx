"use client";

import { useState } from "react";
import Link from "next/link";
import type { HeroSlide } from "@/lib/queries/siteSettings";

/** Hero cover / carousel (§6.3) — main visual banner, admin-editable slides. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const safeSlides = slides.length > 0 ? slides : [{ imageUrl: "/images/seed/hero-1.svg", headline: "كيان… أكثر من ستايل" }];
  const slide = safeSlides[index] ?? safeSlides[0];

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/7]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slide.imageUrl} alt={slide.headline} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-end gap-3 p-8 text-center text-white">
        <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur">
          كيان · Clothing
        </div>
        <h1 className="max-w-3xl text-2xl font-bold sm:text-4xl">{slide.headline}</h1>
        {slide.ctaLabel && slide.ctaHref && (
          <Link href={slide.ctaHref} className="rounded-full bg-white px-6 py-2 text-sm font-bold text-kayaan-ink transition hover:-translate-y-0.5 hover:bg-kayaan-accent">
            {slide.ctaLabel}
          </Link>
        )}
      </div>

      {safeSlides.length > 1 && (
        <div className="absolute bottom-3 start-1/2 flex -translate-x-1/2 gap-2">
          {safeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`الشريحة ${i + 1}`}
              className={`h-2.5 rounded-full transition ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
