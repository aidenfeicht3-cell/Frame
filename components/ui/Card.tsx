import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Adds a subtle hover lift — use for cards that act like links/buttons. */
  interactive?: boolean;
};

/**
 * A white rounded surface with a soft shadow — the basic building block
 * for almost every screen in Frame.
 */
export function Card({ interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-surface p-5 shadow-card",
        interactive &&
          "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
      {...props}
    />
  );
}
