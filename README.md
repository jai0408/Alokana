# Alokana — Real Estate Accountability Project

Public evidence archive for documented real-estate events in Telangana and Andhra Pradesh (2011–2026),
built from `Real_Estate_Accountability_Telangana_AP_Implementation_Blueprint.pdf`.

**Status:** public archive beta front end (roadmap phase 3 shape) with synthetic sample records only.
"Alokana" is a working name pending brand and legal review.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Editorial CMS (Ghost, headless)

Long-form investigations are written in [Ghost](https://ghost.org) and pulled into the site through the
read-only Content API. Structured case records (claims, evidence, status) stay in `packages/domain`.

Local Ghost lives in `cms/` (gitignored) and needs Node 22 or 24 (`brew install node@24`):

```bash
npm run cms:start   # Ghost Admin at http://localhost:2368/ghost/
npm run cms:stop
```

One-time setup in Ghost Admin:
1. Create the owner account, and turn on two-factor authentication for staff.
2. Settings → Integrations → Add custom integration → copy the Content API key into `apps/web/.env.local`
   (see `apps/web/.env.example`).
3. Settings → Membership: set to "Nobody" (no sign-ups, no comments — the blueprint rules out open comments).
4. Write a post, add the tag `investigation`. To link case records, add internal tags such as `#case-SYN-0002`.

## What exists
- Investigations list and article pages from Ghost, with linked case records.
- Home, case database (server-side filters: state, jurisdiction at event date, district, category, status, year, text),
  case page (status ladder, claims with evidence links, timeline, parties, labelled amounts, documents,
  right of reply, legal status, correction history), explore by geography, methodology, corrections,
  right of reply, funding & independence, and a disabled report-a-concern preview.

## Not built yet (by design — see blueprint §11 roadmap)
- PostgreSQL schema and migrations, auth/MFA and roles, research workspace, editorial and legal desks,
  evidence vault, audit log, secure intake, Telugu interface, lint and test suites.
