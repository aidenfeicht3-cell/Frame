"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getIdeas } from "@/lib/ideas/store";
import { getProjects } from "@/lib/builder/store";
import { STORAGE_KEYS } from "@/lib/storage";
import { SYNC_EVENT, type SyncedDetail } from "@/lib/sync/event";
import { getFavorites, saveFavorites } from "./store";
import type { VaultItem } from "./types";

/**
 * Unifies everything the creator has made — ideas + video projects — into one
 * searchable, favoritable list. Pure local data: reuses what's already saved,
 * no AI and no extra storage of the items themselves.
 */
export function useVault() {
  const [loaded, setLoaded] = useState(false);
  const [base, setBase] = useState<VaultItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      setFavorites(getFavorites());

      const ideas = getIdeas().map<VaultItem>((i) => ({
        key: `idea:${i.id}`,
        kind: "idea",
        id: i.id,
        title: i.text,
        tags: i.tags ?? [],
        createdAt: i.createdAt,
        href: `/builder?idea=${encodeURIComponent(i.text)}`,
        favorite: false,
      }));

      const projects = getProjects().map<VaultItem>((p) => ({
        key: `project:${p.id}`,
        kind: "project",
        id: p.id,
        title: p.idea,
        subtitle: p.setup?.software,
        tags: [],
        createdAt: p.createdAt,
        href: "/projects",
        favorite: false,
      }));

      setBase(
        [...projects, ...ideas].sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || ""),
        ),
      );
      setLoaded(true);
    };
    load();

    // Re-read when cloud sync pulls fresh favorites, or the underlying ideas /
    // projects the vault is built from, down from another device.
    const onSynced = (e: Event) => {
      const key = (e as CustomEvent<SyncedDetail>).detail?.key;
      if (
        key === STORAGE_KEYS.vaultFavorites ||
        key === STORAGE_KEYS.ideas ||
        key === STORAGE_KEYS.videoProjects
      ) {
        load();
      }
    };
    window.addEventListener(SYNC_EVENT, onSynced);
    return () => window.removeEventListener(SYNC_EVENT, onSynced);
  }, []);

  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const toggleFavorite = useCallback((key: string) => {
    setFavorites((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      saveFavorites(next);
      return next;
    });
  }, []);

  const items = base.map((it) => ({ ...it, favorite: favSet.has(it.key) }));

  return { loaded, items, toggleFavorite };
}
