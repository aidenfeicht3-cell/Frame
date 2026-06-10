"use client";

import { useEffect, useState } from "react";

/**
 * Global confetti + toast. Listens for the "frame:celebrate" event and bursts
 * for ~2 seconds. Confetti is hidden under prefers-reduced-motion (the toast
 * still shows), so it stays calm for anyone who wants that.
 */
const COLORS = ["#5A4FE0", "#4A3ECF", "#FF9D2E", "#FF5A5F", "#10B981"];

export function Celebration() {
  const [burst, setBurst] = useState<{ id: number; message: string } | null>(
    null,
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const message =
        (e as CustomEvent).detail?.message ?? "Nice work!";
      setBurst({ id: Date.now(), message });
    };
    window.addEventListener("frame:celebrate", handler);
    return () => window.removeEventListener("frame:celebrate", handler);
  }, []);

  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setBurst(null), 2200);
    return () => clearTimeout(t);
  }, [burst]);

  if (!burst) return null;

  const pieces = Array.from({ length: 44 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    color: COLORS[i % COLORS.length],
    size: 6 + Math.random() * 6,
  }));

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden
    >
      {pieces.map((p, i) => (
        <span
          key={`${burst.id}-${i}`}
          className="absolute top-0 animate-confetti-fall rounded-[2px] motion-reduce:hidden"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <div className="absolute left-1/2 top-24 -translate-x-1/2 animate-fade-up rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-lift">
        {burst.message}
      </div>
    </div>
  );
}
