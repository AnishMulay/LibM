# Phase 2: Library - Context

**Gathered:** 2026-03-22 (discuss mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Visual bookshelf screen: users see all owned books as spines on wooden shelves, add new books manually (title, author, cover color, optional notes/review), and drag spines to reorder. Wishlist and book detail are Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Shelf Visual Design
- **D-01:** Shelf renders as a warm brown gradient Container with a thick dark horizontal lip at the bottom — illustrated wood, not a simple ruled line
- **D-02:** Fixed spine width — all spines are the same width (not variable by title length)
- **D-03:** Title text rotated 90° down the spine (vertical, like a real book spine); author text smaller beneath it
- **D-04:** Spines fill the row horizontally and wrap to a new shelf row when full; approximately 6–8 books per row based on screen width
- **D-05:** Empty state = one empty wooden shelf rendered, with a centered italic prompt ("Add your first book") in the old-money Georgia typeface — no books, shelf is still visible

### Add Book Flow
- **D-06:** Entry point is the app bar '+' button (top-right corner), not a FAB
- **D-07:** Tapping '+' navigates to a full-screen AddBookScreen route; user saves and is returned to the shelf
- **D-08:** Cover is a color picked from a fixed old-money palette of ~8 swatches: parchment, forest green, burgundy, navy, aged gold, charcoal, rust, cream — shown as tappable swatches
- **D-09:** No image upload in v1 — color palette only. LIB-03 mentioned "uploaded image" as an option but that is deferred to a future phase to keep scope simple

### Data Model & Order
- **D-10:** Supabase `books` table with an integer `position` column for ordering; on drag reorder, update positions of all affected books in one operation
- **D-11:** Single `books` table with an `is_wishlist` boolean column (default `false` = on shelf, `true` = on wishlist); Phase 3 filters by this column — no additional migration needed in Phase 3
- **D-12:** Supabase RLS on the books table follows the two-UID constraint established in Phase 1 (see canonical refs below)

### Claude's Discretion
- State management approach: continue with StatefulWidget + direct Supabase calls, matching the auth pattern. No Riverpod/Provider this phase.
- Drag-and-drop package selection (e.g., flutter_reorderable_gridview, ReorderableListView, or custom)
- Exact shelf row height and spine dimensions in pixels
- Loading state / skeleton while books fetch from Supabase

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — LIB-01, LIB-02, LIB-03 define the library requirements; note D-09 above overrides the "uploaded image" option in LIB-03 for v1

### RLS & Schema
- `supabase/migrations/20260322000000_rls_two_users.sql` — Phase 1 RLS migration with placeholder UUIDs and commented-out active policies; this file must be updated when the `books` table is created to activate the two-UID constraint on the new table

### Aesthetic Reference (existing code)
- `libm/lib/features/auth/login_screen.dart` — defines the canonical color constants and style patterns that Phase 2 must extend: parchment (`0xFFF5F0E8`), forestGreen (`0xFF2D4A3E`), Georgia font, `BorderRadius.zero`, 2px black borders

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Color constants from `login_screen.dart`: `parchment = Color(0xFFF5F0E8)`, `forestGreen = Color(0xFF2D4A3E)` — extract to a shared theme file or constants file this phase
- `OutlineInputBorder(borderRadius: BorderRadius.zero, borderSide: BorderSide(color: Colors.black87, width: 2))` — the canonical input border pattern; reuse on add-book form fields
- `ElevatedButton` style with `shape: RoundedRectangleBorder(borderRadius: BorderRadius.zero)` and `side: BorderSide(color: Colors.black87, width: 2)` — reuse for save button on add-book form

### Established Patterns
- StatefulWidget with `setState` for local UI state; direct `Supabase.instance.client` calls for data
- GoRouter for navigation: add `/add-book` route to `app_router.dart`
- Georgia font family throughout — no system fonts for headings or labels

### Integration Points
- `HomeScreen` at `/home` route becomes (or is replaced by) `LibraryScreen` — update `app_router.dart`
- `Supabase.instance.client` for all database reads/writes (books table CRUD, position updates)
- `app_router.dart` — add `/add-book` route pointing to `AddBookScreen`

</code_context>

<specifics>
## Specific Ideas

- No image upload for v1 — user explicitly simplified: "Color palette only. Keep it simple."
- The old-money palette for swatches should feel cohesive with the existing UI (parchment, forest green already defined)
- Empty state: render an actual wooden shelf even when empty — the shelf metaphor should be present from the start

</specifics>

<deferred>
## Deferred Ideas

- **Image upload for book covers** — LIB-03 mentioned "color or uploaded image"; image upload is explicitly deferred to a future phase. Would require image_picker package + Supabase Storage setup.

### Reviewed Todos (not folded)
None — no matching todos found.

</deferred>

---

*Phase: 02-library*
*Context gathered: 2026-03-22*
