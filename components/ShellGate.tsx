"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

/**
 * Decides whether a page gets the in-app chrome (sidebar / bottom nav / top bar)
 * or stands on its own. Marketing pages like /welcome bring their own header and
 * footer, so they render bare; everything else is wrapped in the AppShell.
 */
const BARE_ROUTES = ["/welcome", "/signup"];

export function ShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const bare = BARE_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  if (bare) return <>{children}</>;
  return <AppShell>{children}</AppShell>;
}
