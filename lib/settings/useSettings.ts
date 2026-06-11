"use client";

import { useCallback, useEffect, useState } from "react";
import { getSettings, saveSettings } from "./store";
import { clearKeyOnServer, syncKeyToServer } from "./sync";

/**
 * Manages the locally-saved Anthropic key. Saving also pushes the key to the
 * server so AI goes live right away; clearing removes it from both places.
 */
export function useSettings() {
  const [loaded, setLoaded] = useState(false);
  const [anthropicKey, setKey] = useState("");

  useEffect(() => {
    setKey(getSettings().anthropicKey ?? "");
    setLoaded(true);
  }, []);

  /** Save + activate a key. Returns whether AI is now live. */
  const saveKey = useCallback(async (key: string): Promise<boolean> => {
    const trimmed = key.trim();
    saveSettings({ anthropicKey: trimmed });
    setKey(trimmed);
    if (!trimmed) {
      await clearKeyOnServer();
      return false;
    }
    return syncKeyToServer(trimmed);
  }, []);

  const clearKey = useCallback(async () => {
    saveSettings({ anthropicKey: "" });
    setKey("");
    await clearKeyOnServer();
  }, []);

  return {
    loaded,
    anthropicKey,
    hasKey: anthropicKey.trim().length > 0,
    saveKey,
    clearKey,
  };
}
