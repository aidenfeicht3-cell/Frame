"use client";

import { useEffect, useState } from "react";
import { SYNC_EVENT } from "@/lib/sync/event";
import { getFrameIQ } from "@/lib/frame-iq/store";
import { computeCreatorScore, resolveDelta } from "./store";
import type { CreatorScore } from "./types";

/**
 * Live Creator Score. It's derived from Frame IQ (which itself reads many
 * stores), so we recompute on mount and again whenever the streak ticks or
 * cloud sync pulls fresh data down — no AI, no extra storage beyond the small
 * daily baseline. Gate UI on `loaded` to avoid hydration mismatches.
 */
export function useCreatorScore() {
  const [loaded, setLoaded] = useState(false);
  const [cs, setCs] = useState<CreatorScore | null>(null);

  useEffect(() => {
    const refresh = () => {
      const base = computeCreatorScore(getFrameIQ());
      setCs({ ...base, delta: resolveDelta(base.score) });
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

  return { loaded, cs };
}
