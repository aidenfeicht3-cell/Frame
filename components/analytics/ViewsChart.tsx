/** A tiny CSS bar chart — no charting library needed. */
export function ViewsChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-32 items-end gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-brand-500 transition-all"
              style={{ height: `${Math.max(4, (d.value / max) * 100)}%` }}
              title={`${d.value.toLocaleString()} views`}
            />
          </div>
          <span className="w-full truncate text-center text-[10px] text-muted">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
