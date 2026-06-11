"use client";

import { useEffect } from "react";
import { getSettings } from "@/lib/settings/store";
import { syncKeyToServer } from "@/lib/settings/sync";

/**
 * On every app load, re-push the saved Anthropic key (if any) to the server, so
 * real AI keeps working after a dev-server restart without re-pasting it.
 * Renders nothing.
 */
export function KeySync() {
  useEffect(() => {
    const key = getSettings().anthropicKey?.trim();
    if (key) void syncKeyToServer(key);
  }, []);
  return null;
}
