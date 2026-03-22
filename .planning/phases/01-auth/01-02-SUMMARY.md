---
phase: 01-auth
plan: 02
subsystem: auth
tags: [flutter, supabase, go_router, dart, rls, sql]

# Dependency graph
requires:
  - phase: 01-auth-01
    provides: Flutter project with Supabase client initialised from .env, GoRouter scaffold at /login and /home
provides:
  - AuthService with signIn(email, password) and signOut() wrappers around Supabase auth
  - LoginScreen with neo-brutalist old-money aesthetic (parchment, forest green, no rounded corners, no sign-up)
  - GoRouter wired to live Supabase auth state via _GoRouterRefreshStream (onAuthStateChange)
  - RLS migration SQL establishing the two-user constraint pattern (ready to apply in Supabase Dashboard)
affects:
  - 02-library (Supabase RLS migration must be applied and UIDs substituted before data access)
  - All subsequent phases (router auth-gate is live; auth session required to reach any non-login route)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - AuthService pattern: thin wrapper around Supabase.instance.client.auth, no state held
    - GoRouter live refresh: _GoRouterRefreshStream ChangeNotifier listens to onAuthStateChange stream
    - Error display pattern: on Exception catch (e) -> setState(_errorMessage) shown inline below password field
    - Neo-brutalist input pattern: OutlineInputBorder with BorderRadius.zero and 2px black border

key-files:
  created:
    - libm/lib/features/auth/auth_service.dart
    - libm/lib/features/auth/login_screen.dart
    - supabase/migrations/20260322000000_rls_two_users.sql
  modified:
    - libm/lib/core/router/app_router.dart

key-decisions:
  - "Used _GoRouterRefreshStream (ChangeNotifier wrapping onAuthStateChange stream) rather than GoRouterRefreshStream from go_router — the latter requires additional dependency; the inline class is self-contained and equivalent"
  - "RLS SQL uses placeholder UUIDs with REPLACE ME comments; active policies are commented out because the books table does not exist until Phase 2 — the file establishes the pattern and is the source of truth"
  - "Error message strips the 'Exception: ' prefix from Supabase AuthException toString() for cleaner UX"

patterns-established:
  - "Auth service pattern: lib/features/auth/auth_service.dart — thin Supabase wrapper, no ChangeNotifier, no Provider"
  - "Router refresh pattern: _GoRouterRefreshStream in app_router.dart listens to auth.onAuthStateChange"
  - "Neo-brutalist form pattern: OutlineInputBorder(borderRadius: BorderRadius.zero), filled white fields, Georgia serif"

requirements-completed:
  - AUTH-01
  - AUTH-02

# Metrics
duration: 2min
completed: 2026-03-22
---

# Phase 1 Plan 2: Auth Service, Login Screen, and RLS Migration Summary

**Supabase auth wired end-to-end: AuthService wraps signIn/signOut, LoginScreen renders in neo-brutalist parchment/forest-green aesthetic with no sign-up elements, GoRouter refreshes on onAuthStateChange, and RLS migration SQL documents the two-user constraint ready for manual application.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-22T21:43:40Z
- **Completed:** 2026-03-22T21:45:18Z
- **Tasks:** 2 (Task 3 is checkpoint — awaiting human verification)
- **Files modified:** 4

## Accomplishments
- Created AuthService with signIn/signOut methods wrapping Supabase auth; zero-dependency, no state management overhead
- Built LoginScreen matching PROJECT.md aesthetic: parchment background, forest green button, Georgia serif, zero border-radius, no sign-up elements anywhere
- Updated GoRouter to refresh on every Supabase auth event via _GoRouterRefreshStream — login and logout both trigger automatic route transitions
- Created RLS migration SQL with placeholder UIDs and commented-out policies (to be applied in Supabase Dashboard once UIDs are known)

## Task Commits

Each task was committed atomically:

1. **Task 1: AuthService and updated router with live auth state refresh** - `8fb685c` (feat)
2. **Task 2: Login screen UI and RLS migration** - `1666cb8` (feat)

**Plan metadata:** _(docs commit to follow after human verification)_

## Files Created/Modified
- `libm/lib/features/auth/auth_service.dart` - AuthService class with signIn/signOut/isLoggedIn
- `libm/lib/features/auth/login_screen.dart` - LoginScreen with neo-brutalist aesthetic, error display, no sign-up
- `libm/lib/core/router/app_router.dart` - Added _GoRouterRefreshStream and LoginScreen import; removed _LoginPlaceholder
- `supabase/migrations/20260322000000_rls_two_users.sql` - Two-user RLS pattern SQL with placeholder UIDs

## Decisions Made
- Implemented `_GoRouterRefreshStream` as an inline private class in `app_router.dart` rather than importing a third-party helper — self-contained, no additional dependency, functionally equivalent
- RLS policies are commented out in the migration because the `books` table doesn't exist yet; the file is the canonical source of truth and Phase 2 will uncomment/apply per-table policies
- `flutter analyze` passes with no issues on all created/modified files

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- During Task 1 verification, `flutter analyze` on `app_router.dart` alone reported `uri_does_not_exist` for the `login_screen.dart` import (Task 2's file). This is expected cross-task forward reference — resolved immediately when Task 2 created the file. Full analyze across all three files passes cleanly.

## User Setup Required

Before verifying (Task 3 checkpoint):

1. Add real Supabase credentials to `libm/.env`:
   ```
   SUPABASE_URL=https://your-actual-project.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key
   ```

2. Apply `supabase/migrations/20260322000000_rls_two_users.sql` in Supabase Dashboard > SQL Editor. Replace the two placeholder UUIDs with the real UIDs for both accounts (found at Authentication > Users).

3. Run: `cd libm && flutter run`

## Known Stubs
- `supabase/migrations/20260322000000_rls_two_users.sql` — RLS policies are commented out and UIDs are placeholders. Intentional: the `books` table does not exist until Phase 2. The file establishes the pattern. Phase 2 will apply active policies to the `books` table.

## Next Phase Readiness
- Auth gate is fully wired; any session change (sign-in or sign-out) triggers automatic router redirect
- No sign-up route exists anywhere in the codebase
- Phase 2 (library/bookshelf) can import `Supabase.instance.client` and expect auth to be enforced at the routing level
- Blocker for Phase 2: RLS migration must be applied in Supabase with real UIDs before data operations will work

---
*Phase: 01-auth*
*Completed: 2026-03-22*
