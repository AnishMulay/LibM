---
phase: 02-library
plan: 04
subsystem: ui
tags: [flutter, dart, reorderables, drag-reorder, supabase]

# Dependency graph
requires:
  - phase: 02-library
    provides: BookService.updatePositions, BookSpineWidget, LibraryScreen, books Supabase table
provides:
  - LibraryScreen with ReorderableWrap drag-reorder
  - BookSpineWidget with Material wrapper for drag elevation feedback
  - Optimistic reorder with Supabase persistence via BookService.updatePositions
affects:
  - 02-library (human verification checkpoint for full Phase 2 feature)
  - 03-wishlist (will use similar drag patterns)

# Tech tracking
tech-stack:
  added: [reorderables ^0.6.0 (already in pubspec)]
  patterns: [optimistic setState before async Supabase call, ValueKey(id) for drag tracking]

key-files:
  created: []
  modified:
    - libm/lib/features/library/library_screen.dart
    - libm/lib/features/library/widgets/book_spine_widget.dart

key-decisions:
  - "ReorderableWrap handles visual row wrapping automatically — no manual _chunk into rows needed"
  - "Optimistic UI: setState reorders _books immediately, updatePositions fires async without await"
  - "Material wrapper on BookSpineWidget enables drag elevation feedback from reorderables package"
  - "onTap removed from BookSpineWidget — tap navigation deferred to Phase 3 book detail view"

patterns-established:
  - "Optimistic reorder pattern: setState first, persist async — consistent with no-await fire-and-forget"
  - "ValueKey(model.id) on every drag child for stable ReorderableWrap tracking"

requirements-completed:
  - LIB-02

# Metrics
duration: 5min
completed: 2026-03-23
---

# Phase 02 Plan 04: Drag-Reorder Bookshelf Summary

**ReorderableWrap replaces static row chunking in LibraryScreen — long-press drag reorders book spines with optimistic setState and Supabase persistence via BookService.updatePositions**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-23T01:08:56Z
- **Completed:** 2026-03-23T01:13:00Z
- **Tasks:** 1 of 2 (Task 2 is human-verify checkpoint)
- **Files modified:** 2

## Accomplishments
- Replaced _chunk/ShelfWidget row layout with ReorderableWrap for native drag-to-reorder
- Added _handleReorder with optimistic setState + BookService.updatePositions fire-and-forget
- Wrapped BookSpineWidget in Material widget for drag elevation visual feedback
- Removed onTap/GestureDetector from BookSpineWidget (tap deferred to Phase 3)
- flutter analyze exits 0 with no issues

## Task Commits

Each task was committed atomically:

1. **Task 1: Integrate ReorderableWrap into LibraryScreen** - `cebf3ab` (feat)

**Plan metadata:** (pending after checkpoint resolution)

## Files Created/Modified
- `libm/lib/features/library/library_screen.dart` - ReorderableWrap with _handleReorder, removed _chunk
- `libm/lib/features/library/widgets/book_spine_widget.dart` - Material wrapper, removed onTap

## Decisions Made
- ReorderableWrap handles visual row wrapping automatically — no manual chunking needed
- Optimistic UI pattern: setState reorders immediately, updatePositions fires async (no await)
- Material wrapper enables drag elevation feedback provided by reorderables package
- onTap removed from BookSpineWidget since book detail view is Phase 3 scope

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**Database migration required before testing:**
1. Open Supabase Dashboard > SQL Editor
2. Paste contents of `supabase/migrations/20260322000001_books_table.sql`
3. Click Run
4. Confirm: `SELECT * FROM pg_policies WHERE tablename = 'books';` should return 4 rows

## Next Phase Readiness
- All Phase 2 library features built: bookshelf display, add book form with color picker, drag reorder
- Human verification checkpoint (Task 2) confirms full feature works end-to-end
- Phase 3 (wishlist) can begin after checkpoint passes
- Book detail view (tap on spine) left intentionally for Phase 3 as planned

---
*Phase: 02-library*
*Completed: 2026-03-23*
