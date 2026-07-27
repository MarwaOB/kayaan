// Icon set.
//
// Interactive affordances use these, not emoji — docs/DESIGN-SYSTEM.md §3.5.
// Apple's emoji only render on Apple devices, and roughly all of this store's
// traffic is Android; a cart glyph that changes shape per platform, can't take
// `currentColor`, and can't be sized reliably is not a control.
//
// Emoji stay for *content* (🤎 in brand copy, the admin-authored running-bar
// icons) via the `.emoji` utility.
//
// All icons are 24×24, 1.5px stroke, inherit `currentColor`, and are
// aria-hidden — the accessible name belongs on the button that wraps them.

type IconProps = {
  className?: string;
  /** Stroke width. Bump to 2 when the icon sits under 18px. */
  weight?: number;
};

function Svg({
  children,
  className = "h-5 w-5",
  weight = 1.5,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h11" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

/** Shopping bag — an object, so it does not mirror in RTL (§8). */
export function IconBag(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 8h15l-1.1 11.2a1.8 1.8 0 0 1-1.8 1.6H7.4a1.8 1.8 0 0 1-1.8-1.6L4.5 8Z" />
      <path d="M8.75 8V6.4a3.25 3.25 0 0 1 6.5 0V8" />
    </Svg>
  );
}

export function IconHeart({ filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...props}>
      <path
        d="M12 20.3s-7.6-4.6-7.6-9.6A4.2 4.2 0 0 1 12 7.9a4.2 4.2 0 0 1 7.6 2.8c0 5-7.6 9.6-7.6 9.6Z"
        fill={filled ? "currentColor" : "none"}
      />
    </Svg>
  );
}

/**
 * Chevron pointing toward the *end* of the line — direction-bearing, so it
 * mirrors with `dir` (§8). Callers get "next" in RTL without a manual flip.
 */
export function IconChevronEnd(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" className="rtl:hidden" />
      <path d="M14.5 5.5 8 12l6.5 6.5" className="hidden rtl:block" />
    </Svg>
  );
}

export function IconChevronStart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.5 5.5 8 12l6.5 6.5" className="rtl:hidden" />
      <path d="M9.5 5.5 16 12l-6.5 6.5" className="hidden rtl:block" />
    </Svg>
  );
}

/**
 * Down chevron — points down in both directions, so it never needs mirroring.
 * Use this for disclosure (selects, accordions): rotating a direction-bearing
 * chevron to fake "down" lands on "up" in one of the two writing directions.
 */
export function IconChevronDown(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5.5 9.5 12 16l6.5-6.5" />
    </Svg>
  );
}

export function IconArrowEnd(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" className="rtl:hidden" />
      <path d="M20 12H4M10 6l-6 6 6 6" className="hidden rtl:block" />
    </Svg>
  );
}

export function IconStar({ filled = true, ...props }: IconProps & { filled?: boolean }) {
  return (
    <Svg {...props}>
      <path
        d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"
        fill={filled ? "currentColor" : "none"}
      />
    </Svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 7.5h10.5v9H3zM13.5 11h4l3 3v2.5h-7z" />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </Svg>
  );
}

export function IconWallet(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2Z" />
      <path d="M18.5 10.5h2v4h-2a2 2 0 0 1 0-4Z" />
    </Svg>
  );
}

export function IconHeadset(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M4.5 13.5h2.2v5H5.6a1.1 1.1 0 0 1-1.1-1.1zM19.5 13.5h-2.2v5h1.1a1.1 1.1 0 0 0 1.1-1.1z" />
    </Svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
    </Svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconWhatsApp({ className = "h-5 w-5" }: IconProps) {
  // Solid — this one reads as a recognisable brand glyph, not a line icon.
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.06c-.25.69-1.45 1.32-1.99 1.36-.53.05-1.03.24-3.47-.72-2.93-1.15-4.78-4.15-4.92-4.34-.14-.19-1.17-1.55-1.17-2.96s.74-2.1 1-2.39c.26-.29.57-.36.76-.36l.54.01c.18.01.41-.07.64.49.25.6.83 2.07.9 2.22.07.15.12.32.02.51-.1.19-.15.31-.29.48l-.44.51c-.14.15-.29.31-.13.6.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.14.26.09 1.65.78 1.94.92.29.14.48.22.55.34.07.12.07.7-.18 1.39Z" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 8 8 5 8-5" />
    </Svg>
  );
}

/** Two arrows turning back on each other — an object, so it does not mirror. */
export function IconExchange(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 8.5h13l-3-3M20 15.5H7l3 3" />
    </Svg>
  );
}

export function IconDocument(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3.5h7.5L18 8v12.5H6z" />
      <path d="M13.5 3.5V8H18M9 12.5h6M9 16h4" />
    </Svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.2 19 6v5.4c0 4.2-2.9 7.5-7 9.4-4.1-1.9-7-5.2-7-9.4V6l7-2.8Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </Svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.9" r=".9" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.2 21 19.8H3L12 4.2Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="16.8" r=".9" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Svg>
  );
}

export function IconRuler(props: IconProps) {
  // Two ticks, not four — at 16px the denser version turned into a smudge that
  // read as a barcode.
  return (
    <Svg {...props}>
      <rect x="2.5" y="9" width="19" height="6" rx="1.5" />
      <path d="M9 9v3M15 9v3" />
    </Svg>
  );
}
