"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { toISODate } from "@/lib/calendar/dates";
import type { VideoStat } from "@/lib/analytics/types";

type Draft = Omit<VideoStat, "id">;

/** Sheet for adding or editing one video's stats. */
export function LogVideoSheet({
  open,
  editing,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: VideoStat | null;
  onClose: () => void;
  onSave: (data: Draft) => void;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [views, setViews] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");
  const [retention, setRetention] = useState("");

  // Prefill on open (edit) or reset to sensible defaults (add).
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setTitle(editing.title);
      setDate(editing.date);
      setViews(String(editing.views));
      setLikes(String(editing.likes));
      setComments(String(editing.comments));
      setRetention(String(editing.retentionPct));
    } else {
      setTitle("");
      setDate(toISODate(new Date()));
      setViews("");
      setLikes("");
      setComments("");
      setRetention("");
    }
  }, [open, editing]);

  const num = (s: string) => Math.max(0, Math.round(Number(s) || 0));

  const save = () => {
    onSave({
      title: title.trim() || "Untitled video",
      date: date || toISODate(new Date()),
      views: num(views),
      likes: num(likes),
      comments: num(comments),
      retentionPct: Math.min(100, num(retention)),
    });
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={editing ? "Edit video stats" : "Log a video"}
    >
      <div className="space-y-3">
        <Field label="Video title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My first video"
            className={inputClass}
          />
        </Field>
        <Field label="Published date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Views">
            <input
              type="number"
              inputMode="numeric"
              value={views}
              onChange={(e) => setViews(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </Field>
          <Field label="Likes">
            <input
              type="number"
              inputMode="numeric"
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </Field>
          <Field label="Comments">
            <input
              type="number"
              inputMode="numeric"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </Field>
          <Field label="Retention %">
            <input
              type="number"
              inputMode="numeric"
              value={retention}
              onChange={(e) => setRetention(e.target.value)}
              placeholder="0–100"
              className={inputClass}
            />
          </Field>
        </div>
        <p className="text-xs text-muted">
          Find these in YouTube Studio → Analytics. Retention is your average
          view duration %.
        </p>
        <Button onClick={save} className="w-full">
          <Check className="h-4 w-4" /> {editing ? "Save changes" : "Save video"}
        </Button>
      </div>
    </Sheet>
  );
}

const inputClass =
  "w-full rounded-2xl border border-hairline bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}
