import { Card } from "./Card";
import { LogoMark } from "../Logo";

/**
 * A friendly "this screen is coming soon" panel. We use it for the tabs we
 * haven't built yet so tapping around the app never hits a blank page.
 */
export function PagePlaceholder({
  title,
  description,
  emoji,
}: {
  title: string;
  description: string;
  emoji?: string;
}) {
  return (
    <div className="py-2">
      <h1 className="mb-4 font-display text-2xl font-bold tracking-tight">
        {title}
      </h1>
      <Card className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 grid place-items-center text-4xl">
          {emoji ?? <LogoMark className="h-12 w-12 opacity-80" />}
        </div>
        <p className="mx-auto max-w-xs text-sm text-muted">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo/10 px-3 py-1.5 text-xs font-semibold text-indigo">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo" />
          Coming in a later step
        </span>
      </Card>
    </div>
  );
}
