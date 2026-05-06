"use client";

import { useState } from "react";
import { PLAYERS, TEAMS, STANDINGS, FREE_AGENTS } from "@/lib/data";
import { fmt, fmt0, Icons, PlayerChip, TeamMark } from "./atoms";

// ── Player detail slide-over ──────────────────────────────────────────────────
export function PlayerDetail({ pid, onClose }) {
  if (!pid) return null;
  const p = PLAYERS.find((x) => x.id === pid);
  if (!p) return null;
  const t = TEAMS[p.team] || {};

  const last10 = [4.2,8.6,2.1,12.4,9.8,11.0,6.3,14.2,8.0,p.today].map((x) => +x.toFixed(1));
  const splits = [
    { lbl: "vs RHP", v: 1.18 }, { lbl: "vs LHP", v: 0.94 },
    { lbl: "Home",   v: 1.22 }, { lbl: "Away",   v: 0.97 },
    { lbl: "Day",    v: 1.04 }, { lbl: "Night",  v: 1.09 },
  ];

  return (
    <div className="col" style={{ height: "100%" }}>
      <div style={{
        padding: "22px 22px 16px",
        background: `linear-gradient(135deg, ${t.primary || "#1a2233"}, ${t.secondary || "#0a0d12"})`,
        color: "white", position: "relative",
      }}>
        <button className="btn ghost sm" onClick={onClose} style={{ position: "absolute", top: 12, right: 12, color: "white" }}><Icons.close /></button>
        <div className="row gap-14">
          <div className="avatar-sq" style={{ width: 64, height: 64, borderRadius: 12, background: `linear-gradient(135deg, ${t.primary || "#1a2233"}, ${t.secondary || "#0a0d12"})`, border: "2px solid rgba(255,255,255,.2)" }}>{p.img}</div>
          <div className="col gap-4">
            <div className="row gap-8">
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.01em" }}>{p.name}</div>
              {p.status === "il"  && <span className="tag warn">IL-10</span>}
              {p.status === "dtd" && <span className="tag warn">DTD</span>}
            </div>
            <div className="mono" style={{ opacity: .85, fontSize: 12 }}>{p.team} · {p.pos} · Bats {p.bats}</div>
            <div className="row gap-6" style={{ marginTop: 6 }}>
              <button className="btn sm primary"><Icons.plus /> Add to lineup</button>
              <button className="btn sm" style={{ background: "rgba(255,255,255,.1)", color: "white", borderColor: "rgba(255,255,255,.2)" }}><Icons.starF /> Watchlist</button>
              <button className="btn sm" style={{ background: "rgba(255,255,255,.1)", color: "white", borderColor: "rgba(255,255,255,.2)" }}><Icons.swap /> Trade</button>
            </div>
          </div>
        </div>
      </div>

      <div className="col gap-16" style={{ padding: "18px 22px" }}>
        <div className="grid-4">
          {[
            { k: "Today",  v: fmt(p.today),   sub: `proj ${fmt(p.proj)}` },
            { k: "7-day",  v: fmt(p.week),    sub: `${fmt(p.week / 7, 1)}/g avg` },
            { k: "Season", v: fmt0(p.season), sub: `${fmt(p.season / 120, 1)} ppg` },
            { k: "Owned",  v: `${p.own}%`,    sub: `+0.4% 7d` },
          ].map((c) => (
            <div key={c.k} className="card card-pad col" style={{ gap: 2 }}>
              <div className="eyebrow">{c.k}</div>
              <div className="tnum" style={{ fontSize: 24, fontWeight: 700 }}>{c.v}</div>
              <div className="mono muted" style={{ fontSize: 11 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-h"><h3>Last 10 games</h3><span className="meta">fantasy points</span></div>
          <div className="card-pad" style={{ paddingTop: 8 }}>
            <BigChart data={last10} />
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Matchup splits</h3><span className="meta">wRC+ index</span></div>
          <div className="card-pad" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {splits.map((s) => (
              <div key={s.lbl} className="col gap-6">
                <div className="row"><span className="muted" style={{ fontSize: 11.5 }}>{s.lbl}</span><span className="spacer" /><span className="tnum mono">{Math.round(s.v * 100)}</span></div>
                <div className="bar"><i style={{ width: Math.min(100, s.v * 60) + "%", background: s.v >= 1 ? "var(--pos)" : "var(--neg)" }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>News &amp; alerts</h3><span className="meta">subscribed</span></div>
          <div className="card-pad col gap-10">
            <div className="tick">
              <span className="tag pos">PLAY</span>
              <div className="col" style={{ flex: 1 }}><div><b>{p.name}</b> {p.news}</div><div className="muted" style={{ fontSize: 11 }}>2 minutes ago · MLB.com</div></div>
            </div>
            <div className="tick">
              <span className="tag info">PROBABLE</span>
              <div className="col" style={{ flex: 1 }}><div>In starting lineup, batting cleanup.</div><div className="muted" style={{ fontSize: 11 }}>4h ago · Beat reporter</div></div>
            </div>
            <div className="tick">
              <span className="tag flat">NOTE</span>
              <div className="col" style={{ flex: 1 }}><div>Hits .312 vs RHP this season (87 PA).</div><div className="muted" style={{ fontSize: 11 }}>1d ago · Diamond Insights</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigChart({ data }) {
  const w = 480, h = 140, pad = 20;
  const max = Math.max(...data, 10);
  const sx = (i) => pad + (i / (data.length - 1)) * (w - 2 * pad);
  const sy = (v) => h - pad - (v / max) * (h - 2 * pad);
  const path = data.map((v, i) => (i === 0 ? "M" : "L") + sx(i) + " " + sy(v)).join(" ");
  const area = path + ` L ${sx(data.length - 1)} ${h - pad} L ${sx(0)} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={pad + p * (h - 2 * pad)} y2={pad + p * (h - 2 * pad)} stroke="var(--line)" strokeDasharray="2 3" />
      ))}
      <path d={area} fill="var(--accent)" opacity=".15" />
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {data.map((v, i) => (
        <g key={i}>
          <circle cx={sx(i)} cy={sy(v)} r="3" fill="var(--accent)" />
          <text x={sx(i)} y={sy(v) - 8} textAnchor="middle" fill="var(--ink-1)" fontSize="10" fontFamily="var(--font-mono)">{v.toFixed(1)}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Waivers ───────────────────────────────────────────────────────────────────
export function WaiversPage({ openPlayer }) {
  const [pos, setPos] = useState("ALL");
  const positions = ["ALL","C","1B","2B","3B","SS","OF","SP","RP"];
  const list = FREE_AGENTS.filter((p) => pos === "ALL" || p.pos.includes(pos));

  return (
    <div className="page col gap-16">
      <div className="row gap-16" style={{ alignItems: "flex-end" }}>
        <div className="col gap-6">
          <div className="eyebrow">Waivers · 3 claims pending · Process Wed 3:00 AM</div>
          <h1 className="h1">Free agents</h1>
          <div className="sub">Sorted by 14-day projection. Claim or add immediately if no waivers active.</div>
        </div>
        <div className="spacer" />
        <span className="pill mono">FAAB $48 / $100</span>
        <button className="btn"><Icons.filter /> Filters</button>
      </div>

      <div className="row gap-6" style={{ flexWrap: "wrap" }}>
        {positions.map((x) => (
          <button key={x} className={`btn sm ${pos === x ? "primary" : ""}`} onClick={() => setPos(x)}>{x}</button>
        ))}
        <div className="spacer" />
        <span className="muted mono" style={{ fontSize: 11 }}>{list.length} players</span>
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 14 }}>Player</th>
              <th>News</th>
              <th className="num">Proj 14d</th>
              <th className="num">ROS</th>
              <th className="num">Trend</th>
              <th className="num">Owned</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => (
              <tr key={i}>
                <td style={{ paddingLeft: 14 }}><PlayerChip p={{ ...p, status: "active" }} /></td>
                <td className="muted" style={{ fontSize: 12 }}>{p.news}</td>
                <td className="num"><b>{p.proj14}</b></td>
                <td className="num muted">{p.ros}</td>
                <td className="num"><span className="tag pos">{p.trend}</span></td>
                <td className="num muted">{p.owned}%</td>
                <td>
                  <div className="row gap-6">
                    <button className="btn sm">Claim</button>
                    <button className="btn sm primary"><Icons.plus /> Add</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Standings ─────────────────────────────────────────────────────────────────
export function StandingsPage({ espnData, loading }) {
  const rows = espnData?.standings?.length ? espnData.standings : STANDINGS;
  const leagueName = espnData?.league?.settings?.name || "Diamond Cartel";
  const playoffSpots = espnData?.league?.settings?.scheduleSettings?.playoffTeamCount || 6;

  return (
    <div className="page col gap-16">
      <div className="row gap-16" style={{ alignItems: "flex-end" }}>
        <div className="col gap-6">
          <div className="eyebrow">Standings · 2025 · Points league</div>
          <h1 className="h1">{leagueName}</h1>
          <div className="sub">Top {playoffSpots} make the playoffs.</div>
        </div>
        <div className="spacer" />
        <span className="pill mono">PF tiebreaker</span>
      </div>
      {loading && <div className="muted mono" style={{ fontSize: 12 }}>Loading live standings…</div>}
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 40, paddingLeft: 14 }}>#</th>
              <th>Team</th>
              <th className="num">W</th>
              <th className="num">L</th>
              <th className="num">PF</th>
              <th className="num">PA</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.rank} style={{ background: s.you ? "rgba(245,213,71,.04)" : undefined }}>
                <td className="mono" style={{ paddingLeft: 14, color: s.rank <= playoffSpots ? "var(--pos)" : "var(--ink-2)" }}>{s.rank}</td>
                <td>
                  <div className="row gap-10">
                    <TeamMark abbr={s.abbr} size={24} radius={6} />
                    <span style={{ fontWeight: s.you ? 700 : 500 }}>{s.name}</span>
                    {s.you && <span className="tag flat">YOU</span>}
                    {s.rank <= playoffSpots && <span className="tag pos" style={{ fontSize: 9 }}>PLAYOFFS</span>}
                  </div>
                </td>
                <td className="num tnum" style={{ fontWeight: 700 }}>{s.w}</td>
                <td className="num tnum muted">{s.l}</td>
                <td className="num tnum">{typeof s.pf === "number" ? s.pf.toFixed(1) : s.pf}</td>
                <td className="num tnum muted">{typeof s.pa === "number" ? s.pa.toFixed(1) : s.pa}</td>
                <td className="muted" style={{ fontSize: 12 }}>{s.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Placeholder pages ───────────────────────────────────────────────────��─────
export function PlayersPage({ openPlayer }) {
  return (
    <div className="page col gap-16">
      <div className="col gap-6">
        <div className="eyebrow">All Players</div>
        <h1 className="h1">Player search</h1>
        <div className="sub">Browse all available players. Use ⌘K for quick search.</div>
      </div>
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 14 }}>Player</th>
              <th className="num">Proj</th>
              <th className="num">Today</th>
              <th className="num">7-day</th>
              <th className="num">Season</th>
              <th className="num">Owned</th>
            </tr>
          </thead>
          <tbody>
            {PLAYERS.map((p) => (
              <tr key={p.id} onClick={() => openPlayer(p.id)} style={{ cursor: "pointer" }}>
                <td style={{ paddingLeft: 14 }}><PlayerChip p={p} /></td>
                <td className="num">{fmt(p.proj)}</td>
                <td className="num"><b className={p.today > p.proj ? "up" : ""}>{fmt(p.today)}</b></td>
                <td className="num muted">{fmt(p.week)}</td>
                <td className="num muted">{fmt0(p.season)}</td>
                <td className="num muted">{p.own}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function WatchlistPage({ openPlayer }) {
  const watched = PLAYERS.filter((p) => ["judge","ohtani","betts","wheeler","henderson","skubal"].includes(p.id));
  return (
    <div className="page col gap-16">
      <div className="col gap-6">
        <div className="eyebrow">Watchlist · 6 players</div>
        <h1 className="h1">Watchlist</h1>
      </div>
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 14 }}>Player</th>
              <th className="num">Proj</th>
              <th className="num">Today</th>
              <th className="num">Season</th>
              <th className="num">Owned</th>
            </tr>
          </thead>
          <tbody>
            {watched.map((p) => (
              <tr key={p.id} onClick={() => openPlayer(p.id)} style={{ cursor: "pointer" }}>
                <td style={{ paddingLeft: 14 }}><PlayerChip p={p} /></td>
                <td className="num">{fmt(p.proj)}</td>
                <td className="num"><b>{fmt(p.today)}</b></td>
                <td className="num muted">{fmt0(p.season)}</td>
                <td className="num muted">{p.own}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AlertsPage() {
  const alerts = [
    { kind: "warn",  title: "Acuña Jr. placed on IL-10 (knee)", body: "Consider dropping for Heliot Ramos (+18 proj/14d)", t: "2m ago" },
    { kind: "info",  title: "Wheeler cruising — 7 IP, 11 K (live)", body: "On pace for 26+ fantasy points today", t: "Live" },
    { kind: "neg",   title: "Devers day-to-day with shoulder soreness", body: "Probable tomorrow per BOS beat reporter", t: "1h ago" },
    { kind: "pos",   title: "Ohtani confirmed to start Sunday", body: "Two-way lineup slot available", t: "3h ago" },
    { kind: "flat",  title: "Waiver wire processes in 6 hours", body: "3 claims pending · $48 FAAB remaining", t: "6h ago" },
  ];
  return (
    <div className="page col gap-16">
      <div className="col gap-6">
        <div className="eyebrow">Alerts · 2 unread</div>
        <h1 className="h1">Alerts</h1>
      </div>
      <div className="card col" style={{ padding: 16, gap: 10 }}>
        {alerts.map((a, i) => (
          <div key={i} className="tick">
            <span className={`tag ${a.kind}`}>{a.kind.toUpperCase()}</span>
            <div className="col" style={{ flex: 1, gap: 2 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</div>
              <div className="muted" style={{ fontSize: 11.5 }}>{a.body}</div>
            </div>
            <span className="mono muted" style={{ fontSize: 11 }}>{a.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
