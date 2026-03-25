# Phase 4: Setup & Auth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-25
**Phase:** 04-Setup & Auth
**Areas discussed:** Project structure, Login page visual, Error feedback

---

## Project Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Repo root | next.config.js, app/, package.json at repo root; libm/ and supabase/ sit alongside | |
| web/ subdirectory | Next.js lives at web/; Vercel needs root directory override | ✓ |

**User's choice:** `web/` subdirectory
**Notes:** Keeps Flutter archive and Next.js project clearly separated; user preferred explicit separation over Vercel convenience.

---

## Login Page Visual

| Option | Description | Selected |
|--------|-------------|----------|
| Centered card | Form in a bordered card centered on parchment page | ✓ |
| Full-page form | Fields directly on parchment background, no card container | |

**User's choice:** Centered card
**Notes:** Consistent with the document/study feel of the app; aligns with the Flutter login screen aesthetic.

---

## Error Feedback

| Option | Description | Selected |
|--------|-------------|----------|
| Red message above form | Single error line at top of card ("Invalid email or password") | ✓ |
| Inline under password | Error shown below the password field | |

**User's choice:** Red message above form
**Notes:** Simple, always visible, appropriate for a private two-account app where specific field errors aren't needed.

---

## Claude's Discretion

- Supabase client approach (`@supabase/ssr` vs raw client)
- Middleware implementation details for route protection
- Loading state during sign-in
- Card dimensions, padding, and spacing
- TypeScript/ESLint/Prettier configuration

## Deferred Ideas

None raised during discussion.
