"use client";

import { TEAMS } from "@/lib/data";

// ── Helpers ──────────────────────────────────────────────────────────────────
export const fmt   = (n, d = 1) => Number(n).toFixed(d);
export const fmt0  = (n) => Math.round(n).toLocaleString();
export const fmtSign = (n, d = 1) => (n >= 0 ? "+" : "") + Number(n).toFixed(d);

export const teamGradient = (abbr) => {
  const t = TEAMS[abbr];
  if (!t) return "linear-gradient(135deg,#3b4252,#2e3440)";
  return `linear-gradient(135deg, ${t.primary}, ${t.secondary})`;
};

// ── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, fill = "none", stroke = "currentColor", sw = 1.6, children }) => (
  <svg className="ico" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

export const Icons = {
  home:      () => <Ico><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></Ico>,
  team:      () => <Ico><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3.1-5.5 6-5.5s5.4 2.1 6 5.5"/><circle cx="17" cy="6" r="2.2"/><path d="M14.5 13c2-.6 4 .9 4.5 3"/></Ico>,
  live:      () => <Ico><path d="M3 12h4l2-7 4 14 2-7h6"/></Ico>,
  player:    () => <Ico><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></Ico>,
  waivers:   () => <Ico><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></Ico>,
  standings: () => <Ico><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M3 19h18"/></Ico>,
  bell:      () => <Ico><path d="M6 8a6 6 0 1112 0v5l1.5 3h-15L6 13z"/><path d="M10 19a2 2 0 004 0"/></Ico>,
  search:    () => <Ico><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></Ico>,
  bolt:      () => <Ico><path d="M13 3L4 14h7l-1 7 9-11h-7z"/></Ico>,
  injury:    () => <Ico><path d="M12 8v8M8 12h8" /><circle cx="12" cy="12" r="9"/></Ico>,
  star:      () => <Ico><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></Ico>,
  starF:     () => <Ico fill="currentColor" stroke="none"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></Ico>,
  arrow:     () => <Ico><path d="M5 12h14M13 6l6 6-6 6"/></Ico>,
  chev:      () => <Ico><path d="M9 6l6 6-6 6"/></Ico>,
  filter:    () => <Ico><path d="M3 5h18M6 12h12M10 19h4"/></Ico>,
  trophy:    () => <Ico><path d="M7 4h10v3a5 5 0 11-10 0V4z"/><path d="M5 5H3a3 3 0 003 3"/><path d="M19 5h2a3 3 0 01-3 3"/><path d="M9 14v2H7v3h10v-3h-2v-2"/></Ico>,
  spark:     () => <Ico><path d="M3 16l4-6 4 4 4-8 4 6 2-2"/></Ico>,
  fire:      () => <Ico><path d="M12 3c1 3 4 4 4 8a4 4 0 11-8 0c0-2 1-3 1-5 1 1 2 1 3-3z"/></Ico>,
  plus:      () => <Ico><path d="M12 5v14M5 12h14"/></Ico>,
  swap:      () => <Ico><path d="M7 4l-3 3 3 3"/><path d="M4 7h12"/><path d="M17 14l3 3-3 3"/><path d="M20 17H8"/></Ico>,
  ext:       () => <Ico><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M20 14v6H4V4h6"/></Ico>,
  cog:       () => <Ico><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.1-1.3l2-1.5-2-3.5-2.4.9a7 7 0 00-2.3-1.3L13.8 3h-3.6l-.4 2.3a7 7 0 00-2.3 1.3l-2.4-.9-2 3.5 2 1.5A7 7 0 005 12a7 7 0 00.1 1.3l-2 1.5 2 3.5 2.4-.9a7 7 0 002.3 1.3L10.2 21h3.6l.4-2.3a7 7 0 002.3-1.3l2.4.9 2-3.5-2-1.5A7 7 0 0019 12z"/></Ico>,
  close:     () => <Ico><path d="M6 6l12 12M18 6L6 18"/></Ico>,
};

// ── PlayerChip ───────────────────────────────────────────────────────────────
export function Avatar({ p, size = 28 }) {
  const t = TEAMS[p.team];
  const bg = t ? `linear-gradient(135deg, ${t.primary}, ${t.secondary})` : "#2e3440";
  return (
    <div className="avatar-sq" style={{ width: size, height: size, background: bg, borderRadius: 6 }}>
      {p.img || (p.name || "").split(" ").map((s) => s[0]).slice(0, 2).join("")}
    </div>
  );
}

export function PlayerChip({ p, onClick }) {
  const t = TEAMS[p.team];
  const bg = t ? `linear-gradient(135deg, ${t.primary}, ${t.secondary})` : "#2e3440";
  const statusTag = p.status === "il"  ? <span className="tag warn" style={{ fontSize: 9 }}>IL</span>
                  : p.status === "dtd" ? <span className="tag warn" style={{ fontSize: 9 }}>DTD</span>
                  : null;
  return (
    <div className="player" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="avatar-sq" style={{ background: bg }}>{p.img || (p.name || "").split(" ").map((s) => s[0]).slice(0, 2).join("")}</div>
      <div className="col" style={{ gap: 1 }}>
        <div className="name row gap-6">{p.name}{statusTag}</div>
        <div className="meta">
          <span className="pos">{p.pos}</span>
          <span>{p.team}</span>
        </div>
      </div>
    </div>
  );
}

// ── Sparkline ────────────────────────────────────────────────────────────────
export function Sparkline({ data = [], w = 60, h = 22 }) {
  if (!data || data.length < 2) return <div style={{ width: w, height: h }} />;
  const max = Math.max(...data, 1);
  return (
    <div className="spark" style={{ width: w, height: h }}>
      {data.map((v, i) => (
        <i key={i} style={{ height: Math.max(2, (v / max) * h), background: v > 0 ? "var(--accent)" : "var(--ink-3)" }} />
      ))}
    </div>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
export function Donut({ value, size = 64, sw = 8 }) {
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, value));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-3)" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--accent)" strokeWidth={sw}
        strokeDasharray={`${circ * pct} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

// ── Diamond base-state SVG ────────────────────────────────────────────────────
export function Diamond({ bases = [0, 0, 0], outs = 0, size = 56 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.28;
  const pts = [
    [cx,           cy - r],   // 2B (top)
    [cx + r,       cy],       // 1B (right)
    [cx,           cy + r],   // Home (bottom, decorative)
    [cx - r,       cy],       // 3B (left)
  ];
  const baseColors = [
    bases[1] ? "var(--warn)" : "var(--bg-3)",  // 2B
    bases[0] ? "var(--warn)" : "var(--bg-3)",  // 1B
    "var(--bg-2)",
    bases[2] ? "var(--warn)" : "var(--bg-3)",  // 3B
  ];
  const sq = size * 0.13;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polygon
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none" stroke="var(--line-2)" strokeWidth="1"
      />
      {pts.map(([x, y], i) => (
        <rect key={i} x={x - sq / 2} y={y - sq / 2} width={sq} height={sq}
              fill={baseColors[i]} rx="2"
              transform={`rotate(45 ${x} ${y})`} />
      ))}
      <text x={cx} y={cy + size * 0.38} textAnchor="middle"
            fill="var(--ink-2)" fontSize={size * 0.16} fontFamily="var(--font-mono)">
        {outs}O
      </text>
    </svg>
  );
}

// ── TeamMark ─────────────────────────────────────────────────────────────────
export function TeamMark({ abbr, size = 24, radius = 6 }) {
  const t = TEAMS[abbr];
  const bg = t ? `linear-gradient(135deg, ${t.primary}, ${t.secondary})` : "#2e3440";
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, background: bg,
      display: "grid", placeItems: "center", color: "white",
      fontSize: size * 0.38, fontWeight: 700, fontFamily: "var(--font-mono)",
      letterSpacing: "-.02em", flexShrink: 0,
    }}>
      {abbr ? abbr.slice(0, 2) : "?"}
    </div>
  );
}
