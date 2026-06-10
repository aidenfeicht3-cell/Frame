/**
 * Tiny helper to join CSS class names together, skipping any that are
 * false/null/undefined. Lets us write conditional classes cleanly:
 *   cn("base", isActive && "active")
 */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
