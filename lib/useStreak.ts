"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "./storage";
import { SYNC_EVENT, type SyncedDetail } from "./sync/event";
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

    // Re-read when an action marks today active, and when cloud sync pulls a
    // fresh active-days list down from another device.
    const onSynced = (e: Event) => {
      if ((e as CustomEvent<SyncedDetail>).detail?.key === STORAGE_KEYS.activeDates) {
        refresh();
      }
    };
    window.addEventListener("frame:streak", refresh);
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => {
      window.removeEventListener("frame:streak", refresh);
      window.removeEventListener(SYNC_EVENT, onSynced);
    };
  }, []);

  return { streak, weekCount, loaded };
}
