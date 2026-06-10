"use client";

import { useEffect, useState } from "react";

/**
 * A small human touch: greets by time of day and shows today's date.
 * Computed on the client (after mount) so it always reflects the user's
 * real local time without causing a server/client mismatch.
 */
export function Greeting() {
  const [text, setText] = useState("Welcome to Frame");

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    const part =
      h < 5
        ? "Late night"
        : h < 12
          ? "Good morning"
          : h < 18
            ? "Good afternoon"
            : "Good evening";
    const date = now.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    setText(`${part} · ${date}`);
  }, []);

  return <p className="text-sm font-medium text-muted">{text} 👋</p>;
}
