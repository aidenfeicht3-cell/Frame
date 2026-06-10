import { NextResponse } from "next/server";
import { getProductionPlan } from "@/lib/ai";
import type { EditingSetup } from "@/lib/builder/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const idea = typeof body?.idea === "string" ? body.idea : "";
  const niche = typeof body?.niche === "string" ? body.niche : "";
  const setup: EditingSetup = {
    software: body?.setup?.software ?? "Other / not sure",
    device: body?.setup?.device === "desktop" ? "desktop" : "mobile",
  };
  const plan = await getProductionPlan(idea, niche, setup);
  return NextResponse.json(plan);
}
