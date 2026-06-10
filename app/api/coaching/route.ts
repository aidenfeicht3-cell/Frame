import { NextResponse } from "next/server";
import { getPerformanceCoaching } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tips = await getPerformanceCoaching(body?.stat ?? {});
  return NextResponse.json(tips);
}
