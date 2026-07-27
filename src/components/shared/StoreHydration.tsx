"use client";

import { useEffect } from "react";
import { useCart, useFavorites, useStoreHydration } from "@/lib/store";

/**
 * Renders nothing — reads the cart and favourites back from localStorage once
 * mounted, then flips the shared hydration flag.
 *
 * Both stores set `skipHydration` so that the server render and the first
 * client render agree (see useStoreHydration in src/lib/store.ts). Components
 * that show cart contents or counts gate on `hydrated` rather than rendering an
 * empty state that is about to be replaced.
 *
 * Mounted once, in the root layout.
 */
export function StoreHydration() {
  useEffect(() => {
    let cancelled = false;

    Promise.all([useCart.persist.rehydrate(), useFavorites.persist.rehydrate()])
      .catch(() => {
        /* corrupt or blocked storage — carry on with empty stores rather than
           leaving the UI stuck on its loading state forever */
      })
      .finally(() => {
        if (!cancelled) useStoreHydration.getState().markHydrated();
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
