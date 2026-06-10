"use client";

import { useCallback, useEffect, useState } from "react";
import { getIdeas, saveIdeas } from "./store";
import type { Idea } from "./types";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function useIdeas() {
  const [loaded, setLoaded] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    setIdeas(getIdeas());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveIdeas(ideas);
  }, [ideas, loaded]);

  const addIdea = useCallback((text: string, tags: string[]) => {
    const clean = text.trim();
    if (!clean) return;
    setIdeas((prev) => [
      { id: uid(), text: clean, tags, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const removeIdea = useCallback((id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { loaded, ideas, addIdea, removeIdea };
}
