---
phase: 04-setup-auth
plan: "03"
subsystem: auth
tags: [next.js, middleware, supabase, ssr, route-protection]

# Dependency graph
requires:
  - phase: 04-setup-auth plan 01
    provides: Next.js scaffold with Tailwind design tokens
  - phase: 04-setup-auth plan 02
    provides: Supabase @supabase/ssr client factories including createMiddlewareClient
provides:
  - Next.js middleware at web/middleware.ts enforcing auth on all routes
  - Route protection: unauthenticated users redirected to /login
  - Login loop prevention: authenticated users hitting /login redirected to /
affects:
  - All future phases (every route is now behind auth gate)
  - Phase 05+ — all app routes are protected, login is the only public entry point

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Next.js middleware at project root (web/middleware.ts) for auth enforcement"
    - "getUser() over getSession() for authoritative server-side auth check"
    - "Mutate-and-return response pattern to preserve refreshed session cookie"

key-files:
  created:
    - web/middleware.ts
  modified: []

key-decisions:
  - "Use getUser() (not getSession()) — validates JWT with Supabase servers; getSession() reads cookie only and can be spoofed"
  - "Matcher excludes _next/static, _next/image, favicon.ico, sitemap.xml, robots.txt — static assets never intercepted"
  - "/login is the sole public route; every other pathname requires valid user"

patterns-established:
  - "Middleware pattern: create response → create supabase client → getUser() → redirect or pass through"

requirements-completed: [AUTH-03, AUTH-04]

# Metrics
duration: 1min
completed: 2026-03-25
---

# Phase 4 Plan 03: Route Protection Middleware Summary

**Next.js middleware using @supabase/ssr getUser() to enforce auth on all routes, with /login as the sole public entry point**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-25T23:24:57Z
- **Completed:** 2026-03-25T23:25:45Z
- **Tasks:** 1 of 2 (Task 2 is human-verify checkpoint — pending)
- **Files modified:** 1

## Accomplishments
- Created `web/middleware.ts` at the Next.js required root location (not inside app/)
- Implements authoritative auth check using `supabase.auth.getUser()` — validates JWT with Supabase servers
- Redirects unauthenticated requests on any route to /login
- Redirects authenticated users who hit /login to / (prevents login loop)
- Returns mutated response object so refreshed session cookie is preserved in browser
- Build passes clean (`npm run build` exits 0, middleware compiles at 78.6 kB)

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement Next.js middleware for route protection** - `c44c704` (feat)

**Plan metadata:** (pending — awaiting checkpoint approval before final docs commit)

## Files Created/Modified
- `web/middleware.ts` - Next.js middleware intercepting all requests; enforces auth via getUser(); redirects unauthenticated to /login and authenticated /login visitors to /

## Decisions Made
- Used `getUser()` over `getSession()` per @supabase/ssr best practice — getUser() validates with Supabase auth server making it authoritative; getSession() only reads from cookie and can be stale/spoofed
- Matcher regex excludes `_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt` so static file requests bypass auth checks entirely

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required beyond what was documented in Plan 02.

## Next Phase Readiness
- Complete Phase 4 auth loop: scaffold (01) + Supabase clients + login UI (02) + route protection (03)
- Human verification checkpoint (Task 2) must be approved before this plan is fully complete
- After checkpoint approval, AUTH-03 and AUTH-04 requirements are fully validated end-to-end
- Phase 05 (library/bookshelf) can begin once checkpoint is approved

---
*Phase: 04-setup-auth*
*Completed: 2026-03-25*
