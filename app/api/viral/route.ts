import { NextResponse } from "next/server";
import { getViralAnalysis } from "@/lib/ai";
import { getVideoById, youtubeIsConnected } from "@/lib/youtube";
import { parseVideoId } from "@/lib/viral/store";

/**
 * Analyze why a public YouTube video likely went viral. Pulls the video's
 * public stats (lib/youtube) then asks the AI (lib/ai) to explain it. The CLIENT
 * caches the result by the video id, so this is only hit when the video is new
 * — re-analyzing the same video never reaches here, keeping credit use minimal.
 *
 * `sampleVideo` tells the UI the stats are sample data — true when no
 * YOUTUBE_API_KEY is set (so the app still runs key-free; add the key in Vercel
 * to analyze real links in prod).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const input = typeof body?.input === "string" ? body.input : "";
  const niche = typeof body?.niche === "string" ? body.niche : "";

  const id = parseVideoId(input);
  if (!id) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const video = await getVideoById(id);
  if (!video) {
    // Key is set but the video can't be found (private / removed / bad id).
    return NextResponse.json({ error: "notfound" }, { status: 404 });
  }

  const analysis = await getViralAnalysis(video, niche);
  return NextResponse.json({
    video,
    analysis,
    sampleVideo: !youtubeIsConnected(),
  });
}
