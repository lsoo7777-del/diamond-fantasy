"use client";

import { MY_ROSTER, MY_BENCH, PLAYERS } from "@/lib/data";
import { fmt, fmt0, Icons, PlayerChip } from "./atoms";

// ESPN slot ID → label
const SLOT_LABEL = {
  0:"C", 1:"1B", 2:"2B", 3:"3B", 4:"SS",
  5:"OF", 6:"OF", 7:"OF", 8:"UTIL", 12:"UTIL",
  13:"SP", 14:"SP", 15:"SP", 16:"SP", 17:"SP",
  18:"RP", 19:"RP", 20:"BE", 21:"IL",
};
// ESPN defaultPositionId → abbrev
const POS_LABEL = {
  1:"C", 2:"1B", 3:"2B", 4:"3B", 5:"SS", 7:"OF", 8:"DH", 9:"SP", 11:"RP",
};

function espnEntryToPlayer(entry) {
  const pp     = entry?.playerPoolEntry;
  const player = pp?.player;
  return {
    id:     player?.id ?? entry?.playerId ?? Math.random(),
    name:   player?.fullName || "Unknown Player",
    pos:    POS_LABEL[player?.defaultPositionId] || "?",
    slot:   SLOT_LABEL[entry?.lineupSlotId] || "?",
    slotId: entry?.lineupSlotId ?? 20,
    status: player?.injuryStatus === "ACTIVE" || !player?.injuryStatus ? "active"
          : player?.injuryStatus === "INJURY_RESERVE" ? "il" : "dtd",
    team:   player?.proTeamId ? String(player.proTeamId) : "?",
    proj:   0,
    today:  pp?.appliedStatTotal ?? 0,
    season: 0,
    trend:  [],
    own:    Math.round((pp?.percentOwned || 0)),
  };
}

export default function TeamPage({ openPlayer, espnData }) {
  const myTeamName = espnData?.myTeam
    ? `${espnData.myTeam.location || ""} ${espnData.myTeam.nickname || ""}`.trim()
    : "My Team";

  // Use real roster if available
  const useReal = !!(espnData?.roster?.length);
  let starters = [], bench = [], ilSlots = [];

  if (useReal) {
    const entries = espnData.roster;
    const sorted  = [...entries].sort((a, b) => (a.lineupSlotId ?? 99) - (b.lineupSlotId ?? 99));
    starters = sorted.filter((e) => e.lineupSlotId !== 20 && e.lineupSlotId !== 21).map(espnEntryToPlayer);
    bench    = sorted.filter((e) => e.lineupSlotId === 20).map(espnEntryToPlayer);
    ilSlots  = sorted.filter((e) => e.lineupSlotId === 21).map(espnEntryToPlayer);
  } else {
    // Fall back to mock data
    starters = MY_ROSTER.map((r) => {
      const p = r.pid ? PLAYERS.find((p) => p.id === r.pid) : null;
      return p ? { ...p, slot: r.slot, slotId: 0 } : null;
    }).filter(Boolean);
    bench = MY_BENCH.map((id) => PLAYERS.find((p) => p.id === id)).filter(Boolean);
  }

  const projTotal  = starters.reduce((a, p) => a + (p?.proj  || 0), 0);
  const todayTotal = starters.reduce((a, p) => a + (p?.today || 0), 0);

  return (
    <div className="page col gap-16">
      <div className="row gap-16" style={{ alignItems: "flex-end" }}>
        <div className="col gap-6">
          <div className="eyebrow">My Team · {myTeamName}</div>
          <h1 className="h1">Lineup</h1>
          <div className="sub">Roster from ESPN · 2025 season.</div>
        </div>
        <div className="spacer" />
        <div className="row gap-8">
          {projTotal > 0  && <span className="pill mono">PROJ {fmt(projTotal, 1)}</span>}
          {todayTotal > 0 && <span className="pill mono">TODAY {fmt(todayTotal, 1)}</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="card-h">
            <h3>Starting lineup</h3>
            <span className="meta">{starters.length} slots</span>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 60, paddingLeft: 14 }}>Slot</th>
                <th>Player</th>
                <th>Status</th>
                <th className="num">Pos</th>
                <th className="num">Today</th>
              </tr>
            </thead>
            <tbody>
              {starters.map((p, i) => (
                <tr key={i} onClick={() => p && openPlayer(p.id)} style={{ cursor: p ? "pointer" : "default" }}>
                  <td className="mono" style={{ paddingLeft: 14 }}>
                    <span style={{ padding: "2px 6px", borderRadius: 4, background: "var(--bg-3)", fontSize: 10.5 }}>{p?.slot || "?"}</span>
                  </td>
                  <td>
                    {p
                      ? <PlayerChip p={p} />
                      : <span className="muted" style={{ fontStyle: "italic" }}>Empty slot</span>}
                  </td>
                  <td>
                    {p?.status === "il"  ? <span className="tag warn">IL</span>
                    : p?.status === "dtd" ? <span className="tag warn">DTD</span>
                    : p                   ? <span className="tag pos">Active</span>
                    : <span className="tag flat">—</span>}
                  </td>
                  <td className="num mono" style={{ fontSize: 11.5 }}>{p?.pos || "—"}</td>
                  <td className="num"><b className={p?.today > 0 ? "up" : ""}>{p ? fmt(p.today) : "—"}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col gap-16">
          <div className="card">
            <div className="card-h"><h3>Bench</h3><span className="meta">{bench.length}</span></div>
            <table className="tbl">
              <tbody>
                {bench.map((p, i) => (
                  <tr key={i} onClick={() => openPlayer(p.id)} style={{ cursor: "pointer" }}>
                    <td style={{ paddingLeft: 14 }}><PlayerChip p={p} /></td>
                    <td className="num mono" style={{ fontSize: 11 }}>{p.pos}</td>
                    <td className="num">{fmt(p.today)}</td>
                  </tr>
                ))}
                {ilSlots.map((p, i) => (
                  <tr key={"il-" + i} onClick={() => openPlayer(p.id)} style={{ cursor: "pointer", opacity: 0.6 }}>
                    <td style={{ paddingLeft: 14 }}><PlayerChip p={p} /></td>
                    <td><span className="tag warn">IL</span></td>
                    <td className="num">{fmt(p.today)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
