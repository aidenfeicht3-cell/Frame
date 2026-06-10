/**
 * STUB — real YouTube integration goes here later.
 *
 * This is the clearly-labeled boundary for "paste your channel → live
 * analytics". It's a stub today so the rest of the app works with manually
 * logged numbers; when we add the backend we fill these in WITHOUT changing
 * any screen.
 *
 * TODO: add the real YouTube Data API.
 *   - Public stats (subscribers, views, recent videos) need a YOUTUBE_API_KEY.
 *   - Owner analytics (retention, impressions, CTR) need Google OAuth as the
 *     channel owner.
 * Read keys from environment variables — never hard-code them.
 */

export type ChannelSnapshot = {
  handle: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
};

/** True once a YouTube key is configured. Always false for now. */
export function youtubeIsConnected(): boolean {
  return Boolean(process.env.YOUTUBE_API_KEY);
}

/** Placeholder. Returns null until the real API is wired up. */
export async function getChannelSnapshot(
  _handle: string,
): Promise<ChannelSnapshot | null> {
  // TODO: fetch https://www.googleapis.com/youtube/v3/channels?part=statistics
  //       &forHandle=<handle>&key=<YOUTUBE_API_KEY> and map the response.
  return null;
}
