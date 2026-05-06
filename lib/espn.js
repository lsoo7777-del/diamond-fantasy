/**
 * ESPN Fantasy Baseball API client.
 *
 * ESPN has no public API. We use their private v3 API with session cookies
 * (SWID + espn_s2) that the user pastes from their browser.
 *
 * Base: https://fantasy.espn.com/apis/v3/games/flb/seasons/{year}/segments/0/leagues/{leagueId}
 *
 * All functions here run SERVER-SIDE only (called from Next.js API routes).
 */

const ESPN_BASE = "https://lm-api-reads.fantasy.espn.com/apis/v3/games/flb";

/**
 * Core fetch wrapper — attaches ESPN session cookies and common headers.
 * @param {string} path   - e.g. "/seasons/2026/segments/0/leagues/12345"
 * @param {string} swid   - ESPN SWID cookie value  (e.g. "{ABCD-...}")
 * @param {string} s2     - ESPN espn_s2 cookie value (long string)
 * @param {string[]} views - ESPN ?view= params  (e.g. ["mTeam","mRoster"])
 */
export async function espnFetch(path, swid, s2, views = []) {
  const viewQS = views.map((v) => `view=${v}`).join("&");
  const url = `${ESPN_BASE}${path}${viewQS ? "?" + viewQS : ""}`;

  const res = await fetch(url, {
    headers: {
      Cookie: `SWID=${swid}; espn_s2=${s2}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "application/json",
      "X-Fantasy-Source": "kona",
      "X-Fantasy-Platform": "kona-PROD-m.2023.09.22.4-RC1",
    },
    next: { revalidate: 30 }, // cache 30s in production
  });

  if (!res.ok) {
    throw new ESPNError(res.status, await res.text());
  }
  return res.json();
}

export class ESPNError extends Error {
  constructor(status, body) {
    super(`ESPN API error ${status}`);
    this.status = status;
    this.body = body;
  }
}

/** Build the league path for a given leagueId + season */
export const leaguePath = (leagueId, year = new Date().getFullYear()) =>
  `/seasons/${year}/segments/0/leagues/${leagueId}`;

// ─────────────────────────────────────────────
// High-level helpers used by the route handlers
// ─────────────────────────────────────────────

/**
 * Fetch basic league info + settings.
 */
export async function getLeague({ leagueId, year, swid, s2 }) {
  return espnFetch(leaguePath(leagueId, year), swid, s2, [
    "mSettings",
    "mTeam",
    "mStatus",
  ]);
}

/**
 * Fetch all team rosters.
 */
export async function getRosters({ leagueId, year, swid, s2 }) {
  return espnFetch(leaguePath(leagueId, year), swid, s2, [
    "mRoster",
    "mTeam",
  ]);
}

/**
 * Fetch the current scoring period matchups (scoreboard).
 */
export async function getMatchup({ leagueId, year, scoringPeriodId, swid, s2 }) {
  const base = leaguePath(leagueId, year);
  const sp = scoringPeriodId ? `&scoringPeriodId=${scoringPeriodId}` : "";
  const views = ["mMatchupScore", "mScoreboard", "mRoster"];
  const viewQS = views.map((v) => `view=${v}`).join("&");
  const url = `${ESPN_BASE}${base}?${viewQS}${sp}`;

  const res = await fetch(url, {
    headers: {
      Cookie: `SWID=${swid}; espn_s2=${s2}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "application/json",
    },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new ESPNError(res.status, await res.text());
  return res.json();
}

/**
 * Fetch standings.
 */
export async function getStandings({ leagueId, year, swid, s2 }) {
  return espnFetch(leaguePath(leagueId, year), swid, s2, [
    "mStandings",
    "mTeam",
  ]);
}

/**
 * Fetch free agents / waiver wire.
 * ESPN uses a special kona endpoint for player search.
 */
export async function getFreeAgents({ leagueId, year, scoringPeriodId, swid, s2 }) {
  const sp = scoringPeriodId || 1;
  const filters = JSON.stringify({
    players: {
      filterStatus: { value: ["FREEAGENT", "WAIVERS"] },
      filterSlotIds: { value: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19] },
      limit: 50,
      sortPercOwned: { sortPriority: 1, sortAsc: false },
      filterRanksForScoringPeriodIds: { value: [sp] },
    },
  });

  const url = `${ESPN_BASE}${leaguePath(leagueId, year)}?view=kona_player_info&scoringPeriodId=${sp}`;
  const res = await fetch(url, {
    headers: {
      Cookie: `SWID=${swid}; espn_s2=${s2}`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "application/json",
      "x-fantasy-filter": filters,
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new ESPNError(res.status, await res.text());
  return res.json();
}

// ─────────────────────────────────────────────
// ESPN response transformers
// ─────────────────────────────────────────────

/**
 * Transform ESPN's raw matchup data into a flat object the UI expects.
 * Returns null if the user's team can't be found.
 */
export function transformMatchup(espnData, myTeamId) {
  const schedule = espnData?.schedule || [];
  const matchup = schedule.find(
    (m) => m.home?.teamId === myTeamId || m.away?.teamId === myTeamId
  );
  if (!matchup) return null;

  const mine = matchup.home?.teamId === myTeamId ? matchup.home : matchup.away;
  const opp  = matchup.home?.teamId === myTeamId ? matchup.away : matchup.home;

  return {
    me: {
      teamId:    mine.teamId,
      score:     mine.totalPoints ?? 0,
      projected: mine.totalProjectedPointsLive ?? mine.totalPoints ?? 0,
      playing:   0,
      yetToPlay: 0,
      finished:  0,
      optimal:   mine.totalPoints ?? 0,
    },
    opp: {
      teamId:    opp.teamId,
      score:     opp.totalPoints ?? 0,
      projected: opp.totalProjectedPointsLive ?? opp.totalPoints ?? 0,
      playing:   0,
      yetToPlay: 0,
      finished:  0,
      optimal:   opp.totalPoints ?? 0,
    },
  };
}

/**
 * Transform ESPN standings into the shape the UI expects.
 */
export function transformStandings(espnData) {
  const teams = espnData?.teams || [];
  return teams
    .map((t) => ({
      rank:   t.playoffSeed ?? t.rankCalculatedFinal ?? 0,
      abbr:   (t.abbrev || "???").toUpperCase(),
      name:   t.name || t.location + " " + t.nickname,
      w:      t.record?.overall?.wins ?? 0,
      l:      t.record?.overall?.losses ?? 0,
      pf:     t.record?.overall?.pointsFor ?? 0,
      pa:     t.record?.overall?.pointsAgainst ?? 0,
      streak: "",
      owner:  t.primaryOwner || "",
    }))
    .sort((a, b) => a.rank - b.rank);
}
