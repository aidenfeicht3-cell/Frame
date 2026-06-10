import { cn } from "@/lib/cn";

/**
 * Frame's logo mark: a viewfinder frame (camera-style corner brackets) wrapping
 * a coral play button — "composing your shot." Blue body, coral accent.
 * Use this anywhere you need just the icon (avatar, favicon, small spaces).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="Frame"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="frameMarkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6357E6" />
          <stop offset="1" stopColor="#4A3ECF" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#frameMarkGrad)" />
      {/* viewfinder corner brackets */}
      <g
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      >
        <path d="M18 13 H15 a2 2 0 0 0 -2 2 V18" />
        <path d="M30 13 H33 a2 2 0 0 1 2 2 V18" />
        <path d="M18 35 H15 a2 2 0 0 1 -2 -2 V30" />
        <path d="M30 35 H33 a2 2 0 0 0 2 -2 V30" />
      </g>
      {/* play button */}
      <path
        d="M20.5 18.5 L30.5 24 L20.5 29.5 Z"
        fill="#FF5A5F"
        stroke="#FF5A5F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The full lockup: mark + "Frame" wordmark in the display font. */
export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-8 w-8 shrink-0", markClassName)} />
      <span className="font-display text-xl font-bold tracking-tight text-ink">
        Frame
      </span>
    </span>
  );
}
