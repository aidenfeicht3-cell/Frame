"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  ThumbsUp,
  Gauge,
  Pencil,
  Trash2,
  Sparkles,
  Loader2,
  Link2,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ViewsChart } from "@/components/analytics/ViewsChart";
import { LogVideoSheet } from "@/components/analytics/LogVideoSheet";
import { useAnalytics } from "@/lib/analytics/useAnalytics";
import { formatShort } from "@/lib/calendar/dates";
import type { VideoStat } from "@/lib/analytics/types";
import { cn } from "@/lib/cn";

export default function ProgressPage() {
  const { loaded, videos, addVideo, updateVideo, removeVideo } = useAnalytics();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<VideoStat | null>(null);
  const [coaching, setCoaching] = useState<Record<string, string[]>>({});
  const [coachLoading, setCoachLoading] = useState<Record<string, boolean>>({});
  const [live, setLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/ai-status")
      .then((r) => r.json())
      .then((d) => setLive(Boolean(d.live)))
      .catch(() => setLive(false));
  }, []);

  const sorted = [...videos].sort((a, b) => a.date.localeCompare(b.date));
  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  const avgRetention = videos.length
    ? Math.round(videos.reduce((s, v) => s + v.retentionPct, 0) / videos.length)
    : 0;

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (v: VideoStat) => {
    setEditing(v);
    setSheetOpen(true);
  };
  const onSave = (data: Omit<VideoStat, "id">) => {
    if (editing) updateVideo(editing.id, data);
    else addVideo(data);
    setSheetOpen(false);
    setEditing(null);
  };

  const coach = async (v: VideoStat) => {
    setCoachLoading((l) => ({ ...l, [v.id]: true }));
    try {
      const tips = await fetch("/api/coaching", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stat: v }),
      }).then((r) => r.json());
      setCoaching((c) => ({ ...c, [v.id]: tips as string[] }));
    } finally {
      setCoachLoading((l) => ({ ...l, [v.id]: false }));
    }
  };

  return (
    <div className="space-y-5 py-2">
      <header className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Progress
          </h1>
          <p className="text-sm text-muted">
            Log a video&apos;s numbers and get coached on the next one.
          </p>
        </div>
        {videos.length > 0 && (
          <Button onClick={openAdd} className="shrink-0">
            <Plus className="h-4 w-4" /> Log
          </Button>
        )}
      </header>

      {!loaded ? (
        <Card className="h-72 animate-pulse" />
      ) : videos.length === 0 ? (
        <Card className="flex flex-col items-center py-10 text-center">
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Gauge className="h-6 w-6" />
          </span>
          <p className="mx-auto max-w-xs text-sm text-muted">
            No videos logged yet. Add your first video&apos;s stats and
            we&apos;ll coach your next one.
          </p>
          <Button onClick={openAdd} className="mt-4">
            <Plus className="h-4 w-4" /> Log a video
          </Button>
        </Card>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={Eye} value={fmt(totalViews)} label="Total views" tint="brand" />
            <Stat icon={ThumbsUp} value={fmt(videos.length)} label="Videos" tint="amber" />
            <Stat icon={Gauge} value={`${avgRetention}%`} label="Avg retention" tint="success" />
          </div>

          {/* Chart */}
          {sorted.length >= 2 && (
            <Card className="space-y-3">
              <h2 className="font-display text-base font-bold">Views per video</h2>
              <ViewsChart
                data={sorted.slice(-6).map((v) => ({
                  label: shortDate(v.date),
                  value: v.views,
                }))}
              />
            </Card>
          )}

          {/* Video list with coaching */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold">Your videos</h2>
              <AiBadge live={live} />
            </div>
            <ul className="space-y-3">
              {[...videos].reverse().map((v) => (
                <li
                  key={v.id}
                  className="rounded-2xl border border-hairline bg-paper/40 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{v.title}</p>
                      <p className="text-xs text-muted">{formatShort(v.date)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <IconBtn label="Edit" onClick={() => openEdit(v)}>
                        <Pencil className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn label="Delete" danger onClick={() => removeVideo(v.id)}>
                        <Trash2 className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>👁 {fmt(v.views)} views</span>
                    <span>👍 {fmt(v.likes)} likes</span>
                    <span>💬 {fmt(v.comments)}</span>
                    <span>⏱ {v.retentionPct}% kept</span>
                  </div>

                  {coaching[v.id] ? (
                    <ul className="mt-3 space-y-1.5 border-t border-hairline pt-3">
                      {coaching[v.id].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <button
                      type="button"
                      onClick={() => coach(v)}
                      disabled={coachLoading[v.id]}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-60"
                    >
                      {coachLoading[v.id] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      {coachLoading[v.id] ? "Thinking…" : "Coach my next video"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      {/* Connect channel — coming soon (real YouTube data after backend) */}
      <Card className="flex items-center gap-3 border-dashed">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-paper text-muted">
          <Link2 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Connect your channel</p>
          <p className="text-xs text-muted">
            Auto-pull real views &amp; retention — coming once accounts are set up.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-muted">
          Soon
        </span>
      </Card>

      <LogVideoSheet
        open={sheetOpen}
        editing={editing}
        onClose={() => {
          setSheetOpen(false);
          setEditing(null);
        }}
        onSave={onSave}
      />
    </div>
  );
}

/* ------------------------------- helpers ------------------------------- */

function fmt(n: number): string {
  return n.toLocaleString();
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

function Stat({
  icon: Icon,
  value,
  label,
  tint,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  tint: "brand" | "amber" | "success";
}) {
  const tints: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    amber: "bg-amber/10 text-amber",
    success: "bg-success/10 text-success",
  };
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-3.5 shadow-card">
      <span
        className={cn(
          "mb-2 grid h-8 w-8 place-items-center rounded-xl",
          tints[tint],
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="font-display text-xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-[11px] font-medium text-muted">{label}</div>
    </div>
  );
}

function IconBtn({
  children,
  label,
  danger,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-lg text-muted transition-colors hover:bg-surface",
        danger ? "hover:text-coral" : "hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function AiBadge({ live }: { live: boolean | null }) {
  if (live === null) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        live ? "bg-success/10 text-success" : "bg-amber/10 text-amber",
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-success" : "bg-amber")}
      />
      {live ? "Live AI" : "Sample AI"}
    </span>
  );
}
