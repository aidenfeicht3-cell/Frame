"use client";

import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import type { Milestone } from "@/lib/milestones/types";

type Draft = { label: string; target: number; current: number };

export function MilestoneSheet({
  open,
  editing,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  editing: Milestone | null;
  onClose: () => void;
  onSave: (data: Draft) => void;
  onDelete?: () => void;
}) {
  const [label, setLabel] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (!open) return;
    setLabel(editing?.label ?? "");
    setTarget(editing ? String(editing.target) : "");
    setCurrent(editing ? String(editing.current) : "0");
  }, [open, editing]);

  const num = (s: string) => Math.max(0, Math.round(Number(s) || 0));

  const save = () =>
    onSave({
      label: label.trim() || "New goal",
      target: Math.max(1, num(target)),
      current: num(current),
    });

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={editing ? "Edit goal" : "New goal"}
    >
      <div className="space-y-3">
        <Field label="Goal">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Reach 100 subscribers"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Target">
            <input
              type="number"
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="100"
              className={inputClass}
            />
          </Field>
          <Field label="Current">
            <input
              type="number"
              inputMode="numeric"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </Field>
        </div>
        <Button onClick={save} className="w-full">
          <Check className="h-4 w-4" /> {editing ? "Save goal" : "Add goal"}
        </Button>
        {editing && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="flex w-full items-center justify-center gap-1.5 rounded-2xl py-2.5 text-sm font-semibold text-coral transition-colors hover:bg-coral/10"
          >
            <Trash2 className="h-4 w-4" /> Delete goal
          </button>
        )}
      </div>
    </Sheet>
  );
}

const inputClass =
  "w-full rounded-2xl border border-hairline bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus-visible:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}
