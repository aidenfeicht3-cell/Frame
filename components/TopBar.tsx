"use client";

import Link from "next/link";
import { Flame, Settings } from "lucide-react";
import { Logo } from "./Logo";
import { useStreak } from "@/lib/useStreak";

/**
 * Sticky, frosted top bar.
 *  - Phone: Frame logo on the left, streak + settings on the right.
 *  - Desktop: the logo lives in the sidebar, so we only show streak on the right.
 */
export function TopBar() {
  const { streak } = useStreak();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-paper/70 px-4 py-3 backdrop-blur-xl md:justify-end">
      <Link href="/" className="md:hidden">
        <Logo markClassName="h-7 w-7" />
      </Link>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-amber/20 bg-amber/10 px-3 py-1.5 text-sm font-semibold text-amber">
          <Flame className="h-4 w-4" />
          {streak}
        </span>
        <Link
          href="/settings"
          aria-label="Settings"
          className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink md:hidden"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
