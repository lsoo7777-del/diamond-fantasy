"use client";

import { useState, useEffect } from "react";
import { MATCHUP, MY_ROSTER, PLAYERS, LIVE_FEED } from "@/lib/data";
import { fmt, PlayerChip, Sparkline, Donut, TeamMark } from "./atoms";

// ESPN slot ID → label
const SLOT_LABEL = {
  0:"C",1:"1B",2:"2B",3:"3B",4:"SS",5:"OF",6:"OF",7:"OF",8:"UTIL",12:"UTIL",
  13:"SP",14:"SP",15:"SP",16:"SP",17:"SP",18:"RP",19:"RP",20:"BE",21:"IL",
};
const POS_LABEL = { 1:"C",2:"1B",3:"2B",4:"3B",5:"SS",7:"OF",8:"DH",9:"SP",11:"RP" };

function entryToPlayer(entry) {
  const pp = entry?.playerPoolEntry;
  const pl = pp?.player;
  return {
    id:    pl?.id ?? entry?.playerId ?? Math.random(),
    name:  pl?.fullName || "Unknown",
    pos:   POS_LABEL[pl?.defaultPositionId] || "?",
    slot:  SLOT_LABEL[entry?.lineupSlotId] || "?",
    today: pp?.appliedStatTotal ?? 0,
    proj:  0, trend: [],
    status: !pl?.injuryStatus || pl.injuryStatus === "ACTIVE" ? "active"
          : pl.injuryStatus === "INJURY_RESERVE" ? "il" : "dtd",
    team: String(pl?.proTeamId || ""),
  };
}

export default function MatchupPage({ openPlayer, espnData }) {
  const rawMatchup = espnData?.matchup;
  const [me,  setMe]  = useState(rawMatchup?.matchup?.me  || MATCHUP.me);
  const [opp, setOpp] = useState(rawMatchup?.matchup?.opp || MATCHUP.opp);
  const [flash, setFlash] = useState(null);

  // Sync when real data arrives
  useEffect(() => {
    if (rawMatchup?.matchup?.me)  setMe(rawMatchup.matchup.me);
    if (rawMatchup?.matchup?.opp) setOpp(rawMatchup.matchup.opp);
  }, [rawMatchup]);

  // Real team names
  const myTeamName  = espnData?.myTeam
    ? `${espnData.myTeam.location || ""} ${espnData.myTeam.nickname || ""}`.trim()
    : "Triple Plays";
  const myTeamAbbr  = espnData?.myTeam?.abbrev?.slice(0, 2) || "TR";
  const oppTeamRaw  = rawMatchup?.matchup?.opp?.teamId
    ? espnData?.league?.teams?.find((t) => t.id === rawMatchup.matchup.opp.teamId)
    : null;
  const oppTeamName = oppTeamRaw
    ? `${oppTeamRaw.location || ""} ${oppTeamRaw.nickname || ""}`.trim()
    : "Opponent";
  const oppTeamAbbr = oppTeamRaw?.abbrev?.slice(0, 2) || "OP";

  // Rosters
  const myRosterEntries = espnData?.roster || [];
  const myRoster = myRosterEntries
    .filter((e) => e.lineupSlotId !== 20 && e.lineupSlotId !== 21)
    .map(entryToPlayer);

  // Fallback mock roster if no real data
  const mockRoster = MY_ROSTER.filter((r) => r.pid).map((r) => ({
    ...PLAYERS.find((p) => p.id === r.pid), slot: r.slot,
  }));
  const displayRoster = myRoster.length ? myRoster : mockRoster;

  const total      = me.score + opp.score;
  const winPct     = total > 0 ? me.score / total : 0.5;
  const lead       = me.score - opp.score;

  return (
    <div className="page col gap-16">
      {/* Live scoreboard */}
      <div className="card" style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(800px 300px at 0% 0%, var(--accent-soft), transparent 60%), radial-gradient(800px 300px at 100% 100%, rgba(78,161,255,.08), transparent 60%)", pointerEvents: "none" }} />
        <div className="card-pad row gap-20" style={{ position: "relative" }}>
          {/* My team */}
          <div className="col gap-10" style={{ flex: 1 }}>
            <div className="row gap-10">
              <div className="avatar" style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,var(--accent),#ff9f43)", fontSize: 14 }}>{myTeamAbbr}</div>
              <div className="col" style={{ gap: 2 }}>
                <div className="row gap-8"><div style={{ fontWeight: 700, fontSize: 18 }}>{myTeamName}</div><span className="tag flat">YOU</span></div>
                <div className="mono muted" style={{ fontSize: 11 }}>2025 season</div>
              </div>
            </div>
            <div className="row gap-12" style={{ alignItems: "baseline" }}>
              <div className="score-big up">{fmt(me.score)}</div>
              {me.projected > 0 && <div className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>/ proj {fmt(me.projected)}</div>}
            </div>
            <div className="row gap-10" style={{ fontSize: 12 }}>
              <span className="pill mono">{me.playing ?? 0} playing</span>
              <span className="pill mono">{me.yetToPlay ?? 0} to play</span>
              <span className="pill mono">{me.finished ?? 0} done</span>
            </div>
          </div>

          {/* Center win prob */}
          <div className="col gap-6" style={{ alignItems: "center", minWidth: 160 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: ".12em", color: "var(--ink-2)" }}>WIN PROBABILITY</div>
            <Donut value={winPct} size={92} sw={10} />
            <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{Math.round(winPct * 100)}%</div>
            <div className="mono muted" style={{ fontSize: 11 }}>
              {lead >= 0 ? `Lead +${fmt(lead, 1)}` : `Behind ${fmt(lead, 1)}`}
            </div>
          </div>

          {/* Opponent */}
          <div className="col gap-10" style={{ flex: 1, alignItems: "flex-end" }}>
            <div className="row gap-10">
              <div className="col" style={{ gap: 2, textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{oppTeamName}</div>
                <div className="mono muted" style={{ fontSize: 11 }}>2025 season</div>
              </div>
              <div className="avatar" style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#4ea1ff,#7a5ae0)", color: "white", fontSize: 14 }}>{oppTeamAbbr}</div>
            </div>
            <div className="row gap-12" style={{ alignItems: "baseline", justifyContent: "flex-end" }}>
              {opp.projected > 0 && <div className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>proj {fmt(opp.projected)} /</div>}
              <div className="score-big">{fmt(opp.score)}</div>
            </div>
            <div className="row gap-10" style={{ fontSize: 12, justifyContent: "flex-end" }}>
              <span className="pill mono">{opp.playing ?? 0} playing</span>
              <span className="pill mono">{opp.yetToPlay ?? 0} to play</span>
              <span className="pill mono">{opp.finished ?? 0} done</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rosters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <RosterColumn title={`${myTeamName} — Your Lineup`} roster={displayRoster} onClick={openPlayer} />
        <div className="card card-pad col gap-10" style={{ alignItems: "center", justifyContent: "center", color: "var(--ink-2)", fontSize: 13 }}>
          <div>Opponent roster view coming soon.</div>
          <div className="muted mono" style={{ fontSize: 11 }}>Their score: <b style={{ color: "var(--ink-0)" }}>{fmt(opp.score)}</b></div>
        </div>
      </div>
    </div>
  );
}

function RosterColumn({ title, roster, onClick }) {
  const total = roster.reduce((a, p) => a + (p?.today || 0), 0);
  return (
    <div className="card">
      <div className="card-h">
        <h3>{title}</h3>
        <span className="spacer" />
        <span className="tnum" style={{ fontWeight: 700 }}>{fmt(total)} pts</span>
      </div>
      <div style={{ padding: "4px 4px 8px" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 42, paddingLeft: 14 }}>Slot</th>
              <th>Player</th>
              <th className="num">Pos</th>
              <th className="num">Today</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((p, i) => p && (
              <tr key={i} onClick={() => onClick && onClick(p.id)} style={{ cursor: "pointer" }}>
                <td className="mono dim" style={{ paddingLeft: 14 }}>{p.slot || p.pos}</td>
                <td><PlayerChip p={p} /></td>
                <td className="num mono" style={{ fontSize: 11 }}>{p.pos}</td>
                <td className="num"><b className={p.today > 0 ? "up" : ""}>{fmt(p.today)}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
