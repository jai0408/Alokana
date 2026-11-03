# Alokana — Real Estate Accountability Project

Public evidence archive for documented real-estate events in Telangana and Andhra Pradesh (2011–2026),
built from `Real_Estate_Accountability_Telangana_AP_Implementation_Blueprint.pdf` (not in this repo).

**Status:** public archive beta, now built as a Ghost theme. Every record in this repo is **synthetic**
sample data. "Alokana" is a working name pending brand and legal review.

## Layout

| Path | What it is |
| --- | --- |
| `theme/` | Custom Ghost 6 theme: home, case database, case pages (status ladder, claims, evidence), investigations, explore-by-geography, trust pages. |
| `content/build-import.mjs` | Builds the two Ghost import files below from the trust-page copy and the synthetic fixtures. |
| `content/alokana-trust-pages.json` | Methodology, corrections, right of reply, funding & independence, report-a-concern preview, explore. Imports **published**; contains no sample data. Safe for production. |
| `content/alokana-sample-content.json` | 5 synthetic case records + 1 sample investigation, tagged `#synthetic`. Imports as **drafts**. Staging only. |
| `content/routes.yaml` | Ghost routes: `/cases/`, `/investigations/`, `/notes/` collections. |
| `archive/next-site/` | The earlier Next.js front end, kept for reference. Its domain package is the source for the fixtures. |

## Working on the theme

```bash
npx gscan theme/                                       # validate (must pass for Ghost 6.x)
(cd theme && zip -r ../alokana-theme.zip . -x '.*')   # package for upload
node --experimental-strip-types content/build-import.mjs   # regenerate both import files
```

## Ghost setup (manual, needs a human with Ghost Admin access)

Nothing in this repo publishes to Ghost by itself. Each step below is done by an editor in Ghost Admin:

1. Staff accounts: turn on two-factor authentication.
2. Settings → Membership: "Nobody" (no sign-ups, no comments — the blueprint rules out open comments).
3. Settings → Design → Change theme → Upload `alokana-theme.zip`, then activate.
4. Settings → Labs → Routes → upload `content/routes.yaml`.
5. Settings → Advanced → Import/Export → Import → `content/alokana-trust-pages.json` (publishes the trust pages).
6. Delete Ghost's default "Coming soon" post and "About" page.
7. *Optional, staging only:* import `content/alokana-sample-content.json` (synthetic records, as drafts).
   Do not import it into the public production site.

The beta notice at the top of every page is a theme setting: Settings → Design → Site-wide → Beta notice.
Clear it to hide the bar.

### Anonymity
The site publishes as an institution. No staff name, profile or handle may reach a public page.
- No bylines in the theme; `routes.yaml` has no author taxonomy, so there are no `/author/` pages or authors sitemap.
- RSS is off for every collection (Ghost's feed carries the author's name).
- `ghost_head` excludes `social_data` and `schema` (author name in meta tags and JSON-LD), and `search` and
  `portal` (they embed the Content API key, which would let anyone list staff). The theme writes its own
  link-preview tags with no author field.
- Writers are invited as **Contributors**: they can draft but cannot publish. Only the owner publishes.
- Keep every staff account's name, slug, bio, photo, website and social fields generic (e.g. "Alokana Desk").
- Strip metadata (EXIF, PDF author fields) from images and documents before uploading.

### Theme notes
- Fonts are self-hosted in `theme/assets/fonts/` (SIL OFL 1.1); the theme makes no third-party requests.
- Pages carry `noindex, nofollow` while the archive is in beta (`theme/default.hbs`).
- Case records are recognised by their primary tag's slug (`case`), not with `{{#has tag}}`, which matches tag names.

### Checks run on the theme
`npx gscan theme/`, plus a local Ghost 6 install with both import files loaded: every route renders,
and axe-core (WCAG 2.1 AA + best practice) reports no violations on 13 page types in light and dark mode,
at 1280px and 390px, with no horizontal scrolling.

### Tag conventions
- `case` — structured case record (shown under `/cases/`).
- `investigation` — long-form investigation (shown under `/investigations/`).
- `#case-<ID>` (internal) — links an investigation to the case records it covers.
- `#synthetic` (internal) — sample data; must never be published as real.

## Not built yet (by design — see blueprint §11 roadmap)
PostgreSQL schema and migrations, auth/MFA and roles, research workspace, editorial and legal desks,
evidence vault, audit log, secure intake (report-a-concern stays disabled until phase 4 sign-off),
Telugu interface, lint and test suites.
