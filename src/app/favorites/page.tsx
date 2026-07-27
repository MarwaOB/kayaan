import type { Metadata } from "next";

import { FavoritesView } from "@/components/listing/FavoritesView";
import { LOOKBOOK, toEditorialFrame } from "@/lib/lookbook";

export const metadata: Metadata = {
  title: "المفضلة | كيان",
  description: "القطع التي حفظتها على هذا الجهاز.",
};

/**
 * Favourites (§8) — a server shell around a client view.
 *
 * The split exists for one reason: `lookbook.ts` reads `media-manifest.json`,
 * which is ~64 KB of blur placeholders. The page's content is unavoidably
 * client-side (the IDs live in localStorage, there are no accounts), but the
 * photograph for its empty state is picked here, on the server, and crosses the
 * boundary as three strings.
 */
export default function FavoritesPage() {
  return <FavoritesView emptyFrame={toEditorialFrame(LOOKBOOK[2] ?? null)} />;
}
