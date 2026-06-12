# Frame 🎬

**Couch-to-5K, but for becoming a YouTuber.** Frame helps a complete beginner —
zero subscribers, overwhelmed, ready to quit — become a consistent creator. It
teaches the craft, does the boring parts, and uses gentle habit mechanics. The
whole app is built around one idea: **never overwhelm. One calm step at a time.**

Everything runs on **sample data with no API keys**, so you can try it instantly.
Add an Anthropic key later to make the AI features "real."

## Run it

```bash
cd C:\Users\Ashton\Projects\frame
npm install      # first time only
npm run dev      # then open http://localhost:3000
```

> Keep the project on local disk (not OneDrive/Dropbox) — cloud-sync folders
> corrupt `node_modules` and break the dev server.

### Make the AI real (optional)

Create a file named `.env.local` in the project root:

```
ANTHROPIC_API_KEY=your-key-here
```

Restart the dev server. Every "Sample AI" badge turns green ("Live AI"). Without
a key, the app uses smart built-in sample responses — nothing breaks.

## What's inside

- **Today** — your home: greets you, shows your next Path step, next upload, and
  real streak / weekly / path stats.
- **The Path** — a leveled journey (Phase 1 = zero to your first video). Each
  level is a short lesson + one action; finishing one feeds your streak.
- **Video Builder** — pick an idea → a full production plan revealed one step at
  a time (Hook → Title → Script → Shots → B-roll → Sound → Edit → Publish). The
  Edit step adapts to **your editing app and phone vs. computer**.
- **Calendar** — schedule uploads, set a weekly cadence, see what's upcoming.
- **Progress** — log a video's stats, see a **views-over-time line graph** with
  peaks/drops, get **AI coaching** for your next video, and track **milestones**.
- **Tools** — a **Hook & title tester** (rates a title 1–10 + rewrites) and an
  **Idea vault** (save & tag ideas, turn any into a plan).
- **Dark mode** (respects your system setting) and little **confetti**
  celebrations when you complete steps or hit goals.

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · React 18 ·
lucide-react · @anthropic-ai/sdk. Data is stored in your browser
(`localStorage`) for now, behind a swappable data layer.

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — context for AI coding sessions (Claude Code).
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — how the data layer, AI
  module, and theming work.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — what's done and what's next.
