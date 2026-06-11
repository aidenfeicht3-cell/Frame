import { NextResponse } from "next/server";
import { aiIsLive } from "@/lib/ai";
import { getRuntimeKey } from "@/lib/runtime-key";

// Lets the UI show whether real AI is on (and where the key came from),
// without ever exposing the key itself.
export async function GET() {
  return NextResponse.json({
    live: aiIsLive(),
    hasEnvKey: Boolean(process.env.ANTHROPIC_API_KEY),
    hasRuntimeKey: Boolean(getRuntimeKey()),
  });
}
