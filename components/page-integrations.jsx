"use client";

import { useState, useEffect } from "react";
import { Icons } from "./atoms";

// ── Connect ESPN onboarding (4 steps) ────────────────────────────────────────
export function ConnectESPNModal({ onClose, onConnected }) {
  const [step,   setStep]   = useState(0);
  const [method, setMethod] = useState("cookies"); // cookies | extension
  const [swid,   setSwid]   = useState("");
  const [s2,     setS2]     = useState("");
  const [leagueId, setLeagueId] = useState("");
  const [year,   setYear]   = useState(String(new Date().getFullYear()));
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const next = () => { setError(""); setStep((s) => Math.min(s + 1, 3)); };
  const back = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const finish = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/espn/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ swid, s2, leagueId, year: Number(year) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to connect. Check your credentials.");
        setLoading(false);
        return;
      }
      onConnected && onConnected({ method, swid, s2, leagueId, year });
      setStep(3);
    } catch {
      setError("Network error — couldn't reach Diamond's server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slide-over" style={{ display: "grid", placeItems: "center" }} onClick={onClose}>
      <div className="card" style={{ width: 620, maxHeight: "86vh", overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#d50032", display: "grid", placeItems: "center", color: "white", fontWeight: 800 }}>E</div>
          <div className="col" style={{ gap: 0, flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Connect ESPN Fantasy</div>
            <div className="mono muted" style={{ fontSize: 11 }}>Step {step + 1} of 4</div>
          </div>
          <button className="btn ghost sm" onClick={onClose}><Icons.close /></button>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 4, padding: "12px 20px 4px" }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? "var(--accent)" : "var(--bg-3)", transition: "background .3s" }} />
          ))}
        </div>

        <div style={{ padding: "18px 20px 20px", overflow: "auto", maxHeight: "60vh" }}>
          {/* Step 0 — Method choice */}
          {step === 0 && (
            <div className="col gap-14">
              <div className="eyebrow">How sync works</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                ESPN doesn&apos;t publish a public API, so Diamond reads your league using your <b>ESPN session cookies</b>. You stay logged into ESPN — Diamond never stores your password.
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="card card-pad col gap-6" style={{ borderColor: method === "cookies" ? "var(--accent)" : "var(--line)", cursor: "pointer" }} onClick={() => setMethod("cookies")}>
                  <div className="row gap-8"><Icons.cog /><b>Session cookies</b><span className="spacer" />{method === "cookies" && <span className="tag pos">SELECTED</span>}</div>
                  <div className="muted" style={{ fontSize: 12 }}>Paste your SWID + espn_s2 from browser DevTools. Works for any private league.</div>
                </div>
                <div className="card card-pad col gap-6" style={{ borderColor: method === "extension" ? "var(--accent)" : "var(--line)", cursor: "pointer" }} onClick={() => setMethod("extension")}>
                  <div className="row gap-8"><Icons.bolt /><b>Browser helper</b><span className="spacer" />{method === "extension" && <span className="tag pos">SELECTED</span>}</div>
                  <div className="muted" style={{ fontSize: 12 }}>Coming soon — auto-syncs and lets you push lineups in one click.</div>
                </div>
              </div>
              <div className="tick" style={{ background: "rgba(78,161,255,.06)", borderColor: "rgba(78,161,255,.25)" }}>
                <Icons.bell />
                <div className="muted" style={{ fontSize: 12 }}>Credentials are stored in secure httpOnly cookies on your device — never in a database.</div>
              </div>
            </div>
          )}

          {/* Step 1 — Paste cookies */}
          {step === 1 && (
            <div className="col gap-12">
              <div className="eyebrow">Paste your ESPN session cookies</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                In a browser logged into ESPN, open <b>DevTools → Application → Cookies → espn.com</b> and copy these two values:
              </div>
              <label className="col gap-6">
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>SWID</span>
                <input
                  className="mono"
                  value={swid}
                  onChange={(e) => setSwid(e.target.value)}
                  placeholder="{ABCD1234-5678-90EF-...}"
                  style={{ padding: "10px 12px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 8, color: "var(--ink-0)", fontSize: 12, width: "100%" }}
                />
              </label>
              <label className="col gap-6">
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>espn_s2</span>
                <textarea
                  className="mono"
                  value={s2}
                  onChange={(e) => setS2(e.target.value)}
                  placeholder="AEB...long string..."
                  rows={3}
                  style={{ padding: "10px 12px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 8, color: "var(--ink-0)", fontSize: 12, resize: "vertical", width: "100%" }}
                />
              </label>
              <div className="tick">
                <Icons.cog />
                <div className="muted" style={{ fontSize: 11.5 }}>Stored in secure httpOnly cookies. Cookies expire periodically — Diamond will prompt you to refresh them.</div>
              </div>
            </div>
          )}

          {/* Step 2 — League ID + year */}
          {step === 2 && (
            <div className="col gap-12">
              <div className="eyebrow">Your league details</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                Find your league ID in the ESPN URL: <span className="mono" style={{ fontSize: 12, color: "var(--ink-0)" }}>fantasy.espn.com/baseball/league?leagueId=<b>12345</b></span>
              </div>
              <label className="col gap-6">
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>League ID</span>
                <input
                  className="mono"
                  value={leagueId}
                  onChange={(e) => setLeagueId(e.target.value)}
                  placeholder="12345"
                  style={{ padding: "10px 12px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 8, color: "var(--ink-0)", fontSize: 14, width: "100%" }}
                />
              </label>
              <label className="col gap-6">
                <span className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>Season year</span>
                <input
                  className="mono"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder={String(new Date().getFullYear())}
                  style={{ padding: "10px 12px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 8, color: "var(--ink-0)", fontSize: 14, width: "100%" }}
                />
              </label>
              {error && (
                <div className="tick" style={{ borderColor: "var(--neg)", background: "rgba(255,91,106,.06)" }}>
                  <Icons.close />
                  <span style={{ fontSize: 12.5, color: "var(--neg)" }}>{error}</span>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div className="col gap-12" style={{ alignItems: "center", textAlign: "center", padding: "20px 10px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-soft)", display: "grid", placeItems: "center" }}>
                <div style={{ fontSize: 30, color: "var(--accent)" }}>✓</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Connected!</div>
              <div className="muted" style={{ fontSize: 13, maxWidth: 380 }}>Diamond is now syncing your ESPN league. Data will refresh every 30 seconds during live scoring, every 5 minutes otherwise.</div>
              <div className="grid-3" style={{ width: "100%", marginTop: 8 }}>
                <MiniStat k="League ID" v={leagueId} />
                <MiniStat k="Season" v={year} />
                <MiniStat k="Auth" v="Cookies" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
          {step > 0 && step < 3 && <button className="btn" onClick={back} disabled={loading}>Back</button>}
          <div className="spacer" />
          {step < 2 && <button className="btn primary" onClick={next}>Continue</button>}
          {step === 2 && (
            <button className="btn primary" onClick={finish} disabled={loading || !swid || !s2 || !leagueId}>
              {loading ? "Connecting…" : "Connect league"}
            </button>
          )}
          {step === 3 && <button className="btn primary" onClick={onClose}>Open Diamond</button>}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ k, v }) {
  return (
    <div className="card card-pad col" style={{ gap: 2, alignItems: "center" }}>
      <div className="eyebrow">{k}</div>
      <div className="tnum" style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
    </div>
  );
}

// ── Sync status popover ──────────────────────────────────────────────────────���
export function SyncStatusPopover({ league, onClose }) {
  if (!league) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={onClose}>
      <div className="card" style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", width: 360, zIndex: 41 }} onClick={(e) => e.stopPropagation()}>
        <div className="card-h">
          <div style={{ width: 20, height: 20, borderRadius: 4, background: "#d50032", display: "grid", placeItems: "center", color: "white", fontWeight: 800, fontSize: 10 }}>E</div>
          <h3>{league.name}</h3>
          <span className="spacer" />
          <button className="btn ghost sm" onClick={onClose}><Icons.close /></button>
        </div>
        <div className="card-pad col gap-10">
          <div className="row gap-8">
            <span className="tag pos"><span className="dot live" /> LIVE</span>
            <span className="mono muted" style={{ fontSize: 11 }}>Last synced {league.lastSync}</span>
            <span className="spacer" />
            <button className="btn sm">Force sync</button>
          </div>
          <div className="divider" />
          <div className="muted" style={{ fontSize: 12 }}>Mode: {league.mode} · {league.method}</div>
        </div>
      </div>
    </div>
  );
}

// ── Integrations page ─────────────────────────────────────────────────────────
export default function IntegrationsPage({ leagues, openConnect }) {
  const [espnStatus, setEspnStatus] = useState(null);

  useEffect(() => {
    fetch("/api/espn/auth")
      .then((r) => r.json())
      .then(setEspnStatus)
      .catch(() => {});
  }, []);

  const disconnect = async () => {
    await fetch("/api/espn/auth", { method: "DELETE" });
    setEspnStatus({ connected: false });
  };

  return (
    <div className="page col gap-20">
      <div className="row gap-16" style={{ alignItems: "flex-end" }}>
        <div className="col gap-6">
          <div className="eyebrow">Integrations</div>
          <h1 className="h1">Connected platforms</h1>
          <div className="sub">Diamond syncs your ESPN league in real time. Yahoo, Fantrax, and Sleeper coming soon.</div>
        </div>
        <div className="spacer" />
        <button className="btn primary" onClick={openConnect}><Icons.plus /> Connect league</button>
      </div>

      {/* ESPN connection card */}
      <div className="card card-pad col gap-16">
        <div className="row gap-14" style={{ alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#d50032", display: "grid", placeItems: "center", color: "white", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>E</div>
          <div className="col" style={{ flex: 1, gap: 4 }}>
            <div className="row gap-8">
              <div style={{ fontWeight: 700, fontSize: 16 }}>ESPN Fantasy Baseball</div>
              {espnStatus?.connected
                ? <span className="tag pos"><span className="dot live" style={{ width: 5, height: 5 }} /> Connected</span>
                : <span className="tag flat">Not connected</span>}
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              {espnStatus?.connected
                ? `League ID ${espnStatus.leagueId} · ${espnStatus.year} season · Syncing via session cookies`
                : "Connect your ESPN league to sync rosters, scores, and standings in real time."}
            </div>
          </div>
          {espnStatus?.connected ? (
            <button className="btn sm" style={{ color: "var(--neg)" }} onClick={disconnect}>Disconnect</button>
          ) : (
            <button className="btn primary" onClick={openConnect}><Icons.plus /> Connect</button>
          )}
        </div>

        {espnStatus?.connected && (
          <>
            <div className="divider" style={{ margin: "0" }} />
            <div className="grid-3">
              <FieldInfo k="League ID" v={espnStatus.leagueId} />
              <FieldInfo k="Season" v={espnStatus.year} />
              <FieldInfo k="Auth method" v="Session cookies" />
            </div>
            <div className="divider" style={{ margin: "0" }} />
            <div className="col gap-8">
              <div className="eyebrow">Sync capabilities</div>
              {[
                ["Read: rosters, scores, standings",    true],
                ["Read: free agents & waivers",         true],
                ["Push: lineup changes",                true],
                ["Push: add/drop & waiver claims",      false],
                ["Push: trade proposals",               false],
              ].map(([lbl, on], i) => (
                <div key={i} className="row gap-8" style={{ fontSize: 12.5 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: on ? "var(--pos)" : "var(--bg-3)", border: on ? "none" : "1px solid var(--line-2)", flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{lbl}</span>
                  <span className="muted mono" style={{ fontSize: 10.5 }}>{on ? "ON" : "OFF"}</span>
                </div>
              ))}
            </div>
            <div className="row gap-6">
              <button className="btn sm">Configure</button>
              <button className="btn sm">Test sync</button>
            </div>
          </>
        )}
      </div>

      {/* Coming soon platforms */}
      <div className="grid-3">
        {["Yahoo", "Fantrax", "Sleeper"].map((p) => (
          <div key={p} className="card card-pad col gap-10" style={{ borderStyle: "dashed", alignItems: "flex-start" }}>
            <div className="row gap-10">
              <div style={{ width: 28, height: 28, borderRadius: 6, background: p === "Yahoo" ? "#6001d2" : p === "Fantrax" ? "#1f8a5b" : "#ff8a3d", display: "grid", placeItems: "center", color: "white", fontWeight: 800, fontSize: 13 }}>{p[0]}</div>
              <div className="col" style={{ gap: 1 }}>
                <div style={{ fontWeight: 600 }}>{p}</div>
                <div className="muted mono" style={{ fontSize: 11 }}>Coming soon</div>
              </div>
            </div>
            <div className="muted" style={{ fontSize: 12 }}>Connect a {p} league to mirror it alongside ESPN.</div>
            <button className="btn sm" disabled>Notify me</button>
          </div>
        ))}
      </div>

      {/* Global settings */}
      <div className="card">
        <div className="card-h"><h3>Global sync settings</h3></div>
        <div className="card-pad grid-3">
          <FieldInfo k="Frequency" v="Smart (30s during games, 5m otherwise)" />
          <FieldInfo k="Conflict policy" v="ESPN wins · Diamond reverts to match" />
          <FieldInfo k="Notifications" v="On conflict, failed push, cookie expiry" />
        </div>
      </div>
    </div>
  );
}

function FieldInfo({ k, v }) {
  return (
    <div className="col" style={{ gap: 2 }}>
      <div className="eyebrow">{k}</div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
    </div>
  );
}

// ── Activity log ──────────────────────────────────────────────────────────────
export function ActivityLogPage() {
  const items = [
    { kind: "PUSH", ok: true,  txt: "Lineup change applied to ESPN: Mookie Betts → UTIL, Ohtani → Bench", t: "14m ago", who: "You" },
    { kind: "PULL", ok: true,  txt: "Score update: NYY +5.2 (Judge HR #38)", t: "24m ago" },
    { kind: "PUSH", ok: false, txt: "Add/drop failed: H. Ramos add — waiver period not yet processed", t: "1h ago", who: "You", err: "ESPN: Waiver pending until Wed 3:00 AM ET" },
    { kind: "PULL", ok: true,  txt: "Roster mirror updated · 4 players moved by manager", t: "1h ago" },
    { kind: "WARN", ok: false, txt: "Conflict resolved: ESPN moved Devers to Bench. Diamond reverted local edit.", t: "2h ago" },
    { kind: "PULL", ok: true,  txt: "League settings re-synced (no changes)", t: "3h ago" },
    { kind: "PUSH", ok: true,  txt: "Drop: Brandon Marsh", t: "6h ago", who: "You" },
    { kind: "AUTH", ok: true,  txt: "Cookie credentials validated (27 days remaining)", t: "12h ago" },
  ];

  const tagFor = (k, ok) => {
    if (k === "PUSH") return [ok ? "info" : "neg", "PUSH"];
    if (k === "PULL") return ["pos", "PULL"];
    if (k === "WARN") return ["warn", "CONFLICT"];
    return ["flat", k];
  };

  return (
    <div className="page col gap-16">
      <div className="row gap-16" style={{ alignItems: "flex-end" }}>
        <div className="col gap-6">
          <div className="eyebrow">Activity log</div>
          <h1 className="h1">Sync activity</h1>
          <div className="sub">Every read, write, and conflict between Diamond and ESPN.</div>
        </div>
        <div className="spacer" />
        <span className="pill mono">{items.length} events · last 24h</span>
        <button className="btn"><Icons.filter /> Filter</button>
      </div>
      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 90, paddingLeft: 14 }}>Type</th>
              <th>Event</th>
              <th>Actor</th>
              <th>Details</th>
              <th style={{ width: 120 }}>When</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a, i) => {
              const [c, l] = tagFor(a.kind, a.ok);
              return (
                <tr key={i}>
                  <td style={{ paddingLeft: 14 }}><span className={`tag ${c}`}>{l}</span></td>
                  <td style={{ fontSize: 13 }}>{a.txt}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{a.who || "system"}</td>
                  <td className="muted" style={{ fontSize: 12 }}>{a.err || (a.ok ? "OK" : "—")}</td>
                  <td className="mono muted" style={{ fontSize: 11 }}>{a.t}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Conflict banner ───────────────────────────────────────────────────────────
export function ConflictBanner({ conflict, onResolve }) {
  if (!conflict) return null;
  return (
    <div className="row gap-12" style={{ padding: "10px 28px", background: "rgba(255,159,67,.12)", borderBottom: "1px solid rgba(255,159,67,.3)" }}>
      <span className="tag warn">ESPN WINS</span>
      <div style={{ fontSize: 13 }}>
        <b>{conflict.who}</b> moved <b>{conflict.player}</b> to <b>{conflict.toSlot}</b> on ESPN. Diamond reverted your local change.
      </div>
      <div className="spacer" />
      <button className="btn sm" onClick={onResolve}>View diff</button>
      <button className="btn sm" onClick={onResolve}>Dismiss</button>
    </div>
  );
}
