import { NextResponse } from "next/server";
import { setRuntimeKey, clearRuntimeKey } from "@/lib/runtime-key";
import { aiIsLive } from "@/lib/ai";

/**
 * Receives the Anthropic key pasted in Settings and holds it in the server's
 * memory so AI calls can use it. The key is never returned to the browser.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const key = typeof body?.key === "string" ? body.key : "";
  setRuntimeKey(key);
  return NextResponse.json({ live: aiIsLive() });
}

/** Removes the in-app key (AI falls back to an env key, if one is set). */
export async function DELETE() {
  clearRuntimeKey();
  return NextResponse.json({ live: aiIsLive() });
}
