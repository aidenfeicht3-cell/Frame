/**
 * The subscriber's plan. This is a MOCK for now — it lives in localStorage so
 * the Settings → Billing UI is real and clickable. When we wire up payments,
 * only the store swaps to Stripe; the screens stay the same.
 */
export type Plan = "free" | "pro";

export type Billing = {
  plan: Plan;
  /** ISO timestamp when the Pro free trial started, or null. */
  trialStartedAt: string | null;
};

export const FREE_BILLING: Billing = { plan: "free", trialStartedAt: null };

/** Length of the Pro free trial. */
export const TRIAL_DAYS = 3;
export const PRO_PRICE = "$15";

/** Whole days left in the trial (0 once it's over). */
export function trialDaysLeft(billing: Billing): number {
  if (billing.plan !== "pro" || !billing.trialStartedAt) return 0;
  const started = new Date(billing.trialStartedAt).getTime();
  const ends = started + TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const msLeft = ends - Date.now();
  return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
}

/** True while a Pro subscriber is still inside their free trial window. */
export function inTrial(billing: Billing): boolean {
  return billing.plan === "pro" && trialDaysLeft(billing) > 0;
}
