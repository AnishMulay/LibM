---
phase: 03-wishlist-detail
plan: 01
subsystem: data-layer
tags: [flutter, dart, supabase, book-service, widget]

# Dependency graph
requires:
  - phase: 02-library
    provides: BookService, BookModel, BookSpineWidget baseline
provides:
  - BookService.fetchWishlist() — queries is_wishlist=true ordered by position asc
  - BookService.addWishlistBook() — inserts with is_wishlist=true at next wishlist position
  - BookService.moveToLibrary() — sets is_wishlist=false and appends to shelf
  - BookSpineWidget with optional onTap: VoidCallback? (null default)
  - spineAuthor at 14px (consolidated 4-size typography system)
affects: [03-02, 03-03, 03-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Optional callback widget pattern — VoidCallback? with GestureDetector wrap only when non-null
    - Wishlist position follows same append-to-end pattern as shelf position in addBook

key-files:
  created: []
  modified:
    - libm/lib/features/library/book_service.dart
    - libm/lib/features/library/widgets/book_spine_widget.dart
    - libm/lib/core/theme/app_text_styles.dart

key-decisions:
  - "GestureDetector wraps spine only when onTap is non-null — null path returns spine directly, existing LibraryScreen callers unaffected"
  - "moveToLibrary fetches shelf books to determine nextPosition — same append-to-end pattern as addBook"
  - "spineAuthor fontSize 11 -> 14 to match 4-size type scale (48/32/16/14) already in place for all other styles"

patterns-established:
  - "Optional onTap pattern: final VoidCallback? onTap; — wrap root widget in GestureDetector only when onTap != null"
  - "Wishlist position: fetchWishlist() then existing.last.position + 1 — mirrors library shelf position logic"

requirements-completed: [WISH-01, WISH-02, BOOK-01]

# Metrics
duration: 1min
completed: 2026-03-23
---

# Phase 03 Plan 01: Data Layer and Widget Foundation Summary

**Three BookService methods (fetchWishlist, addWishlistBook, moveToLibrary) plus onTap-capable BookSpineWidget and spineAuthor typography fix to 14px**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-03-23T02:27:06Z
- **Completed:** 2026-03-23T02:28:13Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- BookService extended with all three wishlist data methods needed by downstream Phase 3 plans
- BookSpineWidget accepts optional onTap for tap-to-navigate pattern used in wishlist and library detail views
- spineAuthor typography corrected to 14px — 4-size system now fully consistent across all text styles

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend BookService with fetchWishlist, addWishlistBook, and moveToLibrary** - `800d48a` (feat)
2. **Task 2: Add onTap to BookSpineWidget and fix spineAuthor typography** - `13d173f` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `libm/lib/features/library/book_service.dart` — Added fetchWishlist, addWishlistBook, moveToLibrary after updatePositions; no existing methods modified
- `libm/lib/features/library/widgets/book_spine_widget.dart` — Added VoidCallback? onTap field, GestureDetector conditional wrap in build()
- `libm/lib/core/theme/app_text_styles.dart` — spineAuthor fontSize 11 -> 14

## Decisions Made

- GestureDetector wraps spine only when onTap is non-null — the null path returns the spine Material widget directly, keeping existing LibraryScreen usage unchanged with no code changes required
- moveToLibrary determines next shelf position by fetching current shelf books and using last.position + 1, mirroring the addBook pattern exactly
- spineAuthor fixed from 11 to 14 to complete the UI-SPEC typography consolidation — now all text styles use only 48/32/16/14px

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All data methods downstream plans need are available: fetchWishlist (03-02 WishlistScreen), addWishlistBook (03-02 add sheet), moveToLibrary (03-02 move action)
- BookSpineWidget onTap ready for 03-03 (book detail navigation) and 03-02 (wishlist spine taps)
- No blockers for 03-02 through 03-04

---
*Phase: 03-wishlist-detail*
*Completed: 2026-03-23*
