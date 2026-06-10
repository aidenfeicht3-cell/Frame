import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // one clear action — brand blue, with a gentle lift + glow on hover
  primary:
    "bg-brand-600 text-white shadow-soft hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-glow focus-visible:ring-brand-500",
  // soft tonal blue — quieter secondary action
  secondary:
    "bg-brand-100 text-brand-700 hover:bg-brand-200 focus-visible:ring-brand-500",
  ghost:
    "border border-hairline bg-surface text-ink hover:bg-paper focus-visible:ring-brand-500",
  // white button for use on top of a coloured (blue) surface
  light:
    "bg-white text-brand-700 shadow-soft hover:-translate-y-0.5 hover:shadow-lift focus-visible:ring-white",
};

type ButtonProps = {
  variant?: Variant;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * One button to rule them all. Pass `href` to render a link that looks like
 * a button (handy for navigation), otherwise it's a normal <button>.
 */
export function Button({
  variant = "primary",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
