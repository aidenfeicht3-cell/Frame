import { NextResponse } from "next/server";
import { getBrandKit } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const niche = typeof body?.niche === "string" ? body.niche : "";
  const kit = await getBrandKit(niche);
  return NextResponse.json(kit);
}
