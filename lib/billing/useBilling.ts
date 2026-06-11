"use client";

import { useCallback, useEffect, useState } from "react";
import { getBilling, saveBilling } from "./store";
import { FREE_BILLING, type Billing } from "./types";

/**
 * Loads the saved plan on mount and lets the UI start a trial or cancel.
 * Everything here is a mock until real payments are wired in.
 */
export function useBilling() {
  const [loaded, setLoaded] = useState(false);
  const [billing, setBilling] = useState<Billing>(FREE_BILLING);

  useEffect(() => {
    setBilling(getBilling());
    setLoaded(true);
  }, []);

  const startTrial = useCallback(() => {
    const next: Billing = {
      plan: "pro",
      trialStartedAt: new Date().toISOString(),
    };
    saveBilling(next);
    setBilling(next);
  }, []);

  const cancel = useCallback(() => {
    saveBilling(FREE_BILLING);
    setBilling(FREE_BILLING);
  }, []);

  return { loaded, billing, startTrial, cancel };
}
