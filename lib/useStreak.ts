"use client";

import { useEffect, useState } from "react";
import { computeStreak, getActiveDates, weekActiveCount } from "./streak";

/**
 * Live streak for any widget (top bar, sidebar, Today). Re-reads whenever a
 * "frame:streak" event fires, so finishing a Path step updates the flame
 * everywhere without a refresh.
 */
export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const dates = getActiveDates();
      setStreak(computeStreak(dates));
      setWeekCount(weekActiveCount(dates));
      setLoaded(true);
    };
    refresh();
    window.addEventListener("frame:streak", refresh);
    return () => window.removeEventListener("frame:streak", refresh);
  }, []);

  return { streak, weekCount, loaded };
}
