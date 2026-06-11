/**
 * Holds an Anthropic API key that was pasted into the app at runtime (from the
 * Settings screen), so the user can turn on real AI without editing files or
 * setting an environment variable.
 *
 * This lives in the SERVER's memory only — it is never sent back to the browser.
 * The browser keeps its own copy in localStorage and re-pushes it here on every
 * load (see components/KeySync.tsx), so the key survives page reloads. It does
 * NOT survive a dev-server restart on its own; the next page load restores it.
 *
 * TODO: for a real multi-user / serverless deployment, store this per-user in a
 * secure backend (or pass it per-request) instead of a single process variable.
 */
let runtimeKey: string | null = null;

export function setRuntimeKey(key: string): void {
  const trimmed = key.trim();
  runtimeKey = trimmed.length ? trimmed : null;
}

export function clearRuntimeKey(): void {
  runtimeKey = null;
}

export function getRuntimeKey(): string | null {
  return runtimeKey;
}
