"use client";

import { useEffect, useRef, useState } from "react";
import {
  Rocket,
  Sparkles,
  ArrowRight,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Eye,
  ThumbsUp,
  MessageCircle,
  Type,
  Image as ImageIcon,
  Zap,
  Film,
  Clock,
  Repeat,
  CheckCircle2,
  FlaskConical,
  Play,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useFrameIQ } from "@/lib/frame-iq/useFrameIQ";
import { useViral, type ViralError } from "@/lib/viral/useViral";
import { parseVideoId } from "@/lib/viral/store";
import type {
  VideoSnapshot,
  ViralAnalysis,
  ViralFactor,
} from "@/lib/viral/types";

export default function ViralPage() {
  const { loaded: iqLoaded, iq } = useFrameIQ();
  const {
    loaded,
    video,
    analysis,
    cachedInput,
    cachedId,
    sampleVideo,
    analyzing,
    error,
    analyze,
  } = useViral();
  const [text, setText] = useState("");
  const [live, setLive] = useState<boolean | null>(null);
  const init = useRef(false);

  // Prefill the box once with the last analyzed link, so reloading the page (or
  // cloud sync) shows it ready to re-check — for free.
  useEffect(() => {
    if (loaded && !init.current) {
      if (cachedInput) setText(cachedInput);
      init.current = true;
    }
  }, [loaded, cachedInput]);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  const onboarded = Boolean(iq?.onboarded);
  const trimmed = text.trim();
  const parsedId = parseVideoId(trimmed);
  // The shown analysis is for a different video than what's in the box now.
  const stale = Boolean(
    analysis && parsedId && cachedId && parsedId !== cachedId,
  );

  return (
    <div className="space-y-5 py-2">
      <header className="animate-fade-up space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <Rocket className="h-4 w-4" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Why It Went Viral
            </h1>
          </div>
          {live !== null && onboarded && <AiBadge live={live} />}
        </div>
        <p className="text-sm text-muted">
          Paste any YouTube link and Frame breaks down why it likely blew up —
          and what you can copy.
        </p>
      </header>

      {!iqLoaded || !iq || !loaded ? (
        <>
          <Card className="h-40 animate-pulse" />
          <Card className="h-32 animate-pulse" />
        </>
      ) : !onboarded ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          <InputCard
            text={text}
            setText={setText}
            analyzing={analyzing}
            hasResult={Boolean(video && analysis)}
            onAnalyze={() => analyze(text, iq.niche)}
          />

          {error && <ErrorBanner error={error} />}

          {analyzing && !analysis ? (
            <AnalyzingState />
          ) : video && analysis ? (
            <>
              {stale && (
                <Card className="flex items-center gap-3 border-brand-200 bg-brand-50/60">
                  <Sparkles className="h-4 w-4 shrink-0 text-brand-600" />
                  <p className="min-w-0 flex-1 text-xs text-ink">
                    That&apos;s a different video — hit Analyze to break it down.
                  </p>
                </Card>
              )}
              {sampleVideo && <SampleVideoNote />}
              <Results video={video} analysis={analysis} />
              <p className="px-1 text-center text-xs text-muted">
                Saved so it&apos;s here next time — re-analyzing the same video
                is free.
              </p>
            </>
          ) : (
            !error && <Hint />
          )}
        </div>
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

function InputCard({
  text,
  setText,
  analyzing,
  hasResult,
  onAnalyze,
}: {
  text: string;
  setText: (v: string) => void;
  analyzing: boolean;
  hasResult: boolean;
  onAnalyze: () => void;
}) {
  return (
    <Card className="animate-fade-up space-y-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim() && !analyzing) onAnalyze();
        }}
        placeholder="Paste a YouTube link or video ID…"
        className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted">
          Works with any public video
        </span>
        <Button onClick={onAnalyze} disabled={!text.trim() || analyzing}>
          {analyzing ? (
            <>
              Analyzing… <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : hasResult ? (
            <>
              Analyze again <RefreshCw className="h-4 w-4" />
            </>
          ) : (
            <>
              Why it went viral <Rocket className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

const ERROR_COPY: Record<ViralError, string> = {
  invalid:
    "That doesn't look like a YouTube link or video ID. Paste a full URL (or the 11-character ID).",
  notfound:
    "Couldn't find that video — it may be private, removed, or the link's off. Double-check it.",
  failed: "Couldn't analyze that video just now. Give it another try.",
};

function ErrorBanner({ error }: { error: ViralError }) {
  return (
    <Card className="flex items-start gap-3 border-amber/30 bg-amber/10">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
      <p className="min-w-0 flex-1 text-sm leading-snug text-ink">
        {ERROR_COPY[error]}
      </p>
    </Card>
  );
}

function SampleVideoNote() {
  return (
    <Card className="flex items-start gap-3 border-brand-200 bg-brand-50/60">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
      <p className="min-w-0 flex-1 text-xs leading-snug text-ink">
        These are <span className="font-semibold">sample stats</span> — connect
        the YouTube API to analyze the real numbers behind any link.
      </p>
    </Card>
  );
}

const FACTOR_META: Record<ViralFactor, { icon: LucideIcon; label: string }> = {
  title: { icon: Type, label: "Title" },
  thumbnail: { icon: ImageIcon, label: "Thumbnail" },
  hook: { icon: Zap, label: "Hook" },
  format: { icon: Film, label: "Format" },
  timing: { icon: Clock, label: "Timing" },
};

function Results({
  video,
  analysis,
}: {
  video: VideoSnapshot;
  analysis: ViralAnalysis;
}) {
  return (
    <div className="space-y-5">
      <VideoHeader video={video} />

      {/* Verdict — the single biggest reason, front and centre */}
      {analysis.verdict && (
        <section
          className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white shadow-soft"
          style={{ animationDelay: "60ms" }}
        >
          <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/80">
              <Rocket className="h-3.5 w-3.5" /> Why it took off
            </p>
            <p className="text-sm leading-relaxed text-white/95">
              {analysis.verdict}
            </p>
          </div>
        </section>
      )}

      {/* The drivers */}
      {analysis.reasons.length > 0 && (
        <section
          className="animate-fade-up space-y-3"
          style={{ animationDelay: "120ms" }}
        >
          <h2 className="px-1 font-display text-base font-bold">
            What drove it
          </h2>
          <div className="space-y-3">
            {analysis.reasons.map((r, i) => {
              const meta = FACTOR_META[r.factor] ?? FACTOR_META.format;
              const Icon = meta.icon;
              return (
                <Card
                  key={i}
                  className="animate-fade-up space-y-2"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold leading-snug text-ink">
                          {r.label}
                        </h3>
                        <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                          {meta.label}
                        </span>
                      </div>
                      {r.insight && (
                        <p className="mt-1 text-sm leading-snug text-muted">
                          {r.insight}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* What's repeatable */}
      {analysis.repeatable.length > 0 && (
        <section
          className="animate-fade-up space-y-3"
          style={{ animationDelay: "180ms" }}
        >
          <h2 className="flex items-center gap-1.5 px-1 font-display text-base font-bold">
            <Repeat className="h-4 w-4 text-brand-600" /> Steal this for your
            channel
          </h2>
          <Card className="space-y-3">
            {analysis.repeatable.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <p className="text-sm leading-snug text-ink/90">{s}</p>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Cross-link: test a title idea of your own */}
      <a href="/title-tester" className="block">
        <Card
          interactive
          className="animate-fade-up flex items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <FlaskConical className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Test your own title</p>
            <p className="text-xs text-muted">
              Apply what you just learned and score a title idea.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
        </Card>
      </a>
    </div>
  );
}

/** The analyzed video — thumbnail, title, channel, and public stats. */
function VideoHeader({ video }: { video: VideoSnapshot }) {
  const [imgOk, setImgOk] = useState(true);
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  return (
    <Card className="animate-fade-up space-y-3 overflow-hidden">
      <a
        href={watchUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative block aspect-video overflow-hidden rounded-2xl bg-paper"
      >
        {imgOk && video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-muted">
            <Film className="h-8 w-8" />
          </span>
        )}
        <span className="absolute inset-0 grid place-items-center bg-black/0 transition-colors group-hover:bg-black/20">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-brand-700 opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
            <Play className="h-5 w-5" />
          </span>
        </span>
      </a>
      <div className="space-y-1">
        <h2 className="font-display text-base font-bold leading-snug text-ink">
          {video.title || "Untitled video"}
        </h2>
        <p className="text-xs text-muted">
          {video.channelTitle || "Unknown channel"}
          {video.publishedAt ? ` · ${formatDate(video.publishedAt)}` : ""}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatTile icon={Eye} value={formatCount(video.views)} label="Views" />
        <StatTile icon={ThumbsUp} value={formatCount(video.likes)} label="Likes" />
        <StatTile
          icon={MessageCircle}
          value={formatCount(video.comments)}
          label="Comments"
        />
      </div>
    </Card>
  );
}

function StatTile({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-paper px-3 py-2.5 text-center">
      <Icon className="mx-auto mb-1 h-4 w-4 text-brand-600" />
      <div className="font-display text-base font-bold leading-none text-ink">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-medium text-muted">{label}</div>
    </div>
  );
}

function Hint() {
  return (
    <Card className="space-y-2 py-7 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Rocket className="h-6 w-6" />
      </span>
      <p className="mx-auto max-w-xs text-sm text-muted">
        Paste a YouTube link above and hit Analyze. Frame pulls the video&apos;s
        public stats and breaks down why it likely went viral — title,
        thumbnail, hook, format, and timing — plus what you can copy.
      </p>
    </Card>
  );
}

function AnalyzingState() {
  return (
    <Card className="space-y-3 py-9 text-center">
      <Loader2 className="mx-auto h-7 w-7 animate-spin text-brand-600" />
      <p className="text-sm text-muted">Pulling the stats and reading the hit…</p>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="space-y-3 py-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Rocket className="h-7 w-7" />
      </span>
      <div>
        <h2 className="font-display text-lg font-bold">
          Viral breakdowns start after onboarding
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Tell Frame your niche and goal, then paste any hit video to see why it
          worked — and what you can copy.
        </p>
      </div>
      <Button href="/onboarding">
        Get set up <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
}

/* ------------------------------ helpers -------------------------------- */

/** Compact view/like counts — 1.2M, 73K, 940. */
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
