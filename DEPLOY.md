# Diamond — Deployment Guide

## Local dev

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Vercel deployment

1. Push this folder to your GitHub repo
2. Import the repo in Vercel → it will auto-detect Next.js
3. No environment variables are required for the base app
4. (Optional) Add `COOKIE_SECRET` in Vercel → Settings → Environment Variables

## Connecting ESPN

Once deployed, navigate to **Integrations** in the app sidebar and click **Connect league**. You'll be prompted for:

| Field | Where to find it |
|-------|-----------------|
| **SWID** | Browser DevTools → Application → Cookies → `espn.com` → `SWID` |
| **espn_s2** | Same location → `espn_s2` (long string) |
| **League ID** | URL: `fantasy.espn.com/baseball/league?leagueId=XXXXX` |
| **Year** | Current season (default: current year) |

Credentials are stored in **httpOnly cookies** on the server — they are never written to a database or exposed to client-side JavaScript.

## ESPN API endpoints (all server-side)

| Route | Description |
|-------|-------------|
| `POST /api/espn/auth` | Save credentials + validate against ESPN |
| `GET /api/espn/auth` | Check connection status |
| `DELETE /api/espn/auth` | Disconnect / clear cookies |
| `GET /api/espn/league` | League settings + teams |
| `GET /api/espn/roster` | All team rosters |
| `GET /api/espn/matchup?scoringPeriodId=X&teamId=Y` | Live scoreboard |
| `GET /api/espn/standings` | League standings |
| `GET /api/espn/players?scoringPeriodId=X` | Free agents / waivers |

## Notes

- ESPN's private API has no official docs and may change without notice.
- Session cookies expire every ~30 days; the app will show a "disconnected" banner when they do.
- Push actions (lineup changes, add/drop) are wired in the UI but the ESPN write API requires additional reverse-engineering — contributions welcome.
