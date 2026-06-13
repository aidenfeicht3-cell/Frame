import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";
import { Celebration } from "./Celebration";
import { SyncProvider } from "./SyncProvider";

/**
 * The frame around every screen.
 *  - Desktop: a fixed sidebar on the left.
 *  - Phone: a top bar + a bottom tab bar.
 * Content is centered and capped at a comfortable reading width.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="md:pl-64">
        <TopBar />
        <main className="mx-auto w-full max-w-2xl px-4 pb-28 pt-4 md:pb-12">
          {children}
        </main>
      </div>
      <BottomNav />
      <Celebration />
      <SyncProvider />
    </div>
  );
}
