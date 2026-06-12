"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  Lightbulb,
  Clapperboard,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useVault } from "@/lib/vault/useVault";
import type { VaultItem, VaultKind } from "@/lib/vault/types";

type Filter = "all" | "idea" | "project" | "fav";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "idea", label: "Ideas" },
  { id: "project", label: "Projects" },
  { id: "fav", label: "★ Favorites" },
];

export default function VaultPage() {
  const { loaded, items, toggleFavorite } = useVault();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const query = q.trim().toLowerCase();
  const visible = items.filter((it) => {
    if (filter === "fav" && !it.favorite) return false;
    if (filter === "idea" && it.kind !== "idea") return false;
    if (filter === "project" && it.kind !== "project") return false;
    if (!query) return true;
    return (
      it.title.toLowerCase().includes(query) ||
      it.tags.some((t) => t.toLowerCase().includes(query)) ||
      (it.subtitle?.toLowerCase().includes(query) ?? false)
    );
  });

  return (
    <div className="space-y-5 py-2">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">Vault</h1>
        <p className="text-sm text-muted">
          Your second brain — every idea and project in one place.
        </p>
      </header>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-2xl border border-hairline bg-surface px-4 py-2.5 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-500">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search ideas & projects…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === f.id
                ? "bg-brand-600 text-white"
                : "bg-surface text-muted hover:text-ink",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!loaded ? (
        <Card className="h-48 animate-pulse" />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          Nothing matches that — try a different search or filter.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((it) => (
            <VaultRow key={it.key} item={it} onFav={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}

const KIND_META: Record<
  VaultKind,
  { icon: typeof Lightbulb; label: string }
> = {
  idea: { icon: Lightbulb, label: "Idea" },
  project: { icon: Clapperboard, label: "Project" },
};

function VaultRow({
  item,
  onFav,
}: {
  item: VaultItem;
  onFav: (key: string) => void;
}) {
  const { icon: Icon, label } = KIND_META[item.kind];
  return (
    <Card className="flex items-center gap-3">
      <Link href={item.href} className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
          <p className="truncate text-xs text-muted">
            {label}
            {item.subtitle ? ` · ${item.subtitle}` : ""}
            {item.tags.length ? ` · ${item.tags.slice(0, 3).join(", ")}` : ""}
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => onFav(item.key)}
        aria-label={item.favorite ? "Remove favorite" : "Add favorite"}
        aria-pressed={item.favorite}
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
          item.favorite
            ? "text-amber"
            : "text-muted hover:bg-paper hover:text-ink",
        )}
      >
        <Star className={cn("h-5 w-5", item.favorite && "fill-amber")} />
      </button>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="space-y-3 py-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
        🧠
      </span>
      <div>
        <h2 className="font-display text-lg font-bold">Your vault is empty</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
          Capture an idea or plan a video — everything you make shows up here,
          searchable forever.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button href="/ideas" variant="secondary">
          <Lightbulb className="h-4 w-4" /> Add an idea
        </Button>
        <Button href="/builder">
          Plan a video <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
