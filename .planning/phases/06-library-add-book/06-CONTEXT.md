# Phase 6: Library + Add Book - Context

**Gathered:** 2026-03-25 (discuss mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the `/library` route to live Supabase data, enable drag-and-drop reordering of book spines, add the add-book form at `/library/add`, and build a minimal read-only book detail page at `/books/[id]`. The `Bookshelf` and `BookSpine` components from Phase 5 are already built — this phase replaces hardcoded demo data with real fetches and adds interactivity. This phase does NOT include: wishlist screen, move-to-library action, or full book detail with wishlist-specific actions (those are Phase 7).

</domain>

<decisions>
## Implementation Decisions

### Drag Reorder
- **D-01:** Use `dnd-kit` for drag-and-drop — the standard modern React DnD library, works well with Next.js App Router.
- **D-02:** Visual feedback: ghost spine (semi-transparent copy) floats under the cursor while dragging; a gap appears on the shelf showing the drop target position. Standard "ghost + gap" DnD feel.
- **D-03:** Optimistic reorder: update position in local state immediately on drop, then persist to Supabase (`position` column) in the background. Matches the Flutter pattern (D-10 from Phase 2).
- **D-04:** Only library books (not wishlist) are draggable. The `Bookshelf` component receives an `onReorder` prop when drag is enabled; no prop = static shelf.

### Add Book Form
- **D-05:** Entry point is a '+' button in the top-right of the Library page header — matches the Flutter app bar '+' button pattern (D-06 from Phase 2).
- **D-06:** Tapping '+' navigates to `/library/add` — a full-page route. User saves and is returned to `/library`. Consistent with the Flutter full-screen AddBookScreen pattern (D-07 from Phase 2).
- **D-07:** Form fields: title (text), author (text), cover color (8-swatch picker), notes (optional textarea). Color swatches are the canonical 8 old-money palette colors (D-08 from Phase 2): parchment `#F5F0E8`, forest green `#2D4A3E`, burgundy `#8B1A1A`, navy `#0B3D91`, aged gold `#D4AF37`, charcoal `#2C2C2C`, rust `#A0522D`, cream `#F5E6D3`.
- **D-08:** After save, the new book is appended to the local shelf immediately (optimistic) — BOOK-02 ("appears on the shelf immediately without a manual refresh").

### Book Detail Page
- **D-09:** Phase 6 builds the full `/books/[id]` route with a minimal read-only detail view: title, author, cover color swatch (rendered as a colored block), and notes. LIB-04 is fully satisfied.
- **D-10:** The detail page is read-only in Phase 6. Phase 7 adds the move-to-library action (DETAIL-02) for wishlist books on this same route — Phase 6 builds the shell, Phase 7 extends it.
- **D-11:** A back button or breadcrumb navigates back to `/library` (or `/wishlist` in Phase 7 for wishlist book spines).

### Claude's Discretion
- Library page data fetching architecture: Server Component for initial SSR render + Client Component wrapper for interactivity (drag, add optimistic updates). Claude picks the boundary.
- Real-time vs. one-time fetch: one-time fetch on mount is sufficient (optimistic updates handle immediate feedback; no need for live subscriptions).
- Exact styling of the add-book form, detail page, and '+' button — must follow the neo-brutalist old-money aesthetic (parchment bg, Georgia serif, 2px black border, no rounded corners).
- dnd-kit sensor configuration (mouse + pointer + touch sensors) and animation timing.
- Error handling for Supabase failures (add book, reorder persistence).
- `is_wishlist: false` set on all books created from the add-book form.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — LIB-03 (drag reorder), LIB-04 (tap opens detail), BOOK-01 (add book form), BOOK-02 (appears immediately)

### Phase 2 decisions (Flutter canonical — carry forward)
- `.planning/phases/02-library/02-CONTEXT.md` — D-06 through D-11: add-book entry point (+' in app bar), full-screen add route, 8-color palette swatches, `position` column ordering, optimistic reorder UI. These decisions established the UX patterns this phase implements in Next.js.

### Phase 5 components (must use, not rebuild)
- `web/components/bookshelf/Bookshelf.tsx` — existing Bookshelf component; Phase 6 adds `onReorder` prop for drag support
- `web/components/bookshelf/BookSpine.tsx` — existing BookSpine component with `onTap` prop already present; Phase 6 wires `onTap` to navigate to `/books/[id]`

### Supabase schema and client
- `supabase/migrations/20260322000001_books_table.sql` — books table schema: `id`, `user_id`, `title`, `author`, `cover_color`, `notes`, `position`, `is_wishlist`. Phase 6 reads/writes all fields except `is_wishlist` (always `false` for library books from this form).
- `web/lib/supabase/client.ts` — browser Supabase client (for client-component mutations: add book, reorder)
- `web/lib/supabase/server.ts` — server Supabase client (for SSR initial fetch in library page)

### Design tokens
- `web/tailwind.config.ts` — existing color tokens (`parchment`, `forest-green`, `dark-red`, wood tokens) and typography scale
- `web/app/globals.css` — `border-radius: 0 !important` rule + CSS custom properties

### Project constraints
- `.planning/PROJECT.md` — Constraints: tech stack, aesthetic (neo-brutalist old-money), no new features beyond exact Flutter parity

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `web/components/bookshelf/Bookshelf.tsx` — accepts `books: BookSpineProps[]`; Phase 6 wraps it with dnd-kit's `DndContext` + `SortableContext` to enable drag. The component itself may need a minor prop addition (`onReorder`?) or the dnd wrapper lives above it.
- `web/components/bookshelf/BookSpine.tsx` — already has `onTap?: () => void` prop; Phase 6 passes `router.push('/books/' + id)` as the handler.
- `web/lib/supabase/client.ts` + `web/lib/supabase/server.ts` — both clients ready to use.
- `web/app/library/page.tsx` — has a `// TODO Phase 6: replace demoBooks with Supabase fetch` comment; the structure (header + Bookshelf) is already in place.

### Established Patterns
- 2px black borders (`border-2 border-black`), Georgia font (`font-georgia`), parchment background (`bg-parchment`) — all via Tailwind classes.
- `border-radius: 0 !important` is globally enforced — no rounded corners anywhere.
- Next.js App Router: Server Components for data fetching, Client Components for interactivity (use `'use client'` directive).

### Integration Points
- `web/app/library/page.tsx` — replace hardcoded `demoBooks` with Supabase server fetch; wrap Bookshelf in a Client Component for drag interactivity.
- `web/app/library/add/page.tsx` — new route for the add-book form (client component, browser Supabase client).
- `web/app/books/[id]/page.tsx` — new dynamic route for book detail (server component, server Supabase client).
- `web/middleware.ts` — already protects all non-`/login` routes; `/library/add` and `/books/[id]` are automatically protected.

</code_context>

<specifics>
## Specific Ideas

- Ghost + gap drag feel was explicitly chosen — the shelf should look like a gap opens up as you drag, showing where the spine will land. Not just a snap-on-drop.
- Full-page route for add book (not modal/drawer) — consistent with the Flutter full-screen pattern. Clean nav, back button returns to shelf.
- Phase 6 builds the complete read-only detail page — LIB-04 is fully satisfied, not stubbed out.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-library-add-book*
*Context gathered: 2026-03-25*
