"use client";

import { useState, useEffect } from "react";
import { Sidebar, Topbar } from "./shell";
import HomePage from "./page-home";
import MatchupPage from "./page-matchup";
import TeamPage from "./page-team";
import {
  PlayerDetail,
  WaiversPage,
  StandingsPage,
  PlayersPage,
  WatchlistPage,
  AlertsPage,
} from "./page-other";
import IntegrationsPage, {
  ConnectESPNModal,
  SyncStatusPopover,
  ActivityLogPage,
  ConflictBanner,
} from "./page-integrations";

const ACCENT_PRESETS = {
  "#f5d547": { ink: "#0a0d12" },
  "#2bd47d": { ink: "#062013" },
  "#4ea1ff": { ink: "#06121f" },
  "#ff5b6a": { ink: "#1d0507" },
  "#7a5ae0": { ink: "#100626" },
};

export default function App() {
  const [route,       setRoute]       = useState("home");
  const [openId,      setOpenId]      = useState(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [syncPop,     setSyncPop]     = useState(false);
  const [conflict,    setConflict]    = useState(null);
  const [theme,       setTheme]       = useState("dark");
  const [accent,      setAccent]      = useState("#f5d547");
  const [density,     setDensity]     = useState("regular");

  const [leagues, setLeagues] = useState([
    {
      id: "espn-1", platform: "ESPN", name: "Diamond Cartel", year: new Date().getFullYear(),
      size: 12, scoring: "Points", status: "disconnected",
      lastSync: "—", mode: "—", method: "—", conflicts: "0",
    },
  ]);
  const [activeLeague, setActiveLeague] = useState("espn-1");

  // Real ESPN data
  const [espnData,    setEspnData]    = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  const sync = {
    status: leagues.find((l) => l.id === activeLeague)?.status === "connected" ? "ok" : "disconnected",
    lastAgo: leagues.find((l) => l.id === activeLeague)?.lastSync || "—",
  };

  // Apply theme / accent / density to <html>
  useEffect(() => {
    document.documentElement.dataset.theme   = theme;
    document.documentElement.dataset.density = density;
    const ink = (ACCENT_PRESETS[accent] || {}).ink || "#0a0d12";
    document.documentElement.style.setProperty("--accent",      accent);
    document.documentElement.style.setProperty("--accent-ink",  ink);
    document.documentElement.style.setProperty("--accent-soft", `color-mix(in oklab, ${accent} 18%, transparent)`);
  }, [theme, accent, density]);

  // Check ESPN connection on mount, then load data
  useEffect(() => {
    fetch("/api/espn/auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.connected) {
          setLeagues((prev) =>
            prev.map((l) =>
              l.id === "espn-1"
                ? { ...l, status: "connected", lastSync: "just now" }
                : l
            )
          );
          loadESPNData(data.swidClean);
        }
      })
      .catch(() => {});
  }, []);

  async function loadESPNData(swidClean) {
    setDataLoading(true);
    try {
      const [leagueRes, standingsRes] = await Promise.all([
        fetch("/api/espn/league"),
        fetch("/api/espn/standings"),
      ]);

      const league    = leagueRes.ok    ? await leagueRes.json()    : null;
      const stData    = standingsRes.ok ? await standingsRes.json() : null;
      const standings = stData?.standings || [];

      // Update league name in sidebar
      if (league?.settings?.name) {
        setLeagues((prev) =>
          prev.map((l) =>
            l.id === "espn-1" ? { ...l, name: league.settings.name } : l
          )
        );
      }

      // Find user's team by matching SWID (ESPN stores primaryOwner with braces e.g. "{GUID}")
      const myTeam = swidClean
        ? league?.teams?.find((t) =>
            (t.primaryOwner || "").replace(/[{}]/g, "").toLowerCase() === swidClean
          )
        : null;
      const myTeamId = myTeam?.id;

      // Fetch matchup for current period — store the transformed { me, opp } object directly
      let matchup = null;
      if (myTeamId && league?.scoringPeriodId) {
        const mRes = await fetch(
          `/api/espn/matchup?scoringPeriodId=${league.scoringPeriodId}&teamId=${myTeamId}`
        );
        if (mRes.ok) {
          const mData = await mRes.json();
          matchup = mData.matchup ?? null; // { me: {...}, opp: {...} }
        }
      }

      // Fetch roster
      let roster = null;
      if (myTeamId) {
        const rRes = await fetch("/api/espn/roster");
        if (rRes.ok) {
          const raw = await rRes.json();
          const myRaw = raw?.teams?.find((t) => t.id === myTeamId);
          roster = myRaw?.roster?.entries || null;
        }
      }

      setEspnData({ league, standings, matchup, roster, myTeam, myTeamId });
    } catch (e) {
      console.error("Failed to load ESPN data:", e);
    }
    setDataLoading(false);
  }

  // ⌘K
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setRoute("players");
      } else if (e.key === "Escape") {
        setOpenId(null);
        setConnectOpen(false);
        setSyncPop(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleConnected = () => {
    setLeagues((prev) =>
      prev.map((l) =>
        l.id === "espn-1"
          ? { ...l, status: "connected", lastSync: "just now", method: "Cookies" }
          : l
      )
    );
    setConnectOpen(false);
    fetch("/api/espn/auth")
      .then((r) => r.json())
      .then((d) => { if (d.connected) loadESPNData(d.swidClean); })
      .catch(() => {});
  };

  let page;
  if (route === "home")           page = <HomePage go={setRoute} openPlayer={setOpenId} espnData={espnData} loading={dataLoading} />;
  else if (route === "matchup")   page = <MatchupPage openPlayer={setOpenId} espnData={espnData} />;
  else if (route === "team")      page = <TeamPage openPlayer={setOpenId} espnData={espnData} />;
  else if (route === "waivers")   page = <WaiversPage openPlayer={setOpenId} espnData={espnData} />;
  else if (route === "standings") page = <StandingsPage espnData={espnData} loading={dataLoading} />;
  else if (route === "players")   page = <PlayersPage openPlayer={setOpenId} />;
  else if (route === "watchlist") page = <WatchlistPage openPlayer={setOpenId} />;
  else if (route === "alerts")    page = <AlertsPage />;
  else if (route === "integrations") page = <IntegrationsPage leagues={leagues} openConnect={() => setConnectOpen(true)} />;
  else if (route === "activity")  page = <ActivityLogPage />;
  else page = <HomePage go={setRoute} openPlayer={setOpenId} espnData={espnData} loading={dataLoading} />;

  return (
    <div className="app">
      <Sidebar
        route={route}
        go={setRoute}
        openCmd={() => setRoute("players")}
        sync={sync}
        leagues={leagues}
        activeLeague={activeLeague}
        switchLeague={setActiveLeague}
      />

      <Topbar
        route={route}
        sync={sync}
        onSyncClick={() => setSyncPop((p) => !p)}
      />

      <main className="main">
        <ConflictBanner conflict={conflict} onResolve={() => setConflict(null)} />
        {page}
      </main>

      {openId && (
        <div className="slide-over" onClick={() => setOpenId(null)}>
          <div />
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <PlayerDetail pid={openId} onClose={() => setOpenId(null)} />
          </div>
        </div>
      )}

      {connectOpen && (
        <ConnectESPNModal
          onClose={() => setConnectOpen(false)}
          onConnected={handleConnected}
        />
      )}

      {syncPop && (
        <SyncStatusPopover
          league={leagues.find((l) => l.id === activeLeague)}
          onClose={() => setSyncPop(false)}
        />
      )}
    </div>
  );
}
