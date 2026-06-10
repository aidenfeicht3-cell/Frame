"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function resolve(theme: Theme): boolean {
  return theme === "dark" || (theme === "system" && systemPrefersDark());
}

/**
 * Light/dark theme. Defaults to following the system setting; a toggle stores
 * an explicit choice. The no-flash script in layout.tsx applies the class
 * before paint so there's no flicker on load.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem("frame:theme") as Theme) || "system";
    setIsDark(resolve(stored));
  }, []);

  const toggle = () => {
    const next: Theme = isDark ? "light" : "dark";
    localStorage.setItem("frame:theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setIsDark(next === "dark");
  };

  return { isDark, toggle };
}
