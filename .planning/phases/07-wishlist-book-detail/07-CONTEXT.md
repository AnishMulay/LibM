# Phase 7: Wishlist + Book Detail - Context

**Gathered:** 2026-03-26 (discuss mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Wishlist screen at `/wishlist` showing her wishlist books on the same wooden bookshelf visual (no drag reorder); only her account sees an "Add to Wishlist" button; tapping a wishlist spine opens the shared `/books/[id]` detail page extended with a "← Wishlist" back link and a "Move to Library" action. This phase does NOT include: drag reorder on wishlist, book editing, image uploads, or Vercel deployment (separate concern).

</domain>

<decisions>
## Implementation Decisions

### Wishlist Screen
- **D-01:** Route is `/wishlist`. Server Component fetches books where `is_wishlist = true`, ordered by `created_at` ascending (chronological — she adds in the order she wants them; Phase 3 D-02).
- **D-02:** Renders the static `Bookshelf.tsx` component (no drag). `LibraryShelf.tsx` is NOT used — no dnd-kit wrapper needed.
- **D-03:** Empty state inherits from `Bookshelf.tsx`'s existing empty fallback. No custom wishlist-specific empty state required.
- **D-04:** Tapping a spine navigates to `/books/[book.id]` — same route as library detail. Bookshelf's `onTap` prop wired to `router.push` (need a thin client wrapper around the static Bookshelf for the tap handler, same pattern as LibraryShelf but simpler).

### UID Gating ("Add" button)
- **D-05:** Her UID stored in `NEXT_PUBLIC_HER_UID` environment variable. Add to `web/.env.local` and `web/.env.example` alongside existing Supabase credentials.
- **D-06:** Wishlist page (Server Component) calls `supabase.auth.getUser()`, compares `user.id === process.env.NEXT_PUBLIC_HER_UID`. If true: render "+" add button. If false: render nothing — no disabled state, no label (silent asymmetry; Phase 3 D-04).
- **D-07:** "Add to Wishlist" button navigates to `/wishlist/add`. Same 48×48px aged-gold button style as `/library` header button.

### Wishlist Add Form
- **D-08:** New route `/wishlist/add`. Same form fields as `/library/add`: title, author, cover color (8 swatches), optional notes. Saves with `is_wishlist: true`. Page heading: "Add to Wishlist".
- **D-09:** On save, navigate to `/wishlist`. Same validate-on-submit pattern as library add form.

### Book Detail Page Extension
- **D-10:** Single `/books/[id]` route handles both library and wishlist books (Phase 6 D-10 explicitly designed for this). The page reads `book.isWishlist` and adapts:
  - `isWishlist === false`: back link = "← Library", no "Move to Library" button (current Phase 6 behavior).
  - `isWishlist === true`: back link = "← Wishlist", "Move to Library" button rendered below notes.
- **D-11:** "Move to Library" button is visible to any authenticated user when `book.isWishlist === true` — no additional UID gate. Both accounts can trigger it (she might self-fulfill; he acts on her behalf). One-tap, no confirmation dialog.

### Move to Library Action
- **D-12:** On tap: (1) fetch current max `position` from library books (`is_wishlist = false`), (2) update book: `is_wishlist = false`, `position = max + 1`, (3) navigate to `/wishlist`.
- **D-13:** Implemented as a Client Component mutation (browser Supabase client) — same pattern as dnd reorder in LibraryShelf. Server Action is an alternative but the client-side pattern is already established.
- **D-14:** After move success, navigate to `/wishlist` (matches Phase 3 D-08). He stays in wishlist-management mode rather than being dropped into the library.

### Claude's Discretion
- Exact styling of the wishlist page header (title + optional add button layout).
- "Move to Library" button styling — must follow neo-brutalist aesthetic (2px black border, no border-radius, forest-green or aged-gold fill, Georgia label).
- Client wrapper component name for wishlist shelf tap handling.
- Loading/error states on the move action.
- Whether `/wishlist/add` duplicates the library add form or extracts a shared `AddBookForm` component.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — WISH-01 (wishlist shelf), WISH-02 (UID-gated add button), WISH-03 (tap opens detail), DETAIL-01 (read-only detail), DETAIL-02 (move to library)

### Phase 3 decisions (Flutter canonical — carry forward)
- `.planning/phases/03-wishlist-detail/03-CONTEXT.md` — D-01 through D-12: wishlist screen layout, UID gating pattern, move-to-library action flow, detail view read-only rule, silent asymmetry for add button

### Phase 6 decisions (immediate predecessor)
- `.planning/phases/06-library-add-book/06-CONTEXT.md` — D-04 (only library books draggable), D-05/D-06 (add button style + route pattern), D-07 (form fields + 8-color palette), D-09/D-10/D-11 (detail page shell + extension point for Phase 7)

### Existing components to extend (not rebuild)
- `web/components/bookshelf/Bookshelf.tsx` — static shelf; Phase 7 wraps with a thin client component for tap handling on wishlist
- `web/components/bookshelf/BookSpine.tsx` — `onTap` prop already present; wire to `/books/[id]` navigation
- `web/app/books/[id]/page.tsx` — Phase 7 extends this: adds isWishlist check for back link + Move to Library button

### Supabase schema and client
- `supabase/migrations/20260322000001_books_table.sql` — books table: `is_wishlist` column used to filter wishlist; `position` column used for library ordering
- `web/lib/supabase/client.ts` — browser client for move-to-library mutation and wishlist add
- `web/lib/supabase/server.ts` — server client for wishlist page SSR fetch + getUser() UID check

### Environment
- `web/.env.local` — add `NEXT_PUBLIC_HER_UID=<her-uid>`
- `web/.env.example` — add `NEXT_PUBLIC_HER_UID=` (blank, documented)

### Design tokens
- `web/tailwind.config.ts` — existing color tokens; no new tokens needed
- `web/app/globals.css` — `border-radius: 0 !important` globally enforced

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `web/components/bookshelf/Bookshelf.tsx` — accepts `books: BookSpineProps[]`; renders static shelf with existing empty state. Phase 7 wraps it in a thin `'use client'` component for `onTap` navigation (much simpler than LibraryShelf — no dnd-kit needed).
- `web/components/bookshelf/LibraryShelf.tsx` — NOT used for wishlist. It has dnd-kit wired in; wishlist is static.
- `web/app/library/add/page.tsx` — template for `/wishlist/add`; same form shape, different heading and `is_wishlist: true`.
- `web/app/books/[id]/page.tsx` — extend this file. Current back link is hardcoded `← Library`; Phase 7 makes it conditional on `book.isWishlist`.
- `web/types/book.ts` — `Book.isWishlist: boolean` already present; `bookRowToBook()` already maps it.
- `web/lib/supabase/server.ts` — `createClient()` + `supabase.auth.getUser()` already used in Phase 4 middleware pattern.

### Established Patterns
- Server Component + thin Client Component wrapper: library page fetches server-side, `LibraryShelf` handles interactivity. Wishlist follows same split but simpler (no drag).
- UID check: `const { data: { user } } = await supabase.auth.getUser()` (same call as middleware).
- `NEXT_PUBLIC_*` env vars: already used for Supabase URL and anon key.
- `border-2 border-black`, `font-georgia`, `bg-parchment` — all Tailwind classes in use.
- `notFound()` for missing book IDs — already in detail page.

### Integration Points
- `web/app/wishlist/page.tsx` — new Server Component; fetches `is_wishlist=true` books, checks UID for add button, renders wishlist client wrapper.
- `web/app/wishlist/add/page.tsx` — new Client Component; mirrors `/library/add`, sets `is_wishlist: true`.
- `web/app/books/[id]/page.tsx` — extend: conditional back link + Move to Library section when `book.isWishlist`.
- `web/middleware.ts` — already protects all routes; `/wishlist` and `/wishlist/add` auto-protected, no changes needed.
- `web/.env.local` + `web/.env.example` — add `NEXT_PUBLIC_HER_UID`.

</code_context>

<specifics>
## Specific Ideas

- Silent asymmetry on the wishlist: he sees no add affordance at all — not a disabled button, not a label, just the shelf (Phase 3 D-04 pattern, confirmed).
- Navigate to `/wishlist` (not `/library`) after move-to-library — keeps him in wishlist-management mode, shelf refreshes without the moved book. Confirmed over Phase 3 D-08.
- Single `/books/[id]` route extended with `isWishlist` check — Phase 6 D-10 designed this as an extension point. No new route needed.

</specifics>

<deferred>
## Deferred Ideas

- **Vercel deployment** — "App deployed on Vercel" is an active requirement but not scoped to Phase 7's WISH-01-03/DETAIL-01-02 requirements. Should be handled after Phase 7 completes (separate plan or post-phase task).
- **Book editing** — no edit path from detail view; carrying forward from Phase 3 deferral.

</deferred>

---

*Phase: 07-wishlist-book-detail*
*Context gathered: 2026-03-26*
