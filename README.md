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

## What exists
- Home, case database (server-side filters: state, jurisdiction at event date, district, category, status, year, text),
  case page (status ladder, claims with evidence links, timeline, parties, labelled amounts, documents,
  right of reply, legal status, correction history), explore by geography, methodology, corrections,
  right of reply, funding & independence, and a disabled report-a-concern preview.

## Not built yet (by design — see blueprint §11 roadmap)
- PostgreSQL schema and migrations, auth/MFA and roles, research workspace, editorial and legal desks,
  evidence vault, audit log, secure intake, Telugu interface, lint and test suites.
