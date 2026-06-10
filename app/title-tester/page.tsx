"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2, Copy, Check, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { TitleRating } from "@/lib/ai-types";

export default function TitleTesterPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<TitleRating | null>(null);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState<boolean | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  const rate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch("/api/title-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
      setResult(r as TitleRating);
    } finally {
      setLoading(false);
    }
  };

  const copy = (s: string, i: number) => {
    navigator.clipboard?.writeText(s);
    setCopied(i);
    setTimeout(() => setCopied(null), 1200);
  };

  const scoreTint = (s: number) =>
    s >= 8 ? "text-success" : s >= 6 ? "text-amber" : "text-coral";
  const scoreRing = (s: number) =>
    s >= 8 ? "bg-success/10" : s >= 6 ? "bg-amber/10" : "bg-coral/10";

  return (
    <div className="space-y-5 py-2">
      <div className="flex items-center gap-2">
        <Link
          href="/builder"
          aria-label="Back"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Hook & title tester
          </h1>
          <p className="text-sm text-muted">
            Paste a title or hook — get a score and stronger versions.
          </p>
        </div>
      </div>

      <Card className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="e.g. How I edited my first video"
          className="w-full resize-none rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
        />
        <div className="flex items-center justify-between">
          {live !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                live ? "bg-success/10 text-success" : "bg-amber/10 text-amber",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  live ? "bg-success" : "bg-amber",
                )}
              />
              {live ? "Live AI" : "Sample AI"}
            </span>
          )}
          <Button onClick={rate} disabled={loading || !text.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Rating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Rate it
              </>
            )}
          </Button>
        </div>
      </Card>

      {result && (
        <>
          <Card className="flex items-center gap-4">
            <span
              className={cn(
                "grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold",
                scoreRing(result.score),
                scoreTint(result.score),
              )}
            >
              {result.score}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Score · {result.score}/10
              </p>
              <p className="text-sm font-medium">{result.verdict}</p>
            </div>
          </Card>

          <Card className="space-y-3">
            <h2 className="font-display text-base font-bold">Stronger options</h2>
            <ul className="space-y-2">
              {result.rewrites.map((r, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-hairline bg-paper/40 p-3"
                >
                  <p className="text-sm font-medium">{r}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => copy(r, i)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-muted transition-colors hover:text-ink"
                    >
                      {copied === i ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied === i ? "Copied" : "Copy"}
                    </button>
                    <Link
                      href={`/builder?idea=${encodeURIComponent(r)}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                    >
                      <Wand2 className="h-3.5 w-3.5" /> Plan this
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
