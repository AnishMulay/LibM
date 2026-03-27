---
phase: 07-wishlist-book-detail
plan: 01
subsystem: ui
tags: [next.js, supabase, react, server-components, wishlist, bookshelf]

# Dependency graph
requires:
  - phase: 06-library-add-book
    provides: Bookshelf.tsx, BookSpine.tsx, BookSpineProps, bookRowToBook, LibraryShelf pattern
  - phase: 05-bookshelf-ui-components
    provides: Bookshelf component, wooden shelf visual
  - phase: 04-setup-auth
    provides: createClient() server utility, getUser() JWT pattern
provides:
  - /wishlist route — Server Component SSR-fetching is_wishlist=true books
  - WishlistShelf client wrapper with spine-tap navigation to /books/[id]
  - NEXT_PUBLIC_HER_UID env var documented in .env.example
  - UID-gated "+" add button (silent asymmetry pattern)
affects:
  - 07-02 (book detail)
  - 07-03 (wishlist add)
  - any plan touching /wishlist or WishlistShelf

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server Component SSR fetch + client wrapper pattern (page.tsx fetches, WishlistShelf.tsx handles interaction)
    - Silent asymmetry: showAddButton=false renders no button, no disabled state, no placeholder
    - NEXT_PUBLIC_ env var for UID comparison (client-accessible, used server-side for SSR gate)

key-files:
  created:
    - web/app/wishlist/page.tsx
    - web/components/bookshelf/WishlistShelf.tsx
  modified:
    - web/.env.example

key-decisions:
  - "WishlistShelf is a thin 'use client' wrapper — Server Component owns fetch and UID gate, client wrapper owns router.push navigation"
  - "Silent asymmetry: showAddButton=false renders nothing — no disabled state, no placeholder — as per D-06"
  - "Wishlist books ordered by created_at ascending (chronological, D-01) vs library which uses position"
  - "NEXT_PUBLIC_HER_UID compared server-side via process.env in Server Component — value available at render time"

patterns-established:
  - "Server Component SSR + client shell: page.tsx fetches and gates, WishlistShelf.tsx handles navigation via useRouter"
  - "UID gate pattern: user?.id === process.env.NEXT_PUBLIC_HER_UID produces boolean prop passed to client component"

requirements-completed: [WISH-01, WISH-02, WISH-03]

# Metrics
duration: 2min
completed: 2026-03-27
---

# Phase 7 Plan 01: Wishlist Shelf Summary

**SSR wishlist page with UID-gated add button and spine-tap navigation using Server Component + client wrapper pattern**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-27T01:52:38Z
- **Completed:** 2026-03-27T01:53:49Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- /wishlist route renders wooden bookshelf with is_wishlist=true books from Supabase, ordered chronologically
- Her UID (NEXT_PUBLIC_HER_UID) sees "+" button linking to /wishlist/add; his UID sees nothing (silent asymmetry)
- Tapping any book spine navigates to /books/[id] via WishlistShelf client wrapper
- Empty wishlist falls through to Bookshelf.tsx built-in empty state
- TypeScript strict mode passes clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Add NEXT_PUBLIC_HER_UID and create WishlistShelf** - `de4cef9` (feat)
2. **Task 2: Create /wishlist Server Component page** - `8fd6688` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `web/app/wishlist/page.tsx` - Async Server Component; SSR-fetches wishlist books, gates showAddButton to her UID, renders WishlistShelf
- `web/components/bookshelf/WishlistShelf.tsx` - 'use client' wrapper around Bookshelf; wires onTap via useRouter; conditionally renders "+" add button
- `web/.env.example` - Added NEXT_PUBLIC_HER_UID= with explanatory comment

## Decisions Made

- WishlistShelf is a thin client wrapper — all data fetching and auth logic stays in the Server Component page.tsx
- Silent asymmetry: when showAddButton=false, render nothing — no disabled button, no empty space placeholder (D-06)
- Wishlist ordered by created_at ascending (chronological wish order) vs library's position-based drag order

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

NEXT_PUBLIC_HER_UID must be set in Vercel environment variables (and local .env.local) with her Supabase user UUID. Without it, the "+" add button will never appear for anyone.

## Next Phase Readiness

- /wishlist route is live and functional
- Ready for Phase 7 Plan 02: Book detail view at /books/[id]
- Ready for Phase 7 Plan 03: Wishlist add form at /wishlist/add

---
*Phase: 07-wishlist-book-detail*
*Completed: 2026-03-27*

## Self-Check: PASSED

- web/.env.example: FOUND
- web/components/bookshelf/WishlistShelf.tsx: FOUND
- web/app/wishlist/page.tsx: FOUND
- 07-01-SUMMARY.md: FOUND
- Commit de4cef9: FOUND
- Commit 8fd6688: FOUND
