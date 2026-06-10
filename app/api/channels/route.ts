import { NextResponse } from "next/server";
import { getChannelsToStudy } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const niche = typeof body?.niche === "string" ? body.niche : "";
  const channels = await getChannelsToStudy(niche);
  return NextResponse.json(channels);
}
