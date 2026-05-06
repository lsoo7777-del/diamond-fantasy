"use client";

import { MY_ROSTER, MY_BENCH, PLAYERS } from "@/lib/data";
import { fmt, fmt0, Icons, PlayerChip } from "./atoms";

export default function TeamPage({ openPlayer }) {
  const lineup = MY_ROSTER.map((r) => ({
    slot: r.slot,
    p: r.pid ? PLAYERS.find((p) => p.id === r.pid) : null,
    empty: !!r.empty,
  }));
  const bench = MY_BENCH.map((id) => PLAYERS.find((p) => p.id === id));
  const projTotal  = lineup.reduce((a, r) => a + (r.p?.proj  || 0), 0);
  const todayTotal = lineup.reduce((a, r) => a + (r.p?.today || 0), 0);

  const oppAbbrs = ["BOS","SDP","ARI","CHC","TOR","SEA","NYY","LAD","ATL","HOU","PHI","SDP","BAL","TOR","BOS"];

  return (
    <div className="page col gap-16">
      <div className="row gap-16" style={{ alignItems: "flex-end" }}>
        <div className="col gap-6">
          <div className="eyebrow">My Team · Triple Plays</div>
          <h1 className="h1">Lineup</h1>
          <div className="sub">Set lineups for tomorrow&apos;s games. Locks at first pitch per player.</div>
        </div>
        <div className="spacer" />
        <div className="row gap-8">
          <span className="pill mono">PROJ {fmt(projTotal, 1)}</span>
          <span className="pill mono">TODAY {fmt(todayTotal, 1)}</span>
          <span className="pill" style={{ background: "var(--accent-soft)", color: "var(--accent)", borderColor: "transparent" }}><Icons.bolt /> Optimize +6.4</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-h">
            <h3>Starting lineup</h3>
            <span className="meta">15 slots · 1 empty</span>
            <span className="spacer" />
            <button className="btn sm">Reset</button>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 60, paddingLeft: 14 }}>Slot</th>
                <th>Player</th>
                <th>Status</th>
                <th>Opponent</th>
                <th className="num">Proj</th>
                <th className="num">Today</th>
                <th className="num">Season</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {lineup.map((r, i) => (
                <tr key={i} onClick={() => r.p && openPlayer(r.p.id)} style={{ cursor: r.p ? "pointer" : "default" }}>
                  <td className="mono" style={{ paddingLeft: 14 }}>
                    <span className="pos" style={{ padding: "2px 6px", borderRadius: 4, background: "var(--bg-3)", fontSize: 10.5 }}>{r.slot}</span>
                  </td>
                  <td>{r.p ? <PlayerChip p={r.p} /> : <span className="muted" style={{ fontStyle: "italic" }}>Empty slot · add player</span>}</td>
                  <td>
                    {r.p?.status === "il"  ? <span className="tag warn">IL-10</span>
                    : r.p?.status === "dtd" ? <span className="tag warn">DTD</span>
                    : r.p               ? <span className="tag pos">Active</span>
                    : <span className="tag flat">—</span>}
                  </td>
                  <td className="muted mono" style={{ fontSize: 11.5 }}>{r.p ? `vs ${oppAbbrs[i % oppAbbrs.length]}` : "—"}</td>
                  <td className="num muted">{r.p ? fmt(r.p.proj) : "—"}</td>
                  <td className="num"><b className={r.p && r.p.today > r.p.proj ? "up" : ""}>{r.p ? fmt(r.p.today) : "—"}</b></td>
                  <td className="num muted">{r.p ? fmt0(r.p.season) : "—"}</td>
                  <td><button className="btn ghost sm" onClick={(e) => e.stopPropagation()}><Icons.swap /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col gap-16">
          <div className="card">
            <div className="card-h"><h3>Bench</h3><span className="meta">{bench.length}/5</span></div>
            <table className="tbl">
              <tbody>
                {bench.map((p) => (
                  <tr key={p.id} onClick={() => openPlayer(p.id)} style={{ cursor: "pointer" }}>
                    <td style={{ paddingLeft: 14 }}><PlayerChip p={p} /></td>
                    <td className="num">{fmt(p.proj)}</td>
                    <td><button className="btn ghost sm" onClick={(e) => e.stopPropagation()}><Icons.arrow /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-h"><h3>Optimizer</h3><span className="meta">+6.4 proj</span></div>
            <div className="card-pad col gap-10">
              <div className="tick" style={{ background: "rgba(43,212,125,.06)", borderColor: "rgba(43,212,125,.25)" }}>
                <Icons.bolt />
                <div className="col" style={{ flex: 1 }}>
                  <div><b>Move Betts → UTIL</b>, bench Ohtani (rest day).</div>
                  <div className="muted" style={{ fontSize: 11 }}>+6.4 proj · LAD vs SDP RHP</div>
                </div>
                <button className="btn sm primary">Apply</button>
              </div>
              <div className="tick">
                <span className="tag warn">IL</span>
                <div className="col" style={{ flex: 1 }}>
                  <div>Drop <b>Acuña</b> for <b>H. Ramos</b>.</div>
                  <div className="muted" style={{ fontSize: 11 }}>+18.0 next 14d</div>
                </div>
                <button className="btn sm">Review</button>
              </div>
              <div className="tick">
                <Icons.fire />
                <div className="col" style={{ flex: 1 }}>
                  <div>Stream <b>R. Olson (DET)</b> in P slot.</div>
                  <div className="muted" style={{ fontSize: 11 }}>2-start week · +12.0</div>
                </div>
                <button className="btn sm">Stream</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
