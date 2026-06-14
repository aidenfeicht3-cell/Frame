"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Wrench,
  FlaskConical,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useFrameIQ } from "@/lib/frame-iq/useFrameIQ";
import { useRetention } from "@/lib/retention/useRetention";
import { retentionInputHash } from "@/lib/retention/store";
import type {
  RetentionAnalysis,
  RetentionRisk,
  RiskSeverity,
} from "@/lib/retention/types";

export default function RetentionPage() {
  const { loaded: iqLoaded, iq } = useFrameIQ();
  const { loaded, analysis, cachedScript, cachedHash, analyzing, error, analyze } =
    useRetention();
  const [text, setText] = useState("");
  const [live, setLive] = useState<boolean | null>(null);
  const init = useRef(false);

  // Prefill the textarea once with the last analyzed script, so reloading the
  // page (or cloud sync) shows it ready to re-check — for free.
  useEffect(() => {
    if (loaded && !init.current) {
      if (cachedScript) setText(cachedScript);
      init.current = true;
    }
  }, [loaded, cachedScript]);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  const onboarded = Boolean(iq?.onboarded);
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  // The shown analysis no longer matches what's in the box → invite a re-check.
  const stale = Boolean(
    analysis && trimmed && cachedHash && retentionInputHash(trimmed) !== cachedHash,
  );

  return (
    <div className="space-y-5 py-2">
      <header className="animate-fade-up space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <Activity className="h-4 w-4" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Retention Analyzer
            </h1>
          </div>
          {live !== null && onboarded && <AiBadge live={live} />}
        </div>
        <p className="text-sm text-muted">
          Paste your script and Frame checks where viewers might drop — before
          you film.
        </p>
      </header>

      {!iqLoaded || !iq || !loaded ? (
        <>
          <Card className="h-44 animate-pulse" />
          <Card className="h-32 animate-pulse" />
        </>
      ) : !onboarded ? (
        <EmptyState />
      ) : (
        <div className="space-y-5">
          <ScriptCard
            text={text}
            setText={setText}
            wordCount={wordCount}
            analyzing={analyzing}
            hasAnalysis={Boolean(analysis)}
            onAnalyze={() => analyze(text, iq.niche)}
          />

          {analyzing && !analysis ? (
            <AnalyzingState />
          ) : error && !analysis ? (
            <ErrorState onRetry={() => analyze(text, iq.niche)} />
          ) : analysis ? (
            <>
              {stale && (
                <Card className="flex items-center gap-3 border-brand-200 bg-brand-50/60">
                  <Sparkles className="h-4 w-4 shrink-0 text-brand-600" />
                  <p className="min-w-0 flex-1 text-xs text-ink">
                    You&apos;ve edited the script — analyze again for fresh
                    feedback.
                  </p>
                </Card>
              )}
              <Results analysis={analysis} />
              <p className="px-1 text-center text-xs text-muted">
                Saved so it&apos;s here next time — re-checking the same script
                is free.
              </p>
            </>
          ) : (
            <Hint />
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

function ScriptCard({
  text,
  setText,
  wordCount,
  analyzing,
  hasAnalysis,
  onAnalyze,
}: {
  text: string;
  setText: (v: string) => void;
  wordCount: number;
  analyzing: boolean;
  hasAnalysis: boolean;
  onAnalyze: () => void;
}) {
  return (
    <Card className="animate-fade-up space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Paste your script, outline, or transcript here…"
        className="w-full resize-y rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted">
          {wordCount > 0 ? `${wordCount} words` : "Any length works"}
        </span>
        <Button onClick={onAnalyze} disabled={!text.trim() || analyzing}>
          {analyzing ? (
            <>
              Analyzing… <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : hasAnalysis ? (
            <>
              Analyze again <RefreshCw className="h-4 w-4" />
            </>
          ) : (
            <>
              Analyze retention <Activity className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

const RING_TONE = (score: number) =>
  score >= 75
    ? "stroke-success"
    : score >= 50
      ? "stroke-brand-500"
      : "stroke-amber";

const GRADE_TONE = (score: number) =>
  score >= 75
    ? "bg-success/10 text-success"
    : score >= 50
      ? "bg-brand-50 text-brand-600"
      : "bg-amber/10 text-amber";

function Results({ analysis }: { analysis: RetentionAnalysis }) {
  return (
    <div className="space-y-5">
      {/* Score + verdict */}
      <Card className="animate-fade-up flex items-center gap-5">
        <ScoreRing score={analysis.score} grade={analysis.grade} />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-ink">Retention score</p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                GRADE_TONE(analysis.score),
              )}
            >
              Grade {analysis.grade}
            </span>
          </div>
          {analysis.verdict && (
            <p className="text-sm leading-snug text-muted">{analysis.verdict}</p>
          )}
        </div>
      </Card>

      {/* First 15 seconds — the highest-leverage moment */}
      {analysis.firstFifteen && (
        <section
          className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white shadow-soft"
          style={{ animationDelay: "60ms" }}
        >
          <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/80">
              <Zap className="h-3.5 w-3.5" /> First 15 seconds
            </p>
            <p className="text-sm leading-relaxed text-white/95">
              {analysis.firstFifteen}
            </p>
          </div>
        </section>
      )}

      {/* What's working */}
      {analysis.strengths.length > 0 && (
        <section
          className="animate-fade-up space-y-3"
          style={{ animationDelay: "120ms" }}
        >
          <h2 className="px-1 font-display text-base font-bold">
            What&apos;s working
          </h2>
          <Card className="space-y-3">
            {analysis.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <p className="text-sm leading-snug text-ink/90">{s}</p>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* Risky moments */}
      {analysis.risks.length > 0 && (
        <section
          className="animate-fade-up space-y-3"
          style={{ animationDelay: "180ms" }}
        >
          <h2 className="px-1 font-display text-base font-bold">
            Where viewers may drop
          </h2>
          <div className="space-y-3">
            {analysis.risks.map((r, i) => (
              <RiskCard key={i} risk={r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Cross-link: test a hook in the Title tester */}
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
            <p className="text-sm font-semibold text-ink">Test a hook</p>
            <p className="text-xs text-muted">
              Score your opening line and get stronger rewrites.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
        </Card>
      </a>
    </div>
  );
}

const SEVERITY_TONE: Record<RiskSeverity, string> = {
  high: "bg-amber/10 text-amber",
  medium: "bg-brand-50 text-brand-600",
  low: "bg-paper text-muted",
};

function RiskCard({ risk, index }: { risk: RetentionRisk; index: number }) {
  return (
    <Card
      className="animate-fade-up space-y-2.5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
            SEVERITY_TONE[risk.severity],
          )}
        >
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold leading-snug text-ink">
              {risk.moment}
            </h3>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                SEVERITY_TONE[risk.severity],
              )}
            >
              {risk.severity}
            </span>
          </div>
          {risk.issue && (
            <p className="mt-1 text-sm leading-snug text-muted">{risk.issue}</p>
          )}
        </div>
      </div>
      {risk.fix && (
        <div className="flex items-start gap-2 rounded-2xl bg-brand-50/70 px-3 py-2.5">
          <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          <p className="text-sm leading-snug text-ink">
            <span className="font-semibold text-brand-700">Fix: </span>
            {risk.fix}
          </p>
        </div>
      )}
    </Card>
  );
}

/** A bigger score ring with the grade in the middle. */
function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, score)) / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-hairline"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={RING_TONE(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-display text-2xl font-bold text-ink">{grade}</span>
        <span className="mt-0.5 text-[11px] font-semibold text-muted">
          {score}/100
        </span>
      </div>
    </div>
  );
}

function Hint() {
  return (
    <Card className="space-y-2 py-7 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Activity className="h-6 w-6" />
      </span>
      <p className="mx-auto max-w-xs text-sm text-muted">
        Paste a script above and hit Analyze. Frame scores its watch-time and
        flags the moments where viewers are most likely to leave — each with a
        concrete fix.
      </p>
    </Card>
  );
}

function AnalyzingState() {
  return (
    <Card className="space-y-3 py-9 text-center">
      <Loader2 className="mx-auto h-7 w-7 animate-spin text-brand-600" />
      <p className="text-sm text-muted">Reading your script for drop-off…</p>
    </Card>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="space-y-3 py-9 text-center">
      <p className="text-sm text-muted">
        Couldn&apos;t analyze your script just now.
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
        <Activity className="h-7 w-7" />
      </span>
      <div>
        <h2 className="font-display text-lg font-bold">
          Retention checks start after onboarding
        </h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Tell Frame your niche and goal, then paste any script to see where
          viewers might drop.
        </p>
      </div>
      <Button href="/onboarding">
        Get set up <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
}
