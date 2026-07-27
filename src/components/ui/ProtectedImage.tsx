"use client";

/**
 * Product/editorial image with the save-deterrent from brief R3 applied.
 *
 * Exists as its own client component for two reasons: the `onContextMenu`
 * handler cannot be passed from a server component, and the deterrent was
 * otherwise being re-typed at every call site — which is how one of them
 * eventually ends up missing it.
 *
 * The protection is explicitly cosmetic. Screenshots are not preventable on the
 * web, the spec already records that as accepted, and nothing here is allowed
 * to cost load performance or accessibility. Plain <img> rather than next/image
 * because these sources are pre-sized WebP from the asset pipeline with their
 * own srcset — the optimiser would re-encode work already done.
 */
export function ProtectedImage({
  src,
  srcSet,
  sizes,
  alt,
  className,
  priority = false,
}: {
  src: string;
  srcSet?: string;
  sizes?: string;
  /** Arabic alt text. Pass "" only for genuinely decorative images. */
  alt: string;
  className?: string;
  /** Set for above-the-fold images — skips lazy loading and raises priority. */
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`no-save ${className ?? ""}`}
    />
  );
}
