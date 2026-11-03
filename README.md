# Alokana — Real Estate Accountability Project

Public evidence archive for documented real-estate events in Telangana and Andhra Pradesh (2011–2026),
built from `Real_Estate_Accountability_Telangana_AP_Implementation_Blueprint.pdf` (not in this repo).

**Status:** public archive beta, now built as a Ghost theme. Every record in this repo is **synthetic**
sample data. "Alokana" is a working name pending brand and legal review.

## Layout

| Path | What it is |
| --- | --- |
| `theme/` | Custom Ghost 6 theme: home, case database, case pages (status ladder, claims, evidence), investigations, explore-by-geography, trust pages. |
| `content/build-import.mjs` | Builds a Ghost import file from the synthetic fixtures and trust-page copy. |
| `content/alokana-sample-content.json` | Generated import file: 6 posts (5 sample cases + 1 sample investigation), 6 pages, 32 tags. All tagged `#synthetic`. |
| `content/routes.yaml` | Ghost routes: `/cases/`, `/investigations/`, `/notes/` collections. |
| `archive/next-site/` | The earlier Next.js front end, kept for reference. Its domain package is the source for the fixtures. |

## Working on the theme

```bash
npx gscan theme/                                       # validate (must pass for Ghost 6.x)
(cd theme && zip -r ../alokana-theme.zip . -x '.*')   # package for upload
node --experimental-strip-types content/build-import.mjs   # regenerate the import file
```

## Ghost setup (manual, needs a human with Ghost Admin access)

Nothing in this repo publishes to Ghost by itself. Each step below is done by an editor in Ghost Admin:

1. Staff accounts: turn on two-factor authentication.
2. Settings → Membership: "Nobody" (no sign-ups, no comments — the blueprint rules out open comments).
3. Settings → Design → Change theme → Upload `alokana-theme.zip`, then activate.
4. Settings → Labs → Routes → upload `content/routes.yaml`.
5. *Optional, staging only:* Settings → Advanced → Import → `content/alokana-sample-content.json`.
   This loads synthetic sample records. Do not import it into the public production site.

### Tag conventions
- `case` — structured case record (shown under `/cases/`).
- `investigation` — long-form investigation (shown under `/investigations/`).
- `#case-<ID>` (internal) — links an investigation to the case records it covers.
- `#synthetic` (internal) — sample data; must never be published as real.

## Not built yet (by design — see blueprint §11 roadmap)
PostgreSQL schema and migrations, auth/MFA and roles, research workspace, editorial and legal desks,
evidence vault, audit log, secure intake (report-a-concern stays disabled until phase 4 sign-off),
Telugu interface, lint and test suites.
