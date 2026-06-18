"use client";

import { useCallback, useEffect, useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ViewsLineChart } from "@/components/analytics/ViewsLineChart";

type Status = {
  configured: boolean;
  connected: boolean;
  channelTitle: string | null;
};

type DailyViewPoint = { date: string; views: number };

/**
 * "Connect your channel" — links the creator's own YouTube channel (read-only
 * OAuth) so their real daily views show up live. Fully self-contained and
 * gated: with no backend keys it reads as "not set up" and the rest of Progress
 * (manual stats) works exactly as before.
 */
export function ConnectChannelCard() {
  const [status, setStatus] = useState<Status | null>(null);
  const [live, setLive] = useState<DailyViewPoint[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      const s: Status = await fetch("/api/youtube/status").then((r) => r.json());
      setStatus(s);
      if (s.connected) {
        const d = await fetch("/api/youtube/daily-views").then((r) => r.json());
        setLive(Array.isArray(d?.points) ? d.points : null);
      } else {
        setLive(null);
      }
    } catch {
      setStatus({ configured: false, connected: false, channelTitle: null });
    }
  }, []);

  useEffect(() => {
    // Show a one-time note after returning from Google's consent screen.
    const param = new URLSearchParams(window.location.search).get("channel");
    if (param === "connected") setNotice("Channel connected — your live views are below.");
    else if (param === "error") setNotice("Couldn't connect that time. Please try again.");
    else if (param === "unconfigured") setNotice("Channel connect isn't set up yet.");
    void loadStatus();
  }, [loadStatus]);

  const disconnect = useCallback(async () => {
    setDisconnecting(true);
    try {
      await fetch("/api/youtube/disconnect", { method: "POST" });
      setNotice(null);
      await loadStatus();
    } finally {
      setDisconnecting(false);
    }
  }, [loadStatus]);

  // Loading shimmer.
  if (!status) return <Card className="h-24 animate-pulse" />;

  const liveOK = live && live.length >= 2;

  // Connected: show the channel + its live daily-views chart.
  if (status.connected) {
    return (
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-success/10 text-success">
              <Link2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {status.channelTitle || "Your channel"}
              </p>
              <p className="text-xs text-success">Connected · live daily views</p>
            </div>
          </div>
          <button
            type="button"
            onClick={disconnect}
            disabled={disconnecting}
            className="shrink-0 rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink disabled:opacity-60"
          >
            {disconnecting ? "Disconnecting…" : "Disconnect"}
          </button>
        </div>

        {liveOK ? (
          <div className="border-t border-hairline pt-3">
            <h3 className="mb-2 font-display text-base font-bold">
              Daily views · last 30 days
            </h3>
            <ViewsLineChart
              data={live!.map((p) => ({ label: shortDate(p.date), value: p.views }))}
            />
          </div>
        ) : (
          <p className="border-t border-hairline pt-3 text-xs text-muted">
            No view data yet — YouTube Analytics can lag a day or two. Check back
            soon.
          </p>
        )}
      </Card>
    );
  }

  // Configured but not connected: real connect button.
  if (status.configured) {
    return (
      <Card className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Link2 className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Connect your channel</p>
          <p className="text-xs text-muted">
            {notice ??
              "Graph your real daily views & subscriber growth — every peak and drop."}
          </p>
        </div>
        <a
          href="/api/youtube/connect"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Connect
        </a>
      </Card>
    );
  }

  // Not configured (no backend keys yet): friendly, no action.
  return (
    <Card className="flex items-center gap-3 border-dashed">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-paper text-muted">
        <Link2 className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Connect your channel</p>
        <p className="text-xs text-muted">
          Graph your real daily views &amp; subscriber growth. Activates once
          your channel connection is set up.
        </p>
      </div>
      <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-muted">
        Soon
      </span>
    </Card>
  );
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  if (!m || !d) return iso;
  return `${Number(m)}/${Number(d)}`;
}
