"use client";

import Link from "next/link";
import { Flame, Settings } from "lucide-react";
import { Logo } from "./Logo";

/**
 * Sticky, frosted top bar.
 *  - Phone: Frame logo on the left, streak + settings on the right.
 *  - Desktop: the logo lives in the sidebar, so we only show streak on the right.
 *
 * The streak number is hard-coded to 0 for now — Step 7 wires it to real data.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-paper/70 px-4 py-3 backdrop-blur-xl md:justify-end">
      <Link href="/" className="md:hidden">
        <Logo markClassName="h-7 w-7" />
      </Link>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-amber/20 bg-amber/10 px-3 py-1.5 text-sm font-semibold text-amber">
          <Flame className="h-4 w-4" />0
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
