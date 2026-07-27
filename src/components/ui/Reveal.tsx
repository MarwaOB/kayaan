"use client";

import { useEffect, useRef } from "react";

/**
 * Reveals its children as they scroll into view.
 *
 * The hidden-until-seen state lives in CSS behind a `.js` class that a tiny
 * inline script in the root layout adds before first paint. That ordering
 * matters: the server HTML is fully visible, so if JavaScript is blocked,
 * slow, or errors, the page still renders its content — a shop whose products
 * are invisible without JS is worse than a shop with no animation.
 *
 * **Not built on IntersectionObserver.** IO only fires when an element crosses
 * a threshold, and an element can go from below the viewport to above it inside
 * a single frame — a jump to the page bottom, an anchor link, a hard flick on a
 * phone. Its ratio is 0 before and 0 after, no threshold is crossed, no
 * callback arrives, and the section stays invisible permanently. Measured: a
 * jump to the bottom of the home page stranded 8 of 9 sections.
 *
 * A position sweep has no such failure mode: "is this element's top above the
 * reveal line" is true for anything in view *or* already scrolled past. One
 * shared, passive, rAF-throttled listener drives every instance, and it detaches
 * itself once nothing is left to reveal.
 */

const pending = new Set<HTMLElement>();
let ticking = false;
let attached = false;

/** Reveal anything whose top has reached 92% of the viewport height, or passed it. */
function sweep() {
  ticking = false;
  const line = window.innerHeight * 0.92;

  for (const el of [...pending]) {
    if (el.getBoundingClientRect().top < line) {
      el.classList.add("is-visible");
      pending.delete(el);
    }
  }

  if (pending.size === 0) detach();
}

function requestSweep() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(sweep);
}

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener("scroll", requestSweep, { passive: true });
  window.addEventListener("resize", requestSweep, { passive: true });
}

function detach() {
  if (!attached) return;
  attached = false;
  window.removeEventListener("scroll", requestSweep);
  window.removeEventListener("resize", requestSweep);
}

function register(el: HTMLElement) {
  pending.add(el);
  attach();
  requestSweep();
}

function unregister(el: HTMLElement) {
  pending.delete(el);
  if (pending.size === 0) detach();
}

export function Reveal({
  children,
  className,
  /** Stagger, in ms, for items revealed as a group. */
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }

    register(el);
    return () => unregister(el);
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
