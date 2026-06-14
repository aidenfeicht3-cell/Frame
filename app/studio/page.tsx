import Link from "next/link";
import {
  Lightbulb,
  Gauge,
  BarChart3,
  Compass,
  Activity,
  Rocket,
  Library,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

/**
 * Studio — the hub that gathers Frame's insight + AI tools in one calm place,
 * so they're easy to find without crowding the nav bar or hiding in Settings.
 * Pure directory: each card links to a tool that handles its own state.
 */

type Tool = {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
};

const GROUPS: { label: string; tools: Tool[] }[] = [
  {
    label: "Your insights",
    tools: [
      {
        href: "/frame-iq",
        label: "Frame IQ",
        desc: "Your creator profile in one place.",
        icon: Lightbulb,
      },
      {
        href: "/creator-score",
        label: "Creator Score",
        desc: "Your momentum, from 0 to 100.",
        icon: Gauge,
      },
      {
        href: "/progress",
        label: "Progress",
        desc: "Your stats and views over time.",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "AI tools",
    tools: [
      {
        href: "/roadmap",
        label: "Next-Video Roadmap",
        desc: "AI-picked ideas for your next videos.",
        icon: Compass,
      },
      {
        href: "/retention",
        label: "Retention Analyzer",
        desc: "See where viewers might drop — with fixes.",
        icon: Activity,
      },
      {
        href: "/viral",
        label: "Why It Went Viral",
        desc: "Break down a hit and copy what worked.",
        icon: Rocket,
      },
    ],
  },
  {
    label: "Library",
    tools: [
      {
        href: "/vault",
        label: "Vault",
        desc: "Search every idea and project.",
        icon: Library,
      },
    ],
  },
];

export default function StudioPage() {
  let delay = 40;
  return (
    <div className="space-y-7 py-2">
      <header className="animate-fade-up space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight">Studio</h1>
        <p className="text-sm text-muted">
          Your insights and AI tools, all in one place.
        </p>
      </header>

      {GROUPS.map((group) => {
        const d = delay;
        delay += 60;
        return (
          <section
            key={group.label}
            className="animate-fade-up space-y-3"
            style={{ animationDelay: `${d}ms` }}
          >
            <h2 className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {group.tools.map((tool) => (
                <ToolCard key={tool.href} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link href={tool.href} className="block">
      <Card interactive className="flex h-full items-center gap-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-ink">
            {tool.label}
          </p>
          <p className="text-sm leading-snug text-muted">{tool.desc}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
      </Card>
    </Link>
  );
}
