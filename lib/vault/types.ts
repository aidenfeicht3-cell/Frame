/** A single thing in the creator's workspace — an idea or a video project. */
export type VaultKind = "idea" | "project";

export type VaultItem = {
  key: string; // `${kind}:${id}` — stable id used for favorites
  kind: VaultKind;
  id: string;
  title: string;
  subtitle?: string;
  tags: string[];
  createdAt: string;
  href: string; // where to act on it
  favorite: boolean;
};
