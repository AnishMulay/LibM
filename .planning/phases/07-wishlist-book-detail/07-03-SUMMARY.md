---
phase: 07-wishlist-book-detail
plan: 03
subsystem: ui
tags: [nextjs, supabase, react, client-component, wishlist]

# Dependency graph
requires:
  - phase: 06-library-add-book
    provides: web/app/books/[id]/page.tsx Server Component with notFound(), bookRowToBook(), book detail layout
  - phase: 07-wishlist-book-detail
    provides: Book.isWishlist field in types/book.ts, wishlist route at /wishlist

provides:
  - MoveToLibraryButton client component that moves a wishlist book to the library in one tap
  - Conditional back link on /books/[id]: "← Wishlist" for wishlist books, "← Library" for library books
  - Conditional MoveToLibraryButton render on /books/[id] for wishlist books only

affects: [07-wishlist-book-detail, future-phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Client component wrapping a Supabase browser mutation with loading/error state, following add-book pattern
    - Conditional Server Component rendering based on book.isWishlist for context-aware navigation

key-files:
  created:
    - web/components/bookshelf/MoveToLibraryButton.tsx
  modified:
    - web/app/books/[id]/page.tsx

key-decisions:
  - "Navigate to /wishlist after move (not /library) — user remains in wishlist-management flow (D-14)"
  - "No confirmation dialog for move action — one tap triggers move (D-11)"
  - "Fetch max library position before move to append book at end of library shelf"

patterns-established:
  - "Supabase browser mutation pattern: createClient() (not async), loading/error state, navigate on success"

requirements-completed:
  - DETAIL-01
  - DETAIL-02

# Metrics
duration: 1min
completed: 2026-03-27
---

# Phase 7 Plan 03: Wishlist Book Detail — Move to Library Summary

**Conditional back link (Wishlist/Library) and one-tap MoveToLibraryButton client component on /books/[id]**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-27T01:52:45Z
- **Completed:** 2026-03-27T01:54:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created MoveToLibraryButton client component with forest-green styling, loading/error states, and Supabase mutation
- Extended /books/[id] with isWishlist-conditional back link ("← Library" vs "← Wishlist")
- Wishlist books now show MoveToLibraryButton below notes; library books show nothing new (Phase 6 behavior unchanged)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MoveToLibraryButton client component** - `3aa2f15` (feat)
2. **Task 2: Extend /books/[id] with conditional back link and MoveToLibraryButton** - `4d47884` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `web/components/bookshelf/MoveToLibraryButton.tsx` - Client component: fetches max library position, updates is_wishlist=false + position=max+1, navigates to /wishlist, shows burgundy error on failure
- `web/app/books/[id]/page.tsx` - Added conditional back link href/text based on book.isWishlist, import and conditional render of MoveToLibraryButton

## Decisions Made
- Navigate to /wishlist after successful move (D-14) — user stays in wishlist-management context
- No confirmation dialog (D-11) — one tap triggers move, consistent with plan spec
- Max position fetch pattern mirrors add-book pattern from Phase 6

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- DETAIL-01 (read-only detail view with correct back link) complete
- DETAIL-02 (move to library action) complete
- Phase 7 book detail plans done; remaining plans cover wishlist screen and add-to-wishlist flow

---
*Phase: 07-wishlist-book-detail*
*Completed: 2026-03-27*

## Self-Check: PASSED
- FOUND: web/components/bookshelf/MoveToLibraryButton.tsx
- FOUND: web/app/books/[id]/page.tsx
- FOUND: .planning/phases/07-wishlist-book-detail/07-03-SUMMARY.md
- FOUND commits: 3aa2f15, 4d47884
