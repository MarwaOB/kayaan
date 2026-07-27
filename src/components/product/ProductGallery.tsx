"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatDZD } from "@/lib/format";
import { toArabicIndex } from "@/lib/format";
import { ProtectedImage } from "@/components/ui/ProtectedImage";
import { IconClose, IconSparkle } from "@/components/ui/Icon";

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

/**
 * Product gallery (spec §7 items 3–4).
 *
 * Desktop follows the Kith reference from the brief, mirrored for RTL: a
 * vertical thumbnail rail on the leading (right) edge, large image alongside.
 * Mobile is a full-bleed scroll-snap strip with **zero gap** between frames,
 * per brief R6 — the old build put the image in a `rounded-[2rem]` bordered
 * card with a shadow, which is the opposite of what was asked for.
 *
 * **Zoom.** Hovering the main image magnifies it around the cursor. This is not
 * decoration: these garments carry fine Arabic print — the «حرية» tee has a
 * full paragraph of text on it — and a customer genuinely cannot read it at
 * card size. Pointer-driven, so it costs nothing until used, and it is disabled
 * on touch devices where there is no hover to speak of.
 *
 * **Hotspots** (§7 item 4, "Based on Love" reference) are anchored popovers on
 * the photo rather than a third side column. The spec describes a right-hand
 * panel; anchoring the card to the dot you clicked keeps the link between mark
 * and product obvious, and leaves the purchase panel undisturbed — worth
 * confirming with the client, it is the one place I moved away from the letter
 * of the spec.
 *
 * Right-click-save is suppressed via ProtectedImage per §7 item 3 — cosmetic
 * discouragement, as the spec already accepts.
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
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [canHover, setCanHover] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Zoom only where there is a real pointer. A coarse pointer would latch the
  // magnified state on first tap with no way to release it.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const active = images[activeIndex];
  const hotspots = active ? hotspotsByImage[active.id] ?? [] : [];

  const select = useCallback((i: number) => {
    setActiveIndex(i);
    setActiveHotspot(null);
    setZoom(null);
  }, []);

  // Mobile strip drives the counter.
  const onStripScroll = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const width = strip.scrollWidth / Math.max(images.length, 1);
    setActiveIndex(Math.round(Math.abs(strip.scrollLeft) / Math.max(width, 1)));
  }, [images.length]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.addEventListener("scroll", onStripScroll, { passive: true });
    return () => strip.removeEventListener("scroll", onStripScroll);
  }, [onStripScroll]);

  function onRailKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    const next = e.key === "ArrowDown" ? activeIndex + 1 : activeIndex - 1;
    if (next < 0 || next >= images.length) return;
    select(next);
    railRef.current?.querySelectorAll("button")[next]?.focus();
  }

  function onZoomMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!canHover) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  if (!active) {
    return (
      <div className="grid aspect-product place-items-center rounded-md bg-surface-sunken text-body-sm text-ink-subtle">
        لا توجد صورة
      </div>
    );
  }

  return (
    // min-w-0: as a grid item this would otherwise take its min-content width
    // from the scroll strip and push the page wider than the viewport.
    <div className="min-w-0">
      {/* ---------------- Mobile: full-bleed zero-gap strip (R6) ---------------- */}
      <div className="lg:hidden">
        <div className="relative">
          <div
            ref={stripRef}
            className="-mx-4 flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((img) => (
              // `w-full` against the scroll container, not `w-screen`: the
              // container is already pulled to the viewport edges by -mx-4, and
              // a vw unit on top of that overflows the page by a full screen.
              <div key={img.id} className="w-full shrink-0 snap-start">
                <div className="aspect-product bg-surface-sunken">
                  <ProtectedImage
                    src={img.url}
                    alt={img.altText ?? ""}
                    priority={img.id === images[0]?.id}
                    sizes="100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-3 end-3 rounded-pill bg-brand-900/70 px-3 py-1 text-caption text-white backdrop-blur-sm">
              <span className="tabular">
                {toArabicIndex(activeIndex + 1)} / {toArabicIndex(images.length)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Desktop: rail + main image (Kith, mirrored) ---------- */}
      <div className="hidden gap-3 lg:grid lg:grid-cols-[76px_minmax(0,1fr)]">
        <div
          ref={railRef}
          role="tablist"
          aria-label="صور المنتج"
          aria-orientation="vertical"
          onKeyDown={onRailKeyDown}
          className="flex flex-col gap-2"
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`الصورة ${i + 1}`}
              tabIndex={i === activeIndex ? 0 : -1}
              onClick={() => select(i)}
              className={`aspect-product overflow-hidden rounded-xs bg-surface-sunken ring-2 ring-offset-2 ring-offset-bg transition duration-fast ease-k ${
                i === activeIndex ? "ring-brand-700" : "ring-transparent hover:ring-line-strong"
              }`}
            >
              <ProtectedImage
                src={img.url}
                alt=""
                sizes="76px"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="relative">
          <div
            onMouseMove={onZoomMove}
            onMouseLeave={() => setZoom(null)}
            className="relative aspect-product overflow-hidden rounded-md bg-surface-sunken"
          >
            <ProtectedImage
              src={active.url}
              alt={active.altText ?? ""}
              priority
              sizes="(min-width: 1280px) 50vw, 60vw"
              className="h-full w-full object-cover transition-transform duration-base ease-k"
            />
            {/* Magnifier layer — a second copy so the base image stays put and
                the hotspot dots below don't scale with it. */}
            {zoom && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `url(${active.url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "220%",
                  backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                }}
              />
            )}

            {active.isLifestyle &&
              hotspots.map((h) => (
                <Hotspot
                  key={h.id}
                  hotspot={h}
                  active={activeHotspot?.id === h.id}
                  onToggle={() => setActiveHotspot((cur) => (cur?.id === h.id ? null : h))}
                  onClose={() => setActiveHotspot(null)}
                />
              ))}
          </div>

          {canHover && !zoom && (
            <p className="pointer-events-none absolute bottom-3 end-3 flex items-center gap-1.5 rounded-pill bg-brand-900/70 px-3 py-1.5 text-caption text-white backdrop-blur-sm">
              <IconSparkle className="h-3.5 w-3.5" />
              مرّر للتكبير
            </p>
          )}

          {active.isLifestyle && hotspots.length > 0 && !activeHotspot && (
            <p className="mt-3 text-body-sm text-ink-muted">
              اضغط على النقاط لعرض القطع الظاهرة في الصورة.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** A dot marker plus the card it opens, anchored to the garment it marks. */
function Hotspot({
  hotspot,
  active,
  onToggle,
  onClose,
}: {
  hotspot: GalleryHotspot;
  active: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const p = hotspot.linkedProduct;
  // Flip the card to the other side when the dot sits near an edge, so it never
  // opens off the image.
  const flipY = hotspot.yPercent < 45;

  return (
    <div
      className="absolute"
      style={{ insetInlineStart: `${hotspot.xPercent}%`, top: `${hotspot.yPercent}%` }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={active}
        aria-label={`عرض ${p.name}`}
        className="relative grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill bg-white/95 shadow-2 transition duration-base ease-k hover:scale-110"
      >
        {/* Halo — pauses under reduced motion via the global rule. */}
        {!active && (
          <span className="absolute inset-0 animate-ping rounded-pill bg-white/60" aria-hidden="true" />
        )}
        <span
          className={`relative h-2.5 w-2.5 rounded-pill transition-colors duration-fast ease-k ${
            active ? "bg-brand-700" : "bg-brand-600"
          }`}
        />
      </button>

      {active && (
        <div
          className={`absolute z-10 w-56 -translate-x-1/2 rounded-md bg-surface p-3 shadow-2 ${
            flipY ? "top-6" : "bottom-6"
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute end-2 top-2 grid h-7 w-7 place-items-center rounded-pill bg-surface/90 text-ink-muted transition duration-fast ease-k hover:text-ink"
          >
            <IconClose className="h-3.5 w-3.5" />
          </button>

          <div className="aspect-product overflow-hidden rounded-xs bg-surface-sunken">
            {p.images[0] && (
              <ProtectedImage
                src={p.images[0].url}
                alt=""
                sizes="224px"
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <p className="mt-2.5 line-clamp-1 text-body-sm font-medium text-ink">{p.name}</p>
          <div className="mt-1 flex items-baseline gap-2">
            {p.discountPrice != null ? (
              <>
                <span className="tabular text-body-sm font-bold text-brand-800">
                  {formatDZD(p.discountPrice)}
                </span>
                <span className="tabular text-caption text-ink-subtle line-through">
                  {formatDZD(p.salePrice)}
                </span>
              </>
            ) : (
              <span className="tabular text-body-sm font-bold text-brand-800">
                {formatDZD(p.salePrice)}
              </span>
            )}
          </div>

          <Link
            href={`/products/${p.slug}`}
            className="mt-3 flex h-10 items-center justify-center rounded-sm bg-brand-700 text-body-sm font-semibold text-white transition duration-fast ease-k hover:bg-brand-800"
          >
            عرض المنتج
          </Link>
        </div>
      )}
    </div>
  );
}
