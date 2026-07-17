"use client";

import { useState } from "react";
import Link from "next/link";

export type GalleryImage = {
  id: string;
  url: string;
  altText: string | null;
  isLifestyle: boolean;
};

export type GalleryHotspot = {
  id: string;
  xPercent: number;
  yPercent: number;
  linkedProduct: {
    id: string;
    slug: string;
    name: string;
    salePrice: number;
    discountPrice: number | null;
    images: { url: string; altText: string | null }[];
  };
};

function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} د.ج`;
}

/**
 * Product image(s) (§7 item 3) + interactive hotspot feature (§7 item 4,
 * inspired by "Based on Love"): clickable dots on lifestyle photos surface
 * the worn article's info in a side panel, letting one photo cross-sell
 * several products at once.
 *
 * Right-click-save is disabled per client's own note (§7 item 3) — cosmetic
 * discouragement only, not real DRM; screenshotting can't be blocked on the web.
 */
export function ProductGallery({
  images,
  hotspotsByImage,
}: {
  images: GalleryImage[];
  hotspotsByImage: Record<string, GalleryHotspot[]>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<GalleryHotspot | null>(null);

  const active = images[activeIndex];
  const hotspots = active ? hotspotsByImage[active.id] ?? [] : [];

  if (!active) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-white text-sm text-neutral-400">
        لا توجد صورة
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[84px_1fr_260px]">
      <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => {
              setActiveIndex(i);
              setActiveHotspot(null);
            }}
            className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition ${
              i === activeIndex ? "border-kayaan-brown" : "border-transparent"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.altText ?? ""} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm sm:order-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.url}
          alt={active.altText ?? ""}
          onContextMenu={(e) => e.preventDefault()}
          className="pointer-events-none h-full w-full select-none object-cover"
          draggable={false}
        />
        {active.isLifestyle &&
          hotspots.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setActiveHotspot(h)}
              aria-label={`عرض ${h.linkedProduct.name}`}
              style={{ left: `${h.xPercent}%`, top: `${h.yPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full border-2 border-white shadow-md transition-transform ${
                activeHotspot?.id === h.id ? "scale-125 bg-kayaan-brown" : "bg-white/90"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-kayaan-brown" style={activeHotspot?.id === h.id ? { background: "white" } : {}} />
            </button>
          ))}
      </div>

      <div className="order-3 hidden sm:block">
        {activeHotspot ? (
          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
            <div className="aspect-square overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeHotspot.linkedProduct.images[0]?.url}
                alt={activeHotspot.linkedProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm font-medium">{activeHotspot.linkedProduct.name}</p>
            <div className="flex items-center gap-2 text-sm">
              {activeHotspot.linkedProduct.discountPrice != null ? (
                <>
                  <span className="font-bold text-kayaan-brownDark">
                    {formatDZD(activeHotspot.linkedProduct.discountPrice)}
                  </span>
                  <span className="text-neutral-400 line-through">
                    {formatDZD(activeHotspot.linkedProduct.salePrice)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-kayaan-brownDark">
                  {formatDZD(activeHotspot.linkedProduct.salePrice)}
                </span>
              )}
            </div>
            <Link
              href={`/products/${activeHotspot.linkedProduct.slug}`}
              className="rounded-full bg-kayaan-brown py-2 text-center text-sm font-bold text-white"
            >
              عرض المنتج
            </Link>
          </div>
        ) : (
          hotspots.length > 0 && (
            <p className="rounded-[1.5rem] border border-dashed border-stone-300 bg-kayaan-bg p-4 text-center text-sm text-neutral-500">
              اضغط على النقطة لعرض تفاصيل القطعة
            </p>
          )
        )}
      </div>
    </div>
  );
}
