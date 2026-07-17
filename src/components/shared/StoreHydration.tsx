"use client";

import { useEffect } from "react";
import { useCart, useFavorites } from "@/lib/store";

/**
 * Renders nothing — just triggers the actual localStorage read for the
 * cart/favorites stores once mounted client-side (see the skipHydration
 * comment in src/lib/store.ts for why this is split out instead of
 * hydrating automatically). Mount this once near the root layout.
 */
export function StoreHydration() {
  useEffect(() => {
    useCart.persist.rehydrate();
    useFavorites.persist.rehydrate();
  }, []);

  return null;
}
