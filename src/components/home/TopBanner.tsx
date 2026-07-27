"use client";

import { useEffect, useState } from "react";

/**
 * Top banner (spec §6.1) — rotates when there are several messages.
 *
 * Espresso band above everything, so the cream page below reads as the start of
 * the content rather than a continuation of the chrome. Rotation pauses on
 * hover and stops entirely under reduced motion (DESIGN-SYSTEM.md §5).
 */
export function TopBanner({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (messages.length <= 1 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 5000);
    return () => clearInterval(id);
  }, [messages.length, paused]);

  if (messages.length === 0) return null;

  return (
    <div
      className="bg-brand-900 text-brand-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-k-wide flex h-9 items-center justify-center overflow-hidden">
        <p aria-live="polite" className="truncate text-center text-caption">
          {messages[index]}
        </p>
      </div>
    </div>
  );
}
