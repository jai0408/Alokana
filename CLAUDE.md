# Project rules
- This is a public-interest evidence archive for Telangana and AP.
- Never invent facts, legal conclusions, source URLs or case statuses.
- No feature may autonomously publish content or determine guilt.
- Never use real whistleblower data in development, tests or prompts.
- Public data and confidential source identity must be stored separately.
- All private evidence objects must be private by default.
- Enforce authorization on the server for every protected action.
- Record an audit event for evidence access, edits, exports and publishing.

# Engineering conventions
- TypeScript strict mode; validate input at every server boundary.
- Use migrations for schema changes; never edit production data manually.
- Add tests for role boundaries, object access and sensitive-data redaction.
- Do not log tokens, passwords, source identities or document contents.
- Prefer small changes and explain trade-offs in the pull request.

# Required checks
- lint, typecheck, unit tests, integration tests and production build.
- Security review for auth, uploads, search, export, permissions or audit code.
- Accessibility review for public forms and public case pages.

# Workflow
- Start with a plan and list files to be changed.
- Ask before destructive operations, dependency changes or migrations.
- Do not deploy, publish or access production without explicit human approval.

# Repository map
- `packages/domain` — public case model (`model.ts`), status / evidence / amount vocabulary (`vocabulary.ts`),
  read-only repository (`repository.ts`) and SYNTHETIC fixtures (`fixtures.ts`). Page code reads cases only via the repository.
- `apps/web` — Next.js App Router public site. No private routes exist yet.
- Public types must never gain fields for source identity, storage keys or unpublished claims.
- Fixture parties carry "(fictional)" / "(sample)" markers and `synthetic: true`. Keep it that way.
- Ghost (headless CMS, `cms/`, gitignored) holds long-form investigations only; `apps/web/lib/ghost.ts` reads it
  via the Content API. Never store source identities, raw evidence or unpublished allegations in Ghost.
  Posts need the `investigation` tag; internal tags `#case-<ID>` link case records.
- Report-a-concern (`apps/web/app/report`) is a disabled preview until roadmap phase 4 sign-off.
