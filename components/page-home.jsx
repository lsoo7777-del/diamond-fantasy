"use client";

import { MATCHUP, MY_ROSTER, PLAYERS, STANDINGS, GAMES } from "@/lib/data";
import { fmt, Icons, PlayerChip, Sparkline, Donut, Diamond, TeamMark } from "./atoms";

export default function HomePage({ go, openPlayer, espnData, loading }) {
  // espnData.matchup is already the transformed { me, opp } object
  const matchupData = espnData?.matchup;
  const me  = matchupData?.me  || MATCHUP.me;
  const opp = matchupData?.opp || MATCHUP.opp;

  // Real team names from ESPN
  const myTeamName = espnData?.myTeam
    ? `${espnData.myTeam.location || ""} ${espnData.myTeam.nickname || ""}`.trim()
    : "My Team";
  const myTeamAbbr = espnData?.myTeam?.abbrev?.slice(0, 2) || "??";

  // Find opponent team from league teams
  const oppTeamRaw = matchupData?.opp?.teamId
    ? espnData?.league?.teams?.find((t) => t.id === matchupData.opp.teamId)
    : null;
  const oppTeamName = oppTeamRaw ? `${oppTeamRaw.location || ""} ${oppTeamRaw.nickname || ""}`.trim() : "Bunt Force One";
  const oppTeamAbbr = oppTeamRaw?.abbrev || "BF";

  // Real standings
  const standings = espnData?.standings?.length ? espnData.standings : STANDINGS;

  const lead = me.score - opp.score;
  const total = me.score + opp.score;
  const pct = total > 0 ? me.score / total : 0.5;

  const roster = MY_ROSTER.filter((r) => r.pid).map((r) => {
    const p = PLAYERS.find((p) => p.id === r.pid);
    return { ...p, slot: r.slot };
  });
  const topToday = [...roster].sort((a, b) => b.today - a.today).slice(0, 4);

  return (
    <div className="page col gap-20">
      <div className="row gap-16" style={{ alignItems: "flex-end" }}>
        <div className="col gap-6">
          <div className="eyebrow">Week 18 · Aug 11–17 · Day 4/7</div>
          <h1 className="h1">Good evening, Lorenzo.</h1>
          <div className="sub">You&apos;re up <span className="up tnum">+{fmt(lead, 1)}</span> against Bunt Force One. 8 of your players are on the field right now.</div>
        </div>
        <div className="spacer" />
        <button className="btn" onClick={() => go("team")}><Icons.team /> Set lineup</button>
        <button className="btn primary" onClick={() => go("matchup")}><Icons.live /> Watch live</button>
      </div>

      {/* Hero matchup */}
      <div className="card">
        <div className="card-h">
          <h3>This week&apos;s matchup</h3>
          <span className="pill" style={{ borderColor: "transparent", background: "var(--accent-soft)", color: "var(--accent)" }}><span className="dot live" /> LIVE · Day 4 of 7</span>
          <span className="meta">Win prob 71% · Optimal-points gap 2.0</span>
        </div>
        <div className="card-pad">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px 1fr", gap: 24, alignItems: "center" }}>
            {/* My team */}
            <div className="col gap-8">
              <div className="row gap-10">
                <div className="avatar" style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,var(--accent),#ff9f43)" }}>{myTeamAbbr.slice(0,2)}</div>
                <div className="col" style={{ gap: 2 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{myTeamName} <span className="tag flat" style={{ marginLeft: 6 }}>YOU</span></div>
                  <div className="mono muted" style={{ fontSize: 11 }}>{me.score > 0 ? `${fmt(me.score)} pts` : "—"}</div>
                </div>
              </div>
              <div className="score-big up">{fmt(me.score)}</div>
              <div className="row gap-12 mono" style={{ fontSize: 11.5, color: "var(--ink-2)" }}>
                <span>PROJ <b className="tnum" style={{ color: "var(--ink-0)" }}>{fmt(me.projected)}</b></span>
                <span>OPT <b className="tnum" style={{ color: "var(--ink-0)" }}>{fmt(me.optimal)}</b></span>
                <span>LEFT <b className="tnum" style={{ color: "var(--ink-0)" }}>{me.yetToPlay}</b></span>
              </div>
              <div className="bar"><i style={{ width: (pct * 100).toFixed(1) + "%" }} /></div>
            </div>

            {/* Center */}
            <div className="col gap-10" style={{ alignItems: "center" }}>
              <div className="mono" style={{ fontSize: 10, color: "var(--ink-2)", letterSpacing: ".12em" }}>LEAD</div>
              <div className="score-mid up">+{fmt(lead)}</div>
              <div style={{ display: "grid", placeItems: "center" }}>
                <Donut value={pct} size={64} sw={8} />
              </div>
              <div className="mono muted" style={{ fontSize: 11 }}>Top scorer · <b style={{ color: "var(--ink-0)" }}>Wheeler 26.4</b></div>
            </div>

            {/* Opponent */}
            <div className="col gap-8" style={{ textAlign: "right" }}>
              <div className="row gap-10" style={{ justifyContent: "flex-end" }}>
                <div className="col" style={{ gap: 2, textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{oppTeamName}</div>
                  <div className="mono muted" style={{ fontSize: 11 }}>{opp.score > 0 ? `${fmt(opp.score)} pts` : "—"}</div>
                </div>
                <div className="avatar" style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#4ea1ff,#7a5ae0)", color: "white" }}>{oppTeamAbbr.slice(0,2)}</div>
              </div>
              <div className="score-big">{fmt(opp.score)}</div>
              <div className="row gap-12 mono" style={{ fontSize: 11.5, color: "var(--ink-2)", justifyContent: "flex-end" }}>
                <span>PROJ <b className="tnum" style={{ color: "var(--ink-0)" }}>{fmt(opp.projected)}</b></span>
                <span>OPT <b className="tnum" style={{ color: "var(--ink-0)" }}>{fmt(opp.optimal)}</b></span>
                <span>LEFT <b className="tnum" style={{ color: "var(--ink-0)" }}>{opp.yetToPlay}</b></span>
              </div>
              <div className="bar"><i style={{ width: (100 - pct * 100).toFixed(1) + "%", background: "var(--ink-1)" }} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Three-up */}
      <div className="grid-3">
        <div className="card">
          <div className="card-h"><h3>Top scorers · today</h3><span className="meta">your roster</span></div>
          <div className="card-pad col gap-10">
            {topToday.map((p, i) => (
              <div key={p.id} className="row gap-10">
                <div className="mono dim" style={{ width: 14, textAlign: "right" }}>{i + 1}</div>
                <PlayerChip p={p} onClick={() => openPlayer(p.id)} />
                <div className="spacer" />
                <Sparkline data={p.trend} />
                <div className="tnum" style={{ fontWeight: 700, fontSize: 15, minWidth: 48, textAlign: "right" }}>{fmt(p.today)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>Roster alerts</h3><span className="meta">2 need attention</span></div>
          <div className="card-pad col gap-10">
            <div className="tick" style={{ borderColor: "rgba(255,159,67,.3)", background: "rgba(255,159,67,.06)" }}>
              <Icons.injury />
              <div className="col" style={{ flex: 1 }}>
                <div><b>Acuña Jr.</b> moved to IL-10 (knee).</div>
                <div className="muted" style={{ fontSize: 11 }}>Replace before tomorrow&apos;s first pitch · 3 OF available on waivers</div>
              </div>
              <button className="btn sm primary" onClick={() => go("waivers")}>Replace</button>
            </div>
            <div className="tick" style={{ borderColor: "rgba(255,91,106,.25)" }}>
              <span className="tag warn">DTD</span>
              <div className="col" style={{ flex: 1 }}>
                <div><b>Devers</b> day-to-day with shoulder soreness.</div>
                <div className="muted" style={{ fontSize: 11 }}>Probable for tomorrow per BOS beat reporter.</div>
              </div>
              <button className="btn sm">Bench</button>
            </div>
            <div className="tick">
              <Icons.bolt />
              <div className="col" style={{ flex: 1 }}>
                <div><b>Ohtani</b> not in lineup — manager rest day.</div>
                <div className="muted" style={{ fontSize: 11 }}>Optimal swap: <b>Betts</b> (UTIL) · +6.4 proj</div>
              </div>
              <button className="btn sm">Swap</button>
            </div>
            <div className="tick">
              <Icons.fire />
              <div className="col" style={{ flex: 1 }}>
                <div><b>Heliot Ramos</b> trending — 5 HR in 14 days.</div>
                <div className="muted" style={{ fontSize: 11 }}>Available · 54% rostered · projection +18 next 14d</div>
              </div>
              <button className="btn sm">Add</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h3>League pulse</h3><span className="meta">last 24h</span></div>
          <div className="card-pad col gap-10">
            <div className="row gap-10">
              <div className="col" style={{ gap: 2, flex: 1 }}>
                <div className="muted" style={{ fontSize: 11 }}>Top mover</div>
                <div style={{ fontWeight: 600 }}>Backdoor Sliders</div>
              </div>
              <div className="tag pos">+342 PF</div>
            </div>
            <div className="divider" />
            <div className="col gap-6">
              <div className="row gap-8 muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em" }}>
                <span>Standings</span><span className="spacer" /><span>W–L</span>
              </div>
              {standings.slice(0, 5).map((s) => (
                <div key={s.abbr} className="row gap-10" style={{ padding: "4px 0" }}>
                  <div className="mono dim" style={{ width: 14 }}>{s.rank}</div>
                  <TeamMark abbr={s.abbr} size={22} radius={5} />
                  <div style={{ fontWeight: s.you ? 700 : 500, fontSize: 13 }}>{s.name}</div>
                  {s.you && <span className="tag flat" style={{ marginLeft: 4 }}>YOU</span>}
                  <div className="spacer" />
                  <div className="tnum">{s.w}–{s.l}</div>
                </div>
              ))}
              <button className="btn sm ghost" style={{ alignSelf: "flex-start" }} onClick={() => go("standings")}>Full standings →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Around MLB */}
      <div className="card">
        <div className="card-h"><h3>Around MLB</h3><span className="meta">tonight&apos;s slate</span></div>
        <div className="card-pad" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {GAMES.map((g) => (
            <div key={g.id} className="row gap-10" style={{ padding: "10px 12px", background: "var(--bg-2)", borderRadius: 10, border: "1px solid var(--line)" }}>
              <div className="col gap-6" style={{ flex: 1 }}>
                <div className="row gap-8"><TeamMark abbr={g.away} size={22} radius={5} /><span style={{ fontWeight: 600 }}>{g.away}</span><span className="spacer" /><span className="tnum" style={{ fontWeight: 700 }}>{g.state === "upcoming" ? "" : g.awayR}</span></div>
                <div className="row gap-8"><TeamMark abbr={g.home} size={22} radius={5} /><span style={{ fontWeight: 600 }}>{g.home}</span><span className="spacer" /><span className="tnum" style={{ fontWeight: 700 }}>{g.state === "upcoming" ? "" : g.homeR}</span></div>
              </div>
              <div className="divider-v" />
              <div className="col" style={{ minWidth: 64, alignItems: "center" }}>
                {g.state === "live" ? (
                  <>
                    <span className="tag pos"><span className="dot live" /> {g.inning}</span>
                    <Diamond bases={g.bases} outs={g.outs} size={48} />
                    <span className="mono muted" style={{ fontSize: 10 }}>{g.count}</span>
                  </>
                ) : g.state === "final" ? (
                  <span className="tag flat">FINAL</span>
                ) : (
                  <>
                    <span className="mono muted" style={{ fontSize: 11 }}>{g.inning}</span>
                    <span className="mono dim" style={{ fontSize: 10, marginTop: 4 }}>{g.broadcast || ""}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
