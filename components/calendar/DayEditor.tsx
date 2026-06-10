"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatLong } from "@/lib/calendar/dates";
import {
  STATUS_META,
  STATUS_ORDER,
  type PostStatus,
  type ScheduledPost,
} from "@/lib/calendar/types";

/** The bottom-sheet for one day: lists its videos and lets you add/edit them. */
export function DayEditor({
  dateIso,
  posts,
  onClose,
  onAdd,
  onUpdate,
  onRemove,
}: {
  dateIso: string | null;
  posts: ScheduledPost[];
  onClose: () => void;
  onAdd: (post: Omit<ScheduledPost, "id">) => void;
  onUpdate: (id: string, patch: Partial<Omit<ScheduledPost, "id">>) => void;
  onRemove: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<PostStatus>("planned");

  const open = dateIso !== null;
  const dayPosts = dateIso ? posts.filter((p) => p.date === dateIso) : [];

  const handleAdd = () => {
    if (!dateIso) return;
    onAdd({ date: dateIso, title: title.trim() || "Untitled video", status });
    setTitle("");
    setStatus("planned");
  };

  const close = () => {
    setTitle("");
    setStatus("planned");
    onClose();
  };

  return (
    <Sheet open={open} onClose={close} title={dateIso ? formatLong(dateIso) : ""}>
      {dayPosts.length > 0 ? (
        <ul className="mb-4 space-y-2">
          {dayPosts.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border border-hairline bg-paper/50 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{p.title}</p>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  aria-label="Delete video"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-coral"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdate(p.id, { status: s })}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
                      p.status === s
                        ? STATUS_META[s].chip
                        : "bg-surface text-muted hover:text-ink",
                    )}
                  >
                    {STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-muted">
          Nothing planned yet. Add a video below.
        </p>
      )}

      <div className="space-y-3 border-t border-hairline pt-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="Video title or idea…"
          className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
        />
        <div className="flex flex-wrap gap-1.5">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                status === s
                  ? STATUS_META[s].chip
                  : "bg-paper text-muted hover:text-ink",
              )}
            >
              {STATUS_META[s].label}
            </button>
          ))}
        </div>
        <Button onClick={handleAdd} className="w-full">
          <Plus className="h-4 w-4" /> Add to this day
        </Button>
      </div>
    </Sheet>
  );
}
