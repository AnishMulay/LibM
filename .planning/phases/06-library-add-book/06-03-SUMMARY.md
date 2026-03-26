---
phase: 06-library-add-book
plan: 03
subsystem: ui
tags: [nextjs, supabase, react, tailwind, forms]

# Dependency graph
requires:
  - phase: 06-01
    provides: "BookRow type, bookRowToBook() converter, Supabase browser client"
  - phase: 06-02
    provides: "Library page with + button linking to /library/add"
provides:
  - "/library/add full-page add-book form with swatch picker and Supabase insert"
affects: [06-04, wishlist-phase]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client component with useRouter for post-action navigation"
    - "Inline onFocus/onBlur border-color transitions (Tailwind cannot conditionally apply gold border without JS)"
    - "Position=max+1 query pattern for appending books to shelf end"
    - "Validate-on-submit pattern: errors shown only on Save click, not on change"

key-files:
  created:
    - web/app/library/add/page.tsx
  modified: []

key-decisions:
  - "Validate on submit only (not on change) — less friction for quick form fill"
  - "Position fetched via max(existing)+1 query to append new books at shelf end without reordering"
  - "Cover color required field — prevents books appearing with no color on the shelf"
  - "saveError shown as top-of-form alert; form stays open on Supabase failure"

patterns-established:
  - "AddBookPage: 'use client' + useState for form fields + supabase.auth.getUser() before insert"
  - "COVER_COLORS constant array pattern: { label, hex } — reusable for wishlist add-book if added later"

requirements-completed: [BOOK-01, BOOK-02]

# Metrics
duration: 3min
completed: 2026-03-25
---

# Phase 6 Plan 03: Add Book Form Summary

**Full-page /library/add form with 8 old-money color swatches, inline validation, and Supabase insert routing user back to /library on success (BOOK-01 + BOOK-02)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-25T00:00:00Z
- **Completed:** 2026-03-25T00:03:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- `/library/add` page with title, author, 8-swatch color picker, and optional notes fields
- Inline validation: "Title is required" / "Author is required" / "Cover color is required" shown above fields without submitting
- Supabase insert with `is_wishlist: false` and `position = max(existing) + 1` to append to shelf end
- `router.push('/library')` on successful save (BOOK-02: library SSR re-fetch shows new book) and cancel
- Save/Cancel buttons disabled with "Saving..." label while request is in-flight
- "Failed to save. Please try again." top-of-form error on Supabase failure with form staying open

## Task Commits

1. **Task 1: Build add-book form page with swatch picker and Supabase insert** - `5c0475d` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `web/app/library/add/page.tsx` - Client component: /library/add route with form fields, 8-swatch color picker, validation, Supabase insert, navigation

## Decisions Made

- Validate-on-submit only (not on change) — reduces friction for quick form fill, shows errors only when user attempts to save
- Position determined by `SELECT position FROM books WHERE is_wishlist=false ORDER BY position DESC LIMIT 1` — simple max+1 appends without reordering existing books
- Cover color required (validation error shown) — a book with no cover color would render incorrectly on the BookSpine component
- onFocus/onBlur inline style overrides for gold border — Tailwind cannot dynamically apply border colors based on focus state without JS when border value must change conditionally based on error state

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Add Book flow complete (BOOK-01, BOOK-02 fulfilled)
- Ready for Phase 06-04: any remaining phase 06 work (or phase transition)
- New book appears immediately on /library because that page is SSR and re-fetches from Supabase on navigation

---
*Phase: 06-library-add-book*
*Completed: 2026-03-25*
