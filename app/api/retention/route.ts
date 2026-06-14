import { NextResponse } from "next/server";
import { getRetentionAnalysis } from "@/lib/ai";

/**
 * Analyze a pasted script for retention / watch-time. The CLIENT caches the
 * result by a hash of the script (lib/retention), so this is only hit when the
 * script is new — re-analyzing an unchanged script never reaches here. Keeps AI
 * credit use to the value-per-credit minimum.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const script = typeof body?.script === "string" ? body.script : "";
  const niche = typeof body?.niche === "string" ? body.niche : "";
  const analysis = await getRetentionAnalysis(script, niche);
  return NextResponse.json(analysis);
}
