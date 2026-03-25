---
phase: 04-setup-auth
plan: 02
subsystem: auth
tags: [nextjs, supabase, ssr, tailwindcss, typescript, login]

# Dependency graph
requires:
  - phase: 04-01
    provides: Tailwind design tokens, Next.js 14 App Router scaffold, @supabase/ssr installed
provides:
  - Three Supabase client factories in web/lib/supabase/ (browser, server, middleware)
  - Login page at /login with full UI-SPEC compliance (parchment/Georgia/neo-brutalist)
  - signInWithPassword auth flow with generic error message and loading spinner
affects: [04-03, 05-library, 06-books, 07-wishlist]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@supabase/ssr createBrowserClient for 'use client' components"
    - "@supabase/ssr createServerClient with cookie adapter for Server Components"
    - "@supabase/ssr createServerClient with request/response cookie adapter for middleware"
    - "Server Component page wrapper + Client Component form split pattern"

key-files:
  created:
    - web/lib/supabase/client.ts
    - web/lib/supabase/server.ts
    - web/lib/supabase/middleware.ts
    - web/app/login/page.tsx
    - web/app/login/LoginForm.tsx
  modified: []

key-decisions:
  - "CookieOptions type imported from @supabase/ssr for explicit typing of setAll parameter — TypeScript strict mode requires explicit types; implicit 'any' fails build"

patterns-established:
  - "Supabase client pattern: all Supabase instantiation goes through one of three factories in web/lib/supabase/ — never import @supabase/supabase-js or @supabase/ssr directly elsewhere"
  - "Login form split: page.tsx is Server Component (no 'use client'), LoginForm.tsx is Client Component with useState and event handlers"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03]

# Metrics
duration: 5min
completed: 2026-03-25
---

# Phase 4 Plan 02: Supabase Client Factories & Login Page Summary

**Three @supabase/ssr client factories (browser/server/middleware) plus login page at /login with Georgia serif neo-brutalist UI, signInWithPassword auth flow, loading spinner, and generic error display**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-25T23:22:00Z
- **Completed:** 2026-03-25T23:27:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Three canonical Supabase client factories created in web/lib/supabase/ using @supabase/ssr — browser client for 'use client' components, server client for Server Components/Route Handlers with cookie read/write, middleware client for session refresh in Next.js middleware
- Login page at /login renders per UI-SPEC: "LibM" 48px bold Georgia heading (2px letter-spacing), "your shared shelf" 14px italic tagline, 52px email and password inputs with 2px black border and focus:border-forest-green, 52px forest-green SIGN IN button (full width), no sign-up/forgot-password/OAuth links
- Auth flow: signInWithPassword on submit, loading spinner replaces button text during sign-in, "Invalid email or password" dark-red error above button on failure, redirect to / on success; `npm run build` exits 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Supabase client factory files** - `3469a79` (feat)
2. **Task 2: Build the login page** - `9a41fb0` (feat)

## Files Created/Modified

- `web/lib/supabase/client.ts` - Browser Supabase client via createBrowserClient (@supabase/ssr)
- `web/lib/supabase/server.ts` - Server Supabase client via createServerClient with cookie getAll/setAll adapter
- `web/lib/supabase/middleware.ts` - Middleware Supabase client via createServerClient with request/response cookie adapter
- `web/app/login/page.tsx` - Server Component page wrapper: parchment centered layout, imports LoginForm
- `web/app/login/LoginForm.tsx` - Client Component: full login form UI with auth logic, loading state, error state

## Decisions Made

- Added explicit `CookieOptions` type annotation (imported from `@supabase/ssr`) to `setAll` parameters in both server.ts and middleware.ts. TypeScript strict mode rejected implicit `any` types for the `cookiesToSet` parameter in both files — the build failed without explicit types.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added explicit CookieOptions type to setAll parameters in server.ts and middleware.ts**
- **Found during:** Task 2 verification (`npm run build` after creating login page)
- **Issue:** TypeScript strict mode rejected implicit `any` type for `cookiesToSet` parameter in the `setAll` cookie callback in both `web/lib/supabase/server.ts` and `web/lib/supabase/middleware.ts`. Build failed with "Parameter 'cookiesToSet' implicitly has an 'any' type."
- **Fix:** Imported `CookieOptions` type from `@supabase/ssr` in both files and added explicit `{ name: string; value: string; options: CookieOptions }[]` type annotation to `setAll` parameter
- **Files modified:** web/lib/supabase/server.ts, web/lib/supabase/middleware.ts
- **Verification:** `npm run build` exits 0 with no TypeScript errors
- **Committed in:** 9a41fb0 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Required for TypeScript strict mode compliance — build failed without it. No scope creep.

## Issues Encountered

- TypeScript strict mode implicit `any` in supabase client factories — the plan's code samples omitted explicit types for `setAll` callbacks. Auto-fixed by adding `CookieOptions` type import and annotation.

## User Setup Required

None - no external service configuration required. Supabase env vars were documented in Plan 01 (.env.example).

## Known Stubs

None — the login page is fully wired to Supabase auth. On successful login the app redirects to `/` which returns null (stub from Plan 01, documented in 04-01-SUMMARY.md); that stub will be resolved by Phase 5 (library screen). Plan 03 (middleware route protection) will add the middleware redirect from `/` to `/login` for unauthenticated users.

## Next Phase Readiness

- All three Supabase client factories are ready for use in Plan 03 (middleware) and all future phases
- Login page is complete and functional — auth flow fully wired
- `npm run build` exits 0 — no blockers for Plan 03 execution

---
*Phase: 04-setup-auth*
*Completed: 2026-03-25*
