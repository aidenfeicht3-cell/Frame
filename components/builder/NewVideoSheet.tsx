"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  EDITING_SOFTWARE,
  type Device,
  type EditingSetup,
} from "@/lib/builder/types";

export function NewVideoSheet({
  open,
  niche,
  setup,
  loading,
  onClose,
  onGenerate,
}: {
  open: boolean;
  niche: string;
  setup: EditingSetup;
  loading: boolean;
  onClose: () => void;
  onGenerate: (idea: string, setup: EditingSetup) => void;
}) {
  const [idea, setIdea] = useState("");
  const [software, setSoftware] = useState(setup.software);
  const [device, setDevice] = useState<Device>(setup.device);

  useEffect(() => {
    if (open) {
      setIdea("");
      setSoftware(setup.software);
      setDevice(setup.device);
    }
  }, [open, setup.software, setup.device]);

  const n = niche.trim() || "your topic";
  const suggestions = [
    `${n} for absolute beginners`,
    `5 ${n} mistakes to avoid`,
    `My honest take on ${n}`,
  ];

  return (
    <Sheet open={open} onClose={onClose} title="New video">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted">
            What&apos;s your video about?
          </p>
          <input
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="An idea or a title…"
            className="w-full rounded-2xl border border-hairline bg-surface px-4 py-3 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
          />
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setIdea(s)}
                className={cn(chip, idea === s ? chipOn : chipOff)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted">Your editing app</p>
          <div className="flex flex-wrap gap-1.5">
            {EDITING_SOFTWARE.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSoftware(s)}
                className={cn(chip, software === s ? chipOn : chipOff)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted">You&apos;ll edit on</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={cn(deviceBtn, device === "mobile" ? deviceOn : deviceOff)}
            >
              📱 Phone
            </button>
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={cn(deviceBtn, device === "desktop" ? deviceOn : deviceOff)}
            >
              💻 Computer
            </button>
          </div>
        </div>

        <Button
          onClick={() => onGenerate(idea, { software, device })}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Building your plan…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate plan
            </>
          )}
        </Button>
      </div>
    </Sheet>
  );
}

const chip = "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors";
const chipOn = "bg-brand-600 text-white";
const chipOff = "bg-paper text-muted hover:text-ink";
const deviceBtn = "rounded-2xl border py-3 text-sm font-semibold transition-colors";
const deviceOn = "border-brand-300 bg-brand-50 text-brand-700";
const deviceOff = "border-hairline bg-surface text-muted hover:text-ink";
