"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Wand2, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useIdeas } from "@/lib/ideas/useIdeas";

export default function IdeasPage() {
  const { loaded, ideas, addIdea, removeIdea } = useIdeas();
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");

  const add = () => {
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    addIdea(text, tagList);
    setText("");
    setTags("");
  };

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
            Idea vault
          </h1>
          <p className="text-sm text-muted">
            Catch ideas the moment they hit. Turn any into a plan.
          </p>
        </div>
      </div>

      <Card className="space-y-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) add();
          }}
          placeholder="A video idea…"
          className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tags, comma, separated (optional)"
          className="w-full rounded-2xl border border-hairline bg-surface px-4 py-2.5 text-xs outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
        />
        <Button onClick={add} disabled={!text.trim()} className="w-full">
          <Plus className="h-4 w-4" /> Save idea
        </Button>
      </Card>

      {!loaded ? (
        <Card className="h-32 animate-pulse" />
      ) : ideas.length === 0 ? (
        <Card className="flex flex-col items-center py-10 text-center">
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Lightbulb className="h-6 w-6" />
          </span>
          <p className="mx-auto max-w-xs text-sm text-muted">
            No ideas saved yet. Jot one down above — future-you will thank you.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {ideas.map((idea) => (
            <li key={idea.id}>
              <Card className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{idea.text}</p>
                  <button
                    type="button"
                    onClick={() => removeIdea(idea.id)}
                    aria-label="Delete idea"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-paper hover:text-coral"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {idea.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-semibold text-muted"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={`/builder?idea=${encodeURIComponent(idea.text)}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <Wand2 className="h-3.5 w-3.5" /> Plan this
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
