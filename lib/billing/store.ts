import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage";
import type { Billing } from "./types";
import { FREE_BILLING } from "./types";

/**
 * The billing "repository" — the only place the UI reads/writes the plan.
 * Mock for now (localStorage); swap to Stripe later without touching screens.
 */
export function getBilling(): Billing {
  return readJSON<Billing>(STORAGE_KEYS.billing, FREE_BILLING);
}

export function saveBilling(billing: Billing): void {
  writeJSON(STORAGE_KEYS.billing, billing);
}
