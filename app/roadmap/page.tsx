"use client";

import { useEffect, useState } from "react";
import {
  Compass,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clapperboard,
  Bookmark,
  Check,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useFrameIQ } from "@/lib/frame-iq/useFrameIQ";
import { useRoadmap } from "@/lib/roadmap/useRoadmap";
import type { NextVideo, VideoEffort } from "@/lib/roadmap/types";
import { getIdeas, saveIdeas } from "@/lib/ideas/store";

export default function RoadmapPage() {
  const { loaded: iqLoaded, iq } = useFrameIQ();
  const { roadmap, generating, error, stale, generate } = useRoadmap(iq);
  const [live, setLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  const onboarded = Boolean(iq?.onboarded);

  return (
    <div className="space-y-5 py-2">
      <header className="animate-fade-up space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <Compass className="h-4 w-4" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Next-Video Roadmap
            </h1>
          </div>
          {live !== null && onboarded && <AiBadge live={live} />}
        </div>
        <p className="text-sm text-muted">
          Your next moves — video ideas picked for your niche and momentum.
        </p>
      </header>

      {!iqLoaded || !iq ? (
        <>
          <Card className="h-32 animate-pulse" />
          <Card className="h-32 animate-pulse" />
        </>
      ) : !onboarded ? (
        <EmptyState />
      ) : generating && !roadmap ? (
        <GeneratingState />
      ) : error && !roadmap ? (
        <ErrorState onRetry={generate} />
      ) : roadmap ? (
        <div className="space-y-5">
          <section className="space-y-3">
            {roadmap.videos.map((v, i) => (
              <VideoCard key={i} index={i} video={v} niche={iq.niche} />
            ))}
          </section>

          {roadmap.basedOn && (
            <p className="px-1 text-xs text-muted">{roadmap.basedOn}</p>
          )}

          {stale && (
            <Card className="flex items-center gap-3 border-brand-200 bg-brand-50/60">
              <Sparkles className="h-4 w-4 shrink-0 text-brand-600" />
              <p className="min-w-0 flex-1 text-xs text-ink">
                Your channel has moved on since these — refresh for new ideas.
              </p>
            </Card>
          )}

          <Button
            variant="secondary"
            onClick={generate}
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                Mapping… <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Regenerate <RefreshCw className="h-4 w-4" />
              </>
            )}
          </Button>

          <p className="px-1 text-center text-xs text-muted">
            Saved so it&apos;s here next time — it only refreshes when you ask.
          </p>
        </div>
      ) : (
        <FirstRun onGenerate={generate} generating={generating} />
      )}
    </div>
  );
}

/* ------------------------------- pieces -------------------------------- */

function AiBadge({ live }: { live: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        live ? "bg-brand-50 text-brand-700" : "bg-paper text-muted",
      )}
    >
      <Sparkles className="h-3 w-3" />
      {live ? "Live AI" : "Sample AI"}
    </span>
  );
}

const EFFORT_TINT: Record<VideoEffort, string> = {
  Quick: "bg-success/10 text-success",
  Standard: "bg-brand-50 text-brand-600",
  Ambitious: "bg-amber/10 text-amber",
};

function VideoCard({
  index,
  video,
  niche,
}: {
  index: number;
  video: NextVideo;
  niche: string;
}) {
  return (
    <Card
      className="animate-fade-up space-y-3"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-base font-bold leading-snug text-ink">
              {video.title}
            </h2>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                EFFORT_TINT[video.effort],
              )}
            >
              {video.effort}
            </span>
          </div>
          {video.hook && (
            <p className="text-sm italic leading-snug text-muted">
              {video.hook}
            </p>
          )}
        </div>
      </div>

      {video.angle && (
        <p className="text-sm leading-snug text-ink/80">{video.angle}</p>
      )}

      <div className="flex gap-2">
        <Button
          href={`/builder?idea=${encodeURIComponent(video.title)}`}
          className="flex-1 px-3 py-2 text-xs"
        >
          <Clapperboard className="h-4 w-4" /> Plan this
        </Button>
        <SaveIdeaButton title={video.title} niche={niche} />
      </div>
    </Card>
  );
}

/** Adds the suggestion to the Idea vault (deduped by text), with a quick "Saved". */
function SaveIdeaButton({ title, niche }: { title: string; niche: string }) {
  const [saved, setSaved] = useState(false);

  const save = () => {
    const existing = getIdeas();
    const dupe = existing.some(
      (i) => i.text.trim().toLowerCase() === title.trim().toLowerCase(),
    );
    if (!dupe) {
      const id =
        globalThis.crypto?.randomUUID?.() ?? `idea_${Date.now()}`;
      saveIdeas([
        { id, text: title, tags: niche ? [niche] : [], createdAt: new Date().toISOString() },
        ...existing,
      ]);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <Button
      variant="secondary"
      onClick={save}
      className="shrink-0 px-3 py-2 text-xs"
    >
      {saved ? (
        <>
          Saved <Check className="h-4 w-4" />
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" /> Save
        </>
      )}
    </Button>
  );
}

function FirstRun({
  onGenerate,
  generating,
}: {
  onGenerate: () => void;
  generating: boolean;
}) {
  return (
    <Card className="space-y-3 py-9 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass className="h-7 w-7" />
      </span>
      <div>
        <h2 className="font-display text-lg font-bold">
          Plan your next few videos
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Frame reads your niche and progress, then suggests three videos worth
          making next.
        </p>
      </div>
      <Button onClick={onGenerate} disabled={generating}>
        {generating ? (
          <>
            Mapping… <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Build my roadmap <Sparkles className="h-4 w-4" />
          </>
        )}
      </Button>
    </Card>
  );
}

function GeneratingState() {
  return (
    <Card className="space-y-3 py-9 text-center">
      <Loader2 className="mx-auto h-7 w-7 animate-spin text-brand-600" />
      <p className="text-sm text-muted">Mapping your next videos…</p>
    </Card>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="space-y-3 py-9 text-center">
      <p className="text-sm text-muted">
        Couldn&apos;t build your roadmap just now.
      </p>
      <Button variant="secondary" onClick={onRetry}>
        Try again <RefreshCw className="h-4 w-4" />
      </Button>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="space-y-3 py-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass className="h-7 w-7" />
      </span>
      <div>
        <h2 className="font-display text-lg font-bold">
          Your roadmap starts after onboarding
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Tell Frame your niche and goal, then it&apos;ll suggest the right next
          videos for you.
        </p>
      </div>
      <Button href="/onboarding">
        Get set up <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
}
