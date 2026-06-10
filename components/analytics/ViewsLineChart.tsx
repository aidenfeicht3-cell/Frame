/**
 * A small SVG line chart of views over time. Shows the trend (peaks & drops),
 * highlights the best video (amber dot) and the lowest (grey dot). Pure SVG —
 * no charting library. Expects 2+ points.
 *
 * Colours are Frame's design tokens, inlined as hex because SVG paint can't use
 * Tailwind utility classes reliably: brand-500 #5A4FE0, brand-600 #4A3ECF,
 * amber #FF9D2E, muted #8A85A0, hairline #E7E3F2.
 */
export function ViewsLineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  if (data.length < 2) return null;

  const W = 600;
  const H = 200;
  const PADX = 14;
  const PADT = 18;
  const PADB = 14;
  const plotW = W - PADX * 2;
  const plotH = H - PADT - PADB;

  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const px = (i: number) => PADX + (i / (n - 1)) * plotW;
  const py = (v: number) => PADT + (1 - v / max) * plotH;

  const pts = data.map((d, i) => ({ x: px(i), y: py(d.value) }));
  const line = pts
    .map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${px(n - 1).toFixed(1)} ${(H - PADB).toFixed(
    1,
  )} L ${px(0).toFixed(1)} ${(H - PADB).toFixed(1)} Z`;

  let peak = 0;
  let low = 0;
  data.forEach((d, i) => {
    if (d.value > data[peak].value) peak = i;
    if (d.value < data[low].value) low = i;
  });

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Views over time"
      >
        <defs>
          <linearGradient id="viewsArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5A4FE0" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#5A4FE0" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* baseline */}
        <line
          x1={PADX}
          y1={H - PADB}
          x2={W - PADX}
          y2={H - PADB}
          stroke="#E7E3F2"
          strokeWidth="1.5"
        />

        <path d={area} fill="url(#viewsArea)" />
        <path
          d={line}
          fill="none"
          stroke="#4A3ECF"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {pts.map((p, i) => {
          const isPeak = i === peak;
          const isLow = i === low && low !== peak;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={isPeak ? 6 : 4}
              fill={isPeak ? "#FF9D2E" : isLow ? "#8A85A0" : "#4A3ECF"}
              stroke="#fff"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      <div className="mt-1 flex justify-between text-[11px] text-muted">
        <span>{data[0].label}</span>
        <span>{data[data.length - 1].label}</span>
      </div>
    </div>
  );
}
