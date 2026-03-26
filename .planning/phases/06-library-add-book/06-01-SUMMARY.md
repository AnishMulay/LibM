---
phase: 06-library-add-book
plan: 01
subsystem: ui
tags: [typescript, dnd-kit, supabase, types, drag-and-drop]

# Dependency graph
requires:
  - phase: 05-bookshelf-ui-components
    provides: BookSpine component with BookSpineProps shape (coverColor, title, author) that Book type aligns to
  - phase: 02-backend-infra
    provides: Supabase books table schema with snake_case column names
provides:
  - Shared Book TypeScript interface (camelCase) for all Phase 6 components
  - BookRow TypeScript interface (snake_case) matching raw Supabase query responses
  - bookRowToBook converter function for transforming Supabase responses
  - dnd-kit packages installed (@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities)
affects: [06-02-library-page, 06-03-add-book-form, 06-04-book-detail]

# Tech tracking
tech-stack:
  added:
    - "@dnd-kit/core ^6.3.1 — DndContext, DragOverlay, sensors for drag-and-drop"
    - "@dnd-kit/sortable ^10.0.0 — SortableContext, useSortable, arrayMove"
    - "@dnd-kit/utilities ^3.2.2 — CSS.Transform.toString utility"
  patterns:
    - "Dual-type pattern: camelCase Book interface for components, snake_case BookRow for Supabase responses, converter function bridges them"

key-files:
  created:
    - web/types/book.ts
  modified:
    - web/package.json
    - web/package-lock.json

key-decisions:
  - "Dual interface approach (Book + BookRow): Supabase JS v2 does NOT auto-convert snake_case to camelCase — explicit mapping via bookRowToBook converter is the correct pattern"
  - "camelCase Book fields aligned to BookSpineProps convention (coverColor, isWishlist) so components consume Book directly without field remapping"

patterns-established:
  - "Type conversion pattern: BookRow (raw Supabase) -> bookRowToBook() -> Book (component-ready)"
  - "All Phase 6 components import Book from '@/types/book' — single source of truth"

requirements-completed: [LIB-03, LIB-04, BOOK-01, BOOK-02]

# Metrics
duration: 1min
completed: 2026-03-26
---

# Phase 06 Plan 01: Shared Book Type and dnd-kit Installation Summary

**Shared Book/BookRow TypeScript interfaces with Supabase snake_case converter, plus dnd-kit drag-and-drop library installed for Phase 6 library reorder feature**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-26T02:58:59Z
- **Completed:** 2026-03-26T03:00:06Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `web/types/book.ts` with dual interface pattern: `Book` (camelCase for components) and `BookRow` (snake_case matching Supabase columns)
- Added `bookRowToBook()` converter function that maps Supabase query responses to component-ready Book objects
- Installed `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` — all downstream Phase 6 plans can import drag-and-drop primitives without additional setup
- TypeScript compilation (`npx tsc --noEmit`) passes with no errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Create shared Book type** - `010e414` (feat)
2. **Task 2: Install dnd-kit packages** - `839ad34` (chore)

## Files Created/Modified

- `web/types/book.ts` — Book interface (camelCase), BookRow interface (snake_case), bookRowToBook converter
- `web/package.json` — Added @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities dependencies
- `web/package-lock.json` — Updated lockfile after dnd-kit install

## Decisions Made

- **Dual interface approach:** Supabase JS v2 does not auto-convert snake_case columns to camelCase. The `BookRow` interface captures the raw response shape; `Book` provides the camelCase shape that aligns with existing `BookSpineProps` (coverColor, not cover_color). The `bookRowToBook` converter bridges them explicitly.
- **Field name alignment:** `coverColor`, `isWishlist`, `createdAt` in `Book` were chosen to exactly match `BookSpineProps.coverColor` already established in Phase 5, ensuring components can pass Book fields to BookSpine without renaming.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `web/types/book.ts` is ready for import: `import { Book, BookRow, bookRowToBook } from '@/types/book'`
- dnd-kit is installed: Plans 02-04 can `import { DndContext } from '@dnd-kit/core'` without additional install steps
- No blockers for Phase 6 plans 02, 03, or 04

---
*Phase: 06-library-add-book*
*Completed: 2026-03-26*
