import { NextResponse } from "next/server";
import { getNextVideos } from "@/lib/ai";
import type { NextVideoContext } from "@/lib/roadmap/types";

/**
 * Generate the next-video suggestions. The CLIENT caches the result by an input
 * hash (lib/roadmap), so this is only hit on the first visit or an explicit
 * "Regenerate" — keeping AI credit use to the value-per-credit minimum.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ctx: NextVideoContext = {
    niche: typeof body?.niche === "string" ? body.niche : "",
    publishedCount: Number(body?.publishedCount) || 0,
    bestVideo: typeof body?.bestVideo === "string" ? body.bestVideo : "",
    avgRetentionPct: Number(body?.avgRetentionPct) || 0,
    stage: typeof body?.stage === "string" ? body.stage : "",
  };
  const videos = await getNextVideos(ctx);
  return NextResponse.json({ videos });
}
