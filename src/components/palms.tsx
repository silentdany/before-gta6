// Hand-drawn, simplified palm silhouettes (original SVG, no third-party art).
function Palm({ x, h, lean = 0, scale = 1 }: { x: number; h: number; lean?: number; scale?: number }) {
  const top = { x: x + lean, y: 300 - h };
  const frond = (a: number, len: number) => {
    const r = (a * Math.PI) / 180;
    const ex = top.x + Math.cos(r) * len * scale;
    const ey = top.y + Math.sin(r) * len * scale;
    const cx = top.x + Math.cos(r - 0.5) * len * 0.6 * scale;
    const cy = top.y + Math.sin(r - 0.5) * len * 0.6 * scale - 10;
    return `M${top.x},${top.y} Q${cx},${cy} ${ex},${ey} Q${(cx + top.x) / 2 + 6},${(cy + top.y) / 2 + 8} ${top.x},${top.y}Z`;
  };
  return (
    <g>
      <path d={`M${x - 5 * scale},300 Q${x + lean * 0.3},${300 - h * 0.6} ${top.x},${top.y} L${top.x + 3},${top.y + 2} Q${x + lean * 0.3 + 6},${300 - h * 0.55} ${x + 5 * scale},300Z`} />
      {[-170, -140, -110, -70, -40, -10, 20, 160].map((a) => (
        <path key={a} d={frond(a, a === 20 || a === 160 ? 55 : 75)} />
      ))}
    </g>
  );
}

export function Palms({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <g fill="currentColor">
        <Palm x={60} h={230} lean={-25} />
        <Palm x={130} h={170} lean={18} scale={0.8} />
        <Palm x={500} h={250} lean={30} />
        <Palm x={560} h={160} lean={-15} scale={0.75} />
        <rect x="0" y="288" width="600" height="12" />
      </g>
    </svg>
  );
}
