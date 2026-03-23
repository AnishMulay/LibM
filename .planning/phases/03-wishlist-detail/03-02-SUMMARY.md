---
phase: 03-wishlist-detail
plan: 02
subsystem: wishlist-ui
tags: [flutter, wishlist, screen, add-book]
dependency_graph:
  requires: [03-01]
  provides: [WishlistScreen, AddBookScreen.isWishlist]
  affects: [libm/lib/features/wishlist/, libm/lib/features/library/add_book_screen.dart]
tech_stack:
  added: []
  patterns: [StatefulWidget-fetch-pattern, UID-gated-button, Wrap-no-reorder]
key_files:
  created:
    - libm/lib/features/wishlist/wishlist_screen.dart
  modified:
    - libm/lib/features/library/add_book_screen.dart
decisions:
  - Her UID (67981be5) hardcoded as const in WishlistScreen — runtime check against currentUser.id gates the add button
  - Empty state rendered manually (not ShelfWidget.isEmpty) — ShelfWidget shows "Add your first book" but UI-SPEC requires "Her wishlist is empty"
  - Wrap used (not ReorderableWrap) — wishlist has no drag reorder per plan decision D-02
  - AddBookScreen.isWishlist defaults false — existing /add-book route (const AddBookScreen()) continues to work without modification
metrics:
  duration: "~5min"
  completed_date: "2026-03-23"
  tasks: 2
  files_changed: 2
---

# Phase 03 Plan 02: WishlistScreen and AddBookScreen Wishlist Support Summary

WishlistScreen with UID-gated add button, manual empty-state shelf, and Wrap-based spine display; AddBookScreen extended with isWishlist parameter routing to addWishlistBook.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create WishlistScreen | 4b1e2ea | libm/lib/features/wishlist/wishlist_screen.dart (created) |
| 2 | Extend AddBookScreen for isWishlist | ce203d0 | libm/lib/features/library/add_book_screen.dart (modified) |

## What Was Built

### Task 1: WishlistScreen

New screen at `libm/lib/features/wishlist/wishlist_screen.dart`:

- Mirrors LibraryScreen structure: StatefulWidget, `_loading`/`_error`/`_books`, `initState` calls `_loadWishlist()`
- Loads from `BookService.fetchWishlist()` — is_wishlist=true, position asc
- Loading state: `CircularProgressIndicator(color: AppColors.forestGreen)`
- Error state: error text + retry IconButton
- Empty state: manual shelf Container with wood gradient + "Her wishlist is empty" in `AppTextStyles.labelMuted` (italic, muted)
- Filled state: `Wrap(spacing: 4, runSpacing: 32)` with `BookSpineWidget` for each book — onTap pushes `/book-detail` with book as extra
- Her UID (`67981be5-832f-44d4-bd45-a8a331565891`) stored as `const _herUid`; `_isHer` getter compares against `currentUser?.id`
- Add button visible only when `_isHer` — pushes `/add-book` with `extra: {'isWishlist': true}`
- Sign-out button always visible

### Task 2: AddBookScreen extended

Changes to `libm/lib/features/library/add_book_screen.dart`:

- Added `final bool isWishlist` with default `false` — backward-compatible with existing `const AddBookScreen()`
- `_handleSave` branches: `addWishlistBook(...)` when `widget.isWishlist`, `addBook(...)` otherwise
- AppBar title: `widget.isWishlist ? 'Add to Wishlist' : 'Add Book'`
- All validation, field layout, color picker, and save button logic unchanged

## Decisions Made

- **Her UID as const:** Compile-time constant is simplest approach; UID is fixed per RLS migration and never changes.
- **Empty state without ShelfWidget.isEmpty:** ShelfWidget's isEmpty prop shows "Add your first book" which contradicts UI-SPEC. Manual Container with gradient and "Her wishlist is empty" is cleaner.
- **Wrap not ReorderableWrap:** Wishlist has no drag-reorder affordance per plan decision D-02.
- **isWishlist defaults false:** Preserves existing library route without touching app_router.dart in this plan.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — WishlistScreen is fully wired to BookService.fetchWishlist() and AddBookScreen is wired to addWishlistBook(). The GoRouter route for /add-book still uses `const AddBookScreen()` (isWishlist=false by default); routing with extra={'isWishlist': true} will be wired in Plan 03 (app_router.dart update).

## Self-Check: PASSED

- libm/lib/features/wishlist/wishlist_screen.dart: FOUND
- libm/lib/features/library/add_book_screen.dart: FOUND
- Commit 4b1e2ea (Task 1): FOUND
- Commit ce203d0 (Task 2): FOUND
