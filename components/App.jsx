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

  // Check ESPN connection on mount
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
        }
      })
      .catch(() => {});
  }, []);

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

  const handleConnected = (creds) => {
    setLeagues((prev) =>
      prev.map((l) =>
        l.id === "espn-1"
          ? { ...l, status: "connected", lastSync: "just now", method: "Cookies" }
          : l
      )
    );
    setConnectOpen(false);
  };

  let page;
  if (route === "home")         page = <HomePage go={setRoute} openPlayer={setOpenId} />;
  else if (route === "matchup") page = <MatchupPage openPlayer={setOpenId} />;
  else if (route === "team")    page = <TeamPage openPlayer={setOpenId} />;
  else if (route === "waivers") page = <WaiversPage openPlayer={setOpenId} />;
  else if (route === "standings") page = <StandingsPage />;
  else if (route === "players") page = <PlayersPage openPlayer={setOpenId} />;
  else if (route === "watchlist") page = <WatchlistPage openPlayer={setOpenId} />;
  else if (route === "alerts")  page = <AlertsPage />;
  else if (route === "integrations") page = <IntegrationsPage leagues={leagues} openConnect={() => setConnectOpen(true)} />;
  else if (route === "activity") page = <ActivityLogPage />;
  else page = <HomePage go={setRoute} openPlayer={setOpenId} />;

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
        {/* ESPN conflict banner */}
        <ConflictBanner conflict={conflict} onResolve={() => setConflict(null)} />

        {page}
      </main>

      {/* Player detail slide-over */}
      {openId && (
        <div className="slide-over" onClick={() => setOpenId(null)}>
          <div />
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <PlayerDetail pid={openId} onClose={() => setOpenId(null)} />
          </div>
        </div>
      )}

      {/* Connect ESPN modal */}
      {connectOpen && (
        <ConnectESPNModal
          onClose={() => setConnectOpen(false)}
          onConnected={handleConnected}
        />
      )}

      {/* Sync status popover */}
      {syncPop && (
        <SyncStatusPopover
          league={leagues.find((l) => l.id === activeLeague)}
          onClose={() => setSyncPop(false)}
        />
      )}
    </div>
  );
}
