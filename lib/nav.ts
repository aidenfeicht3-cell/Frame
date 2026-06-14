import {
  Home,
  Route,
  Clapperboard,
  Layers,
  CalendarDays,
  BarChart3,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Primary destinations.
 *
 * `navItems` is the full set shown in the desktop sidebar (which has room).
 * `bottomNavItems` is the curated set for the phone bottom tab bar — we keep it
 * tight on purpose so it never feels overwhelming. Studio is the hub that
 * collects the insight + AI tools (Frame IQ, Creator Score, Roadmap, Retention,
 * Why It Went Viral, Progress, Vault), so those don't clutter the bar OR live
 * buried in Settings. On phones Progress lives inside Studio rather than the bar.
 */
export const navItems: NavItem[] = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/path", label: "Path", icon: Route },
  { href: "/builder", label: "Build", icon: Clapperboard },
  { href: "/projects", label: "Projects", icon: Layers },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/studio", label: "Studio", icon: LayoutGrid },
];

/** Phone bottom bar — Progress is reachable from inside Studio there. */
export const bottomNavItems: NavItem[] = navItems.filter(
  (item) => item.href !== "/progress",
);
