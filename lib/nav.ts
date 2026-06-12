import {
  Home,
  Route,
  Clapperboard,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * The 5 primary destinations. These appear in the bottom tab bar on phones
 * and the sidebar on desktop. We keep it to 5 on purpose — the whole point
 * of Frame is to never overwhelm. Secondary screens are reached from within
 * these, and Settings lives in the top bar / sidebar footer.
 */
export const navItems: NavItem[] = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/path", label: "Path", icon: Route },
  { href: "/builder", label: "Build", icon: Clapperboard },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];
