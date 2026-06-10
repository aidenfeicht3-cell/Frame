/** Shapes returned by the AI layer. Safe to import anywhere (types only). */

export type BrandKit = {
  names: string[]; // 3 channel-name ideas
  bio: string; // 2-sentence channel bio
  bannerConcept: string;
  pfpConcept: string;
};

export type ChannelToStudy = {
  name: string; // a style/archetype of channel to learn from
  why: string; // why it's worth studying
  steal: string; // one concrete thing to borrow
  searchUrl: string; // a YouTube search link to find examples
};

export type TitleRating = {
  score: number; // 1-10
  verdict: string; // one-line take
  rewrites: string[]; // 2-3 stronger versions
};
