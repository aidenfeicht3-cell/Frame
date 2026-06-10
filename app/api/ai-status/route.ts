import { NextResponse } from "next/server";
import { aiIsLive } from "@/lib/ai";

// Lets the UI show whether real AI is on, without exposing the key.
export async function GET() {
  return NextResponse.json({ live: aiIsLive() });
}
