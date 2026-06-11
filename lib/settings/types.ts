/** App-wide settings the user controls (stored on their device for now). */
export type AppSettings = {
  /** The user's Anthropic API key. Stays on this device; powers real AI. */
  anthropicKey: string;
};

export const EMPTY_SETTINGS: AppSettings = { anthropicKey: "" };
