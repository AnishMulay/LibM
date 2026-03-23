# Milestones

## v1.0 MVP (Shipped: 2026-03-23)

**Phases completed:** 3 phases, 10 plans, 21 tasks

**Key accomplishments:**

- Flutter project scaffolded with supabase_flutter, go_router, and flutter_dotenv; Supabase initialised from .env before runApp; GoRouter enforces /login for unauthenticated and /home for authenticated sessions with no sign-up route.
- Supabase auth wired end-to-end: AuthService wraps signIn/signOut, LoginScreen renders in neo-brutalist parchment/forest-green aesthetic with no sign-up elements, GoRouter refreshes on onAuthStateChange, and RLS migration SQL documents the two-user constraint ready for manual application.
- Shared AppColors/AppTextStyles + Supabase books table with 4 active RLS policies + BookModel/BookService using reorderables — data layer ready for all Phase 2 screens
- Visual bookshelf screen built with ShelfWidget (wood gradient + dark lip), BookSpineWidget (56x200px, hex background, rotated Georgia text), and LibraryScreen wired to router at /home with loading/empty/error states.
- ColorPickerWidget (8 old-money swatches) + AddBookScreen form with validation and Supabase insert, /add-book route wired to replace stub
- ReorderableWrap replaces static row chunking in LibraryScreen — long-press drag reorders book spines with optimistic setState and Supabase persistence via BookService.updatePositions
- Three BookService methods (fetchWishlist, addWishlistBook, moveToLibrary) plus onTap-capable BookSpineWidget and spineAuthor typography fix to 14px
- BookDetailScreen with cover swatch (120x160), full book fields, wishlist-gated Move to Library button, and all routes wired via GoRouter extras
- End-to-end verified on both physical devices: wishlist add/view, book detail, move-to-library, and cross-platform parity (iOS + Android) all confirmed working with no regressions.

---
