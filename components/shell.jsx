"use client";

import { useState } from "react";
import { Icons } from "./atoms";

export function Sidebar({ route, go, openCmd, sync, leagues, activeLeague, switchLeague }) {
  const items = [
    { id: "home",      label: "Home",         icon: "home" },
    { id: "matchup",   label: "Live Matchup", icon: "live", live: true },
    { id: "team",      label: "My Team",      icon: "team" },
    { id: "players",   label: "Players",      icon: "player" },
    { id: "waivers",   label: "Waivers",      icon: "waivers", badge: "3" },
    { id: "standings", label: "Standings",    icon: "standings" },
  ];
  const tools = [
    { id: "watchlist",    label: "Watchlist",    icon: "star",  badge: "6" },
    { id: "alerts",       label: "Alerts",       icon: "bell",  badge: "2" },
    { id: "integrations", label: "Integrations", icon: "swap" },
    { id: "activity",     label: "Activity log", icon: "spark" },
  ];

  const [open, setOpen] = useState(false);
  const active = leagues?.find((l) => l.id === activeLeague) || leagues?.[0];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="col" style={{ gap: 0, flex: 1 }}>
          <div className="brand-name">Diamond</div>
          <div className="brand-sub" style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => setOpen((o) => !o)}>
            <span>{active?.name || "Diamond Cartel"} · {active?.year || new Date().getFullYear()}</span>
            <span style={{ opacity: 0.6 }}>▾</span>
          </div>
        </div>
      </div>

      {open && leagues && (
        <div style={{ margin: "0 10px 6px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 10, padding: 6 }}>
          {leagues.map((l) => (
            <div key={l.id} className="nav-item" onClick={() => { switchLeague(l.id); setOpen(false); }} style={{ padding: "6px 8px" }}>
              <span style={{ width: 18, height: 18, borderRadius: 4, background: l.platform === "ESPN" ? "#d50032" : l.platform === "Yahoo" ? "#6001d2" : "#1f8a5b", display: "grid", placeItems: "center", color: "white", fontSize: 9, fontWeight: 700 }}>
                {l.platform[0]}
              </span>
              <div className="col" style={{ gap: 0, flex: 1 }}>
                <span style={{ fontSize: 12.5 }}>{l.name}</span>
                <span className="mono muted" style={{ fontSize: 10 }}>{l.platform} · {l.size}-team {l.scoring}</span>
              </div>
              {l.id === activeLeague && <span className="tag pos">●</span>}
            </div>
          ))}
          <div className="divider" style={{ margin: "6px 4px" }} />
          <div className="nav-item" onClick={() => { go("integrations"); setOpen(false); }} style={{ padding: "6px 8px", fontSize: 12.5 }}>
            <Icons.plus /><span>Connect another league</span>
          </div>
        </div>
      )}

      <div className="nav">
        <div className="nav-section">League</div>
        {items.map((it) => {
          const Ic = Icons[it.icon];
          return (
            <div key={it.id} className={`nav-item ${route === it.id ? "active" : ""}`} onClick={() => go(it.id)}>
              <Ic /><span>{it.label}</span>
              {it.live && <span className="badge live">LIVE</span>}
              {it.badge && !it.live && <span className="badge">{it.badge}</span>}
            </div>
          );
        })}
        <div className="nav-section">You</div>
        {tools.map((it) => {
          const Ic = Icons[it.icon];
          return (
            <div key={it.id} className={`nav-item ${route === it.id ? "active" : ""}`} onClick={() => go(it.id)}>
              <Ic /><span>{it.label}</span>
              {it.badge && <span className="badge">{it.badge}</span>}
            </div>
          );
        })}
      </div>

      <div className="spacer" />
      <div className="nav" style={{ paddingBottom: 8 }}>
        <div className="nav-item" onClick={openCmd}>
          <Icons.search /><span>Search players</span><span className="badge mono">⌘K</span>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ route, sync, onSyncClick }) {
  const labels = {
    home: "Home", matchup: "Live Matchup", team: "My Team",
    players: "Players", waivers: "Waivers", standings: "Standings",
    watchlist: "Watchlist", alerts: "Alerts", integrations: "Integrations",
    activity: "Activity log",
  };
  return (
    <header className="topbar">
      <div className="crumbs">
        <span>Diamond Cartel</span>
        <span className="sep">/</span>
        <b>{labels[route] || route}</b>
      </div>

      {sync?.status === "ok" && (
        <div className="pill" style={{ cursor: "pointer" }} onClick={onSyncClick}>
          <span className="dot live" />
          <span>ESPN synced {sync.lastAgo}</span>
        </div>
      )}
      {sync?.status === "disconnected" && (
        <div className="pill" style={{ cursor: "pointer", borderColor: "var(--warn)", color: "var(--warn)" }} onClick={onSyncClick}>
          <span className="dot" style={{ background: "var(--warn)" }} />
          <span>ESPN disconnected</span>
        </div>
      )}

      <div className="spacer" />
    </header>
  );
}
