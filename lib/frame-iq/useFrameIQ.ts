"use client";

import { useEffect, useState } from "react";
import { SYNC_EVENT } from "@/lib/sync/event";
import { getFrameIQ } from "./store";
import type { FrameIQ } from "./types";

/**
 * Live Frame IQ. It's derived from many stores, so we recompute on mount and
 * again whenever the streak ticks or cloud sync pulls fresh data down — no
 * extra storage, no AI. Gate UI on `loaded` to avoid hydration mismatches.
 */
export function useFrameIQ() {
  const [loaded, setLoaded] = useState(false);
  const [iq, setIQ] = useState<FrameIQ | null>(null);

  useEffect(() => {
    const refresh = () => {
      setIQ(getFrameIQ());
      setLoaded(true);
    };
    refresh();

    window.addEventListener("frame:streak", refresh);
    window.addEventListener(SYNC_EVENT, refresh);
    return () => {
      window.removeEventListener("frame:streak", refresh);
      window.removeEventListener(SYNC_EVENT, refresh);
    };
  }, []);

  return { loaded, iq };
}
