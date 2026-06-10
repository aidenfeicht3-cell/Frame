/**
 * Fire a celebration (confetti + a short message). Any component can call this;
 * the global <Celebration /> overlay in the app shell listens and renders it.
 */
export function celebrate(message: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("frame:celebrate", { detail: { message } }),
    );
  }
}
