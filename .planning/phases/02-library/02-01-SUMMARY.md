---
phase: 02-library
plan: 01
subsystem: database, ui
tags: [flutter, supabase, rls, dart, postgresql, theme]

# Dependency graph
requires:
  - phase: 01-auth
    provides: Supabase client pattern (Supabase.instance.client), RLS migration with two UIDs, auth user IDs
provides:
  - AppColors with full old-money palette (8 cover swatches, shelf wood colors)
  - AppTextStyles with Georgia serif scale (display, heading, body, label, spineTitle, spineAuthor)
  - books table migration with 9 columns and 4 active RLS policies
  - BookModel (fromJson/toInsertJson)
  - BookService (fetchBooks, addBook, updatePositions)
  - reorderables ^0.6.0 dependency for drag-reorder UI
affects: [02-02, 02-03, 02-04, all library screens, wishlist, book detail]

# Tech tracking
tech-stack:
  added: [reorderables ^0.6.0]
  patterns: [shared AppColors/AppTextStyles constants — screens import from core/theme, BookService direct Supabase.instance.client pattern matching AuthService]

key-files:
  created:
    - libm/lib/core/theme/app_colors.dart
    - libm/lib/core/theme/app_text_styles.dart
    - libm/lib/features/library/book_model.dart
    - libm/lib/features/library/book_service.dart
    - supabase/migrations/20260322000001_books_table.sql
  modified:
    - libm/pubspec.yaml

key-decisions:
  - "AppColors is abstract class not enum — allows const access (AppColors.parchment) without instantiation"
  - "BookService.fetchBooks filters is_wishlist=false — wishlist books are fetched separately by future plan"
  - "books table migration uses EXECUTE format() for policies to inline UIDs — same pattern as Phase 1 RLS migration"
  - "coverColor stored as hex string TEXT in DB — Flutter parses at render time, no extra column needed"

patterns-established:
  - "Theme pattern: all screens import AppColors/AppTextStyles from lib/core/theme/ — no local color/style definitions"
  - "Service pattern: BookService follows AuthService pattern with final _client = Supabase.instance.client"
  - "Migration pattern: DO $$ DECLARE block with EXECUTE format() for dynamic policy creation with inlined UIDs"

requirements-completed: [LIB-01, LIB-02, LIB-03]

# Metrics
duration: 2min
completed: 2026-03-23
---

# Phase 2 Plan 1: Data Foundation Summary

**Shared AppColors/AppTextStyles + Supabase books table with 4 active RLS policies + BookModel/BookService using reorderables — data layer ready for all Phase 2 screens**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-23T00:58:54Z
- **Completed:** 2026-03-23T01:01:06Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Created shared AppColors (parchment, forestGreen, darkRed, 8 cover swatches, shelf wood gradient stops) and AppTextStyles (Georgia serif, 8 style roles including spineTitle/spineAuthor) in lib/core/theme/
- Created books table migration with 9 columns (id, user_id, title, author, cover_color, notes, position, is_wishlist, created_at) and 4 active RLS policies restricting access to the same two UIDs from Phase 1
- Created BookModel (fromJson/toInsertJson), BookService (fetchBooks/addBook/updatePositions), added reorderables ^0.6.0 to pubspec

## Task Commits

Each task was committed atomically:

1. **Task 1: Shared theme — AppColors and AppTextStyles** - `4198f5d` (feat)
2. **Task 2: Books table migration with active RLS** - `0fe9267` (feat)
3. **Task 3: BookModel, BookService, and reorderables dependency** - `d179cac` (feat)

**Plan metadata:** _(pending docs commit)_

## Files Created/Modified

- `libm/lib/core/theme/app_colors.dart` - Canonical color constants: parchment, forestGreen, darkRed, 8 cover swatches, shelf wood gradient
- `libm/lib/core/theme/app_text_styles.dart` - Georgia serif text style scale for all screen roles
- `libm/lib/features/library/book_model.dart` - BookModel data class with fromJson/toInsertJson for books table rows
- `libm/lib/features/library/book_service.dart` - BookService with fetchBooks/addBook/updatePositions using Supabase client
- `supabase/migrations/20260322000001_books_table.sql` - books table DDL + 4 active RLS policies (SELECT/INSERT/UPDATE/DELETE)
- `libm/pubspec.yaml` - Added reorderables ^0.6.0

## Decisions Made

- AppColors uses abstract class pattern (not enum) to allow `const` field access without instantiation
- `fetchBooks` filters `is_wishlist=false` — wishlist fetch will be added separately in the wishlist plan
- Migration uses `EXECUTE format()` with inlined UIDs matching the Phase 1 RLS pattern
- `coverColor` stored as hex TEXT string — Flutter parses at render time

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unnecessary cast in BookService.addBook**
- **Found during:** Task 3 (BookModel, BookService, and reorderables dependency)
- **Issue:** `inserted as Map<String, dynamic>` was flagged as unnecessary cast by flutter analyze — `.single()` already returns `Map<String, dynamic>`
- **Fix:** Removed the redundant cast: `BookModel.fromJson(inserted)`
- **Files modified:** libm/lib/features/library/book_service.dart
- **Verification:** `flutter analyze lib/core/theme/ lib/features/library/` — no issues found
- **Committed in:** `d179cac` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug/unnecessary cast)
**Impact on plan:** Minor cleanup. No scope creep. All acceptance criteria met.

## Issues Encountered

None — all three tasks executed as written after the unnecessary cast fix.

## User Setup Required

**External service configuration required.** Apply the migration manually:

1. Open Supabase Dashboard > SQL Editor
2. Paste contents of `supabase/migrations/20260322000001_books_table.sql`
3. Click Run
4. Verify with:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'books';
   -- Expected: 4 rows (two_users_only_select, insert, update, delete)
   SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'books';
   -- Expected: 9 columns
   ```

## Next Phase Readiness

- AppColors and AppTextStyles ready for import in all Phase 2 screens
- BookService ready for use by library screen (Plan 02-02), wishlist screen (Plan 02-04), and detail screen (Plan 02-03)
- reorderables available for drag-reorder in Plan 02-02
- books table migration must be applied in Supabase Dashboard before Plan 02-02 can fetch data

## Self-Check: PASSED

All created files confirmed present. All task commits verified in git log.

---
*Phase: 02-library*
*Completed: 2026-03-23*
