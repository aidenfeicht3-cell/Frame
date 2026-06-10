"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Flame } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { useStreak } from "@/lib/useStreak";

/** Desktop-only left navigation. Hidden on phones. */
export function Sidebar() {
  const pathname = usePathname();
  const { streak } = useStreak();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-hairline bg-surface/70 px-4 py-6 backdrop-blur-xl md:flex">
      <Link href="/" className="mb-8 px-2">
        <Logo />
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-indigo/10 font-semibold text-indigo"
                  : "font-medium text-muted hover:bg-paper hover:text-ink",
              )}
            >
              <Icon
                className="h-5 w-5 transition-transform group-hover:scale-110"
                strokeWidth={active ? 2.5 : 2}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-1 border-t border-hairline pt-4">
        {/* Streak chip */}
        <div className="mb-1 flex items-center gap-3 rounded-2xl bg-amber/10 px-3 py-2.5">
          <Flame className="h-5 w-5 shrink-0 text-amber" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">
              {streak} day streak
            </p>
            <p className="text-xs text-muted">
              {streak > 0 ? "Keep it going 🔥" : "Start today 🌱"}
            </p>
          </div>
        </div>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
            isActive("/settings")
              ? "bg-indigo/10 text-indigo"
              : "text-muted hover:bg-paper hover:text-ink",
          )}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
