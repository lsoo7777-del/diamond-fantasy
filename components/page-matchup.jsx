"use client";

import { useState, useEffect } from "react";
import { MATCHUP, MY_ROSTER, PLAYERS, LIVE_FEED } from "@/lib/data";
import { fmt, PlayerChip, Sparkline, Donut, TeamMark } from "./atoms";

export default function MatchupPage({ openPlayer }) {
  const [feed]  = useState(LIVE_FEED);
  const [me,  setMe]  = useState(MATCHUP.me);
  const [opp, setOpp] = useState(MATCHUP.opp);
  const [flash, setFlash] = useState(null);

  // Auto-tick score deltas
  useEffect(() => {
    const id = setInterval(() => {
      const meBump  = +(Math.random() * 1.6).toFixed(1);
      const oppBump = +(Math.random() * 1.4).toFixed(1);
      setMe((m) => ({ ...m, score: +(m.score + meBump).toFixed(1) }));
      setOpp((o) => ({ ...o, score: +(o.score + oppBump).toFixed(1) }));
      setFlash({ side: meBump > oppBump ? "me" : "opp", t: Date.now() });
    }, 5200);
    return () => clearInterval(id);
  }, []);

  const meRoster = MY_ROSTER.filter((r) => r.pid).map((r) => ({
    ...PLAYERS.find((p) => p.id === r.pid), slot: r.slot,
  }));
  const oppIds = ["betts","acuna","altuve","tatis","henderson","yelich","guerrero","swanson","skubal","burnes","clase","diaz","deGrom"];
  const oppRoster = oppIds.map((id) => PLAYERS.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="page col gap-16">
      {/* Live scoreboard */}
      <div className="card" style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 300px at 0% 0%, var(--accent-soft), transparent 60%), radial-gradient(800px 300px at 100% 100%, rgba(78,161,255,.08), transparent 60%)", pointerEvents: "none" }} />
        <div className="card-pad row gap-20" style={{ position: "relative" }}>
          <div className="col gap-10" style={{ flex: 1 }}>
            <div className="row gap-10">
              <div className="avatar" style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,var(--accent),#ff9f43)", fontSize: 14 }}>TR</div>
              <div className="col" style={{ gap: 2 }}>
                <div className="row gap-8"><div style={{ fontWeight: 700, fontSize: 18 }}>Triple Plays</div><span className="tag flat">YOU</span></div>
                <div className="mono muted" style={{ fontSize: 11 }}>11–6 · Optimal {fmt(me.optimal)} · Bench gap {fmt(me.optimal - me.score, 1)}</div>
              </div>
            </div>
            <div className="row gap-12" style={{ alignItems: "baseline" }}>
              <div className={`score-big up ${flash?.side === "me" ? "delta-pop" : ""}`}>{fmt(me.score)}</div>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>/ proj {fmt(me.projected)}</div>
            </div>
            <div className="row gap-10" style={{ fontSize: 12 }}>
              <span className="pill"><span className="dot live" /> {me.playing} playing</span>
              <span className="pill mono">{me.yetToPlay} to play</span>
              <span className="pill mono">{me.finished} done</span>
            </div>
          </div>

          <div className="col gap-6" style={{ alignItems: "center", minWidth: 160 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: ".12em", color: "var(--ink-2)" }}>WIN PROBABILITY</div>
            <Donut value={me.score / (me.score + opp.score)} size={92} sw={10} />
            <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{Math.round(me.score / (me.score + opp.score) * 100)}%</div>
            <div className="mono muted" style={{ fontSize: 11 }}>Lead +{fmt(me.score - opp.score, 1)}</div>
          </div>

          <div className="col gap-10" style={{ flex: 1, alignItems: "flex-end" }}>
            <div className="row gap-10">
              <div className="col" style={{ gap: 2, textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>Bunt Force One</div>
                <div className="mono muted" style={{ fontSize: 11 }}>9–8 · Theo W. · Optimal {fmt(opp.optimal)}</div>
              </div>
              <div className="avatar" style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#4ea1ff,#7a5ae0)", color: "white", fontSize: 14 }}>BF</div>
            </div>
            <div className="row gap-12" style={{ alignItems: "baseline", justifyContent: "flex-end" }}>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>proj {fmt(opp.projected)} /</div>
              <div className={`score-big ${flash?.side === "opp" ? "delta-pop" : ""}`}>{fmt(opp.score)}</div>
            </div>
            <div className="row gap-10" style={{ fontSize: 12, justifyContent: "flex-end" }}>
              <span className="pill"><span className="dot live" /> {opp.playing} playing</span>
              <span className="pill mono">{opp.yetToPlay} to play</span>
              <span className="pill mono">{opp.finished} done</span>
            </div>
          </div>
        </div>

        {/* Win-prob timeline */}
        <div style={{ height: 60, borderTop: "1px solid var(--line)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div className="mono" style={{ fontSize: 10, color: "var(--ink-2)", letterSpacing: ".1em" }}>WIN PROB · 7 DAYS</div>
          <svg width="100%" height="40" viewBox="0 0 600 40" preserveAspectRatio="none" style={{ flex: 1 }}>
            <path d="M0 30 C 60 26, 100 18, 160 22 S 280 8, 360 12 S 480 18, 540 14 L 600 12" fill="none" stroke="var(--accent)" strokeWidth="2" />
            <path d="M0 30 C 60 26, 100 18, 160 22 S 280 8, 360 12 S 480 18, 540 14 L 600 12 L 600 40 L 0 40 Z" fill="var(--accent)" opacity=".10" />
            <line x1="514" y1="0" x2="514" y2="40" stroke="var(--ink-3)" strokeDasharray="2 3" />
            <text x="518" y="12" fill="var(--ink-2)" fontSize="9" fontFamily="var(--font-mono)">NOW</text>
          </svg>
        </div>
      </div>

      {/* Rosters + feed */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", gap: 16 }}>
        <RosterColumn title="Your lineup" roster={meRoster} mine onClick={openPlayer} />
        <RosterColumn title="Opponent lineup" roster={oppRoster} onClick={openPlayer} />

        <div className="card" style={{ display: "flex", flexDirection: "column", maxHeight: 760 }}>
          <div className="card-h">
            <h3>Play-by-play</h3>
            <span className="meta"><span className="dot live" /> auto</span>
          </div>
          <div className="col gap-8" style={{ padding: "12px 14px", overflow: "auto" }}>
            {feed.map((f, i) => {
              const cls = f.kind === "hr" || f.kind === "hit" ? "flash-pos" : f.kind === "out" || f.kind === "k" ? "flash-neg" : "";
              return (
                <div key={i} className={`tick ${cls}`}>
                  <span className="ts mono">{f.ts}</span>
                  <TeamMark abbr={f.team} size={20} radius={4} />
                  <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.35 }}>{f.text}</div>
                  <span className={`tag ${f.impact.startsWith("+") ? "pos" : "neg"}`}>{f.impact}</span>
                </div>
              );
            })}
            <div className="muted mono" style={{ fontSize: 10.5, textAlign: "center", padding: "6px" }}>— top of feed —</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RosterColumn({ title, roster, mine, onClick }) {
  const total = roster.reduce((a, p) => a + (p?.today || 0), 0);
  return (
    <div className="card">
      <div className="card-h">
        <h3>{title}</h3>
        <span className="meta">Today&apos;s points</span>
        <span className="spacer" />
        <span className="tnum" style={{ fontWeight: 700 }}>{fmt(total)}</span>
      </div>
      <div style={{ padding: "4px 4px 8px" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 42, paddingLeft: 14 }}>Slot</th>
              <th>Player</th>
              <th className="num">Proj</th>
              <th className="num">Now</th>
              <th style={{ width: 90 }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((p, i) => p && (
              <tr key={i} onClick={() => onClick && onClick(p.id)} style={{ cursor: "pointer" }}>
                <td className="mono dim" style={{ paddingLeft: 14 }}>{p.slot || p.pos}</td>
                <td><PlayerChip p={p} /></td>
                <td className="num muted">{fmt(p.proj)}</td>
                <td className="num"><b className={p.today > p.proj ? "up" : ""}>{fmt(p.today)}</b></td>
                <td><Sparkline data={p.trend} w={80} h={20} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
