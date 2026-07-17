"use client";

import { useEffect, useState } from "react";

/** Top banner (§6.1) — swipeable if multiple messages. Content is admin-editable (§14.11). */
export function TopBanner({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(id);
  }, [messages.length]);

  if (messages.length === 0) return null;

  return (
    <div className="w-full bg-kayaan-brownDark px-4 py-2 text-center text-xs text-white sm:text-sm">
      {messages[index]}
    </div>
  );
}
