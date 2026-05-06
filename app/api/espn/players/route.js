/** GET /api/espn/players?scoringPeriodId=X — free agents / waivers */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getFreeAgents, ESPNError } from "@/lib/espn";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const scoringPeriodId = searchParams.get("scoringPeriodId");

  const cookieStore = await cookies();
  const swid     = cookieStore.get("espn_swid")?.value;
  const s2       = cookieStore.get("espn_s2")?.value;
  const leagueId = cookieStore.get("espn_league_id")?.value;
  const year     = cookieStore.get("espn_year")?.value;

  if (!swid || !s2 || !leagueId) {
    return NextResponse.json({ error: "Not connected to ESPN" }, { status: 401 });
  }

  try {
    const data = await getFreeAgents({ leagueId, year, scoringPeriodId, swid, s2 });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ESPNError) {
      return NextResponse.json({ error: err.message }, { status: err.status >= 500 ? 502 : err.status });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
