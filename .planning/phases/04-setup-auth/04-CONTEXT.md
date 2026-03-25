# Phase 4: Setup & Auth - Context

**Gathered:** 2026-03-25 (discuss mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold the Next.js 14 (App Router) project, wire up the Supabase JS client, build the login page, and protect all routes so unauthenticated visitors are redirected to login. No features beyond auth (no bookshelf, no books). Supabase backend (auth, database, RLS) is unchanged — this is frontend scaffolding only.

</domain>

<decisions>
## Implementation Decisions

### Project Structure
- **D-01:** The Next.js project lives in `web/` — a subdirectory of the repo root. `web/` contains `app/`, `components/`, `lib/`, `public/`, `package.json`, `next.config.js`, etc. The existing `libm/` (archived Flutter) and `supabase/` directories remain at root alongside it.
- **D-02:** Vercel deployment requires a root directory override pointing to `web/` (set in Vercel project settings or `vercel.json`).

### Login Page
- **D-03:** Centered card layout on a parchment background. The card has a 2px black border (no border radius), contains the app name "LibM" as a heading, email field, password field, and Sign In button — all in Georgia serif, consistent with the neo-brutalist old-money aesthetic.
- **D-04:** Login page is the only public route (`/login`). All other routes redirect to `/login` if not authenticated.
- **D-05:** No sign-up link, no "forgot password" link, no OAuth buttons — the login page is intentionally minimal.

### Error Feedback
- **D-06:** On login failure, a red error message appears above the form fields inside the card (e.g., "Invalid email or password"). Single generic message regardless of whether it was the email or password that was wrong — no field-specific errors.

### Aesthetic (Carried Forward)
- **D-07:** Parchment background (`#F5F0E8`), forest green (`#2D4A3E`) as primary accent, Georgia serif font throughout. `border-radius: 0` everywhere. 2px black borders on inputs and buttons.

### Claude's Discretion
- Supabase client approach: use `@supabase/ssr` for proper Next.js App Router server/client session handling (middleware + browser client)
- Middleware implementation for route protection (Next.js middleware at `web/middleware.ts`)
- Loading state during sign-in (button disabled / "Signing in…" label — Claude decides)
- Exact card dimensions, padding, and spacing
- TypeScript configuration and project tooling (ESLint, Prettier)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — AUTH-01, AUTH-02, AUTH-03, AUTH-04 define all auth requirements for this phase

### Supabase Schema & RLS
- `supabase/migrations/20260322000000_rls_two_users.sql` — two-UID RLS policy template; the UIDs are already set — frontend must read from environment variables, not hardcode
- `supabase/migrations/20260322000001_books_table.sql` — books table schema; Phase 4 doesn't touch this but agents should understand the DB structure

### Aesthetic Reference
- `.planning/phases/02-library/02-CONTEXT.md` (D-01 through D-08) — canonical aesthetic decisions: color constants, border style, font, palette swatches — Phase 4 must establish these as shared Tailwind/CSS tokens so later phases can inherit them

### Project
- `.planning/PROJECT.md` — Constraints section: tech stack, auth constraints, deployment target

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing Next.js code — this phase creates the scaffold from scratch
- Color constants from Flutter (`login_screen.dart`): parchment `#F5F0E8`, forest green `#2D4A3E` — translate to Tailwind config or CSS variables in this phase so all future phases share them

### Established Patterns
- From the Flutter app: StatefulWidget + direct Supabase calls pattern → in Next.js this becomes client components + `@supabase/ssr` browser client
- The login screen aesthetic in `libm/lib/features/auth/login_screen.dart` is the visual reference — same feel, adapted to web (centered card, same colors and typography)

### Integration Points
- `web/app/login/page.tsx` — public login route
- `web/middleware.ts` — intercepts all requests, checks Supabase session, redirects unauthenticated users to `/login`
- `web/lib/supabase/` — Supabase client factory (server client, browser client, middleware client)
- `web/app/layout.tsx` — root layout; sets up font (Georgia via CSS) and parchment background globally
- Vercel environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

</code_context>

<specifics>
## Specific Ideas

- The Flutter login screen is the visual reference for feel — same parchment background, same Georgia font heading, same squared-off borders. Adapt to web (centered card, browser viewport centering)
- Error message is intentionally vague ("Invalid email or password") — never indicate which field was wrong, since this is a private two-account app and there's no account recovery anyway

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-setup-auth*
*Context gathered: 2026-03-25*
