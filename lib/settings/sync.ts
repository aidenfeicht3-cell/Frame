/**
 * The bridge that hands the locally-saved Anthropic key to the server, where
 * the AI calls actually run. The server keeps it in memory only and never sends
 * it back (see lib/runtime-key.ts). Only client code imports this.
 */

/** Push the key to the server. Returns whether AI is now live. */
export async function syncKeyToServer(key: string): Promise<boolean> {
  try {
    const res = await fetch("/api/key", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key }),
    });
    const data = await res.json();
    return Boolean(data?.live);
  } catch {
    return false;
  }
}

/** Remove the in-app key from the server (falls back to an env key, if any). */
export async function clearKeyOnServer(): Promise<void> {
  try {
    await fetch("/api/key", { method: "DELETE" });
  } catch {
    // ignore — the browser's localStorage copy is the source of truth
  }
}
