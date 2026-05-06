/**
 * POST /api/espn/auth  — save ESPN credentials in secure httpOnly cookies
 * GET  /api/espn/auth  — return connection status (redacted)
 * DELETE /api/espn/auth — clear credentials (disconnect)
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { espnFetch, leaguePath, ESPNError } from "@/lib/espn";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export async function POST(request) {
  const { swid, s2, leagueId, year } = await request.json();

  if (!swid || !s2 || !leagueId) {
    return NextResponse.json(
      { error: "swid, s2, and leagueId are required" },
      { status: 400 }
    );
  }

  // Validate by making a lightweight ESPN request
  try {
    await espnFetch(
      leaguePath(leagueId, year || new Date().getFullYear()),
      swid,
      s2,
      ["mSettings"]
    );
  } catch (err) {
    if (err instanceof ESPNError) {
      console.error("ESPNError:", err.status, err.body);
      if (err.status === 401 || err.status === 403) {
        return NextResponse.json(
          { error: "ESPN credentials are invalid or expired. Check your SWID and espn_s2 values." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: `ESPN returned ${err.status}: ${err.body?.slice?.(0, 200) ?? ""}` },
        { status: 502 }
      );
    }
    console.error("ESPN fetch error:", err);
    return NextResponse.json({ error: `Failed to reach ESPN: ${err.message}` }, { status: 502 });
  }

  // Store credentials in httpOnly cookies
  const cookieStore = await cookies();
  cookieStore.set("espn_swid",     swid,     COOKIE_OPTS);
  cookieStore.set("espn_s2",       s2,       COOKIE_OPTS);
  cookieStore.set("espn_league_id", leagueId, COOKIE_OPTS);
  cookieStore.set("espn_year",     String(year || new Date().getFullYear()), COOKIE_OPTS);

  return NextResponse.json({ ok: true, leagueId, year });
}

export async function GET() {
  const cookieStore = await cookies();
  const leagueId = cookieStore.get("espn_league_id")?.value;
  const year     = cookieStore.get("espn_year")?.value;
  const hasSwid  = !!cookieStore.get("espn_swid")?.value;
  const hasS2    = !!cookieStore.get("espn_s2")?.value;

  if (!leagueId || !hasSwid || !hasS2) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    leagueId,
    year,
    // Never return raw credential values
    credentialsPresent: { swid: hasSwid, s2: hasS2 },
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  const clear = { value: "", maxAge: 0, path: "/" };
  cookieStore.set("espn_swid",      "", clear);
  cookieStore.set("espn_s2",        "", clear);
  cookieStore.set("espn_league_id", "", clear);
  cookieStore.set("espn_year",      "", clear);
  return NextResponse.json({ ok: true });
}
