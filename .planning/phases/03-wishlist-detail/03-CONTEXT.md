# Phase 3: Wishlist & Detail - Context

**Gathered:** 2026-03-22 (discuss mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Wishlist screen (her books she wants, spine-on-shelf view, she adds, he acts), move-to-library action, book detail view (all fields, read-only), and cross-platform delivery on iOS and Android. Image upload, editing books, and drag-reorder on wishlist are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Wishlist Screen Layout
- **D-01:** Wishlist renders as the same spine-on-shelf visual as the library (ShelfWidget + BookSpineWidget reused), filtered to `is_wishlist = true`
- **D-02:** No drag-to-reorder on wishlist — books display in chronological order (by `created_at` ascending or `position` ascending as set at insert time)
- **D-03:** Empty state follows library pattern: one empty wooden shelf with italic prompt ("Her wishlist is empty" or similar)

### Wishlist Permissions
- **D-04:** The '+' add button is conditionally rendered — visible only when the logged-in user is her account (her UID). He sees the wishlist screen with no add affordance at all — no disabled button, no label. Her UID is checked at render time via `Supabase.instance.client.auth.currentUser`
- **D-05:** He can still tap wishlist spines to open the book detail view and act on them (move to library)

### Move-to-Library Action
- **D-06:** Move-to-library lives exclusively in the book detail view — no inline action on the spine widget
- **D-07:** When viewing a wishlist book in detail, a prominent "Move to Library" button is shown at the bottom of the screen. When viewing a shelf book, no such button appears (detail is context-aware based on the book's `is_wishlist` flag)
- **D-08:** Moving a book to library sets `is_wishlist = false` in Supabase and assigns it the next position on the shelf (same position logic as `addBook` in `BookService`). After action completes, navigate back to the wishlist screen (not the library)

### Book Detail View
- **D-09:** Full-screen route (not a modal/bottom sheet) — consistent with AddBookScreen navigation pattern
- **D-10:** Read-only display of all fields: cover swatch (rendered as a color block), title, author, notes (shown if present, hidden if null). No inline editing
- **D-11:** Navigation: tapping any book spine (on shelf OR wishlist) opens the detail view. `BookSpineWidget` gets an `onTap` callback wired to `context.push('/book-detail', extra: book)`. GoRouter receives the `BookModel` via the `extra` parameter
- **D-12:** "Move to Library" button shown only when `book.isWishlist == true`. The button follows the same ElevatedButton style as other buttons in the app (no border radius, black border)

### Claude's Discretion
- Exact visual layout and spacing of the detail screen (cover size, field spacing, typography hierarchy)
- Whether to use `context.push` or `context.go` for navigation back after move-to-library
- Loading/error states on the move action
- How to handle the wishlist add flow — same `AddBookScreen` route with `is_wishlist: true` passed in, or a separate screen (Claude decides)
- Cross-platform parity: standard Flutter builds for iOS and Android — no special decisions needed beyond ensuring no platform-specific APIs are used

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — WISH-01, WISH-02, BOOK-01, PLAT-01 define Phase 3 requirements

### Schema
- `supabase/migrations/20260322000000_rls_two_users.sql` — existing RLS migration; no new migration needed for Phase 3 (is_wishlist column already exists in books table per D-11 from Phase 2)

### Existing Code to Read Before Planning
- `libm/lib/features/library/book_model.dart` — BookModel with `isWishlist` field already present
- `libm/lib/features/library/book_service.dart` — BookService: `fetchBooks()` filters `is_wishlist=false`; Phase 3 needs `fetchWishlist()` and `moveToLibrary()` methods
- `libm/lib/features/library/library_screen.dart` — Pattern for shelf screen; WishlistScreen mirrors this
- `libm/lib/features/library/widgets/book_spine_widget.dart` — `onTap` removed in Phase 2; Phase 3 adds it back
- `libm/lib/features/library/widgets/shelf_widget.dart` — Reusable ShelfWidget for wishlist screen
- `libm/lib/core/router/app_router.dart` — Add `/wishlist`, `/book-detail` routes
- `libm/lib/core/theme/app_colors.dart` — Canonical colors for detail screen styling

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ShelfWidget` + `BookSpineWidget`: already built and styled — wishlist screen reuses both with `is_wishlist=true` filtered list
- `BookService.addBook()`: position logic (max + 1) reused for `moveToLibrary()` to append to shelf end
- `AppColors`, `AppTextStyles`: all color/font constants available for detail screen
- `AddBookScreen`: same route pattern for adding wishlist books (`is_wishlist: true`)
- `ElevatedButton` style with `BorderRadius.zero` + black border: canonical button pattern for "Move to Library"

### Established Patterns
- StatefulWidget + `setState` + direct `Supabase.instance.client` calls — no Riverpod/Provider
- GoRouter `context.push()` for navigation; `extra` parameter for passing objects between routes
- App bar '+' button (not FAB) as entry point for add actions
- `Supabase.instance.client.auth.currentUser!.id` for user identity checks
- Georgia font, `BorderRadius.zero`, 2px black borders, parchment background — all neo-brutalist old-money aesthetic

### Integration Points
- `app_router.dart`: add `/wishlist` route (WishlistScreen) and `/book-detail` route (BookDetailScreen with `extra: BookModel`)
- `BookService`: add `fetchWishlist()`, `addWishlistBook()`, and `moveToLibrary(String bookId)` methods
- `BookSpineWidget`: add `onTap` callback parameter (was removed in Phase 2, deferred to here)
- Navigation from library/wishlist to detail: pass `BookModel` via GoRouter `extra`
- Bottom navigation or tab routing between Library and Wishlist screens (needs routing decision — Claude's discretion)

</code_context>

<specifics>
## Specific Ideas

- Wishlist shelf has no drag — chronological order only (she adds in the order she wants them)
- He has no add button visible at all — the asymmetry is silent, not labeled
- "Move to Library" is only in the detail view, not on the spine
- Detail view is read-only — no editing path from detail

</specifics>

<deferred>
## Deferred Ideas

- **Book editing** — no edit path from detail view; editing would be a future phase
- **Image upload for covers** — explicitly deferred from Phase 2; not in Phase 3 scope either

### Reviewed Todos (not folded)
None — no matching todos found.

</deferred>

---

*Phase: 03-wishlist-detail*
*Context gathered: 2026-03-22*
