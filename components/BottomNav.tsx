"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/cn";

/** Phone-only bottom tab bar. Hidden on desktop (md and up). */
export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface/80 backdrop-blur-xl md:hidden">
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 py-1"
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-2xl px-3.5 py-1 transition-colors",
                    active ? "bg-indigo/10 text-indigo" : "text-muted",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium transition-colors",
                    active ? "text-indigo" : "text-muted",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
