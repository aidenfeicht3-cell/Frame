import { NextResponse } from "next/server";
import { getTitleRating } from "@/lib/ai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = typeof body?.text === "string" ? body.text : "";
  const rating = await getTitleRating(text);
  return NextResponse.json(rating);
}
