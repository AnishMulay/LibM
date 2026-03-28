# Roadmap: LibM

## Milestones

- ✅ **v1.0 MVP** — Phases 1–3 (shipped 2008-03-23)
- 🚧 **v2.0 Next.js Rebuild** — Phases 4–7 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1–3) — SHIPPED 2008-03-23</summary>

- [x] Phase 1: Auth (2/2 plans) — completed 2008-03-22
- [x] Phase 2: Library (4/4 plans) — completed 2008-03-23
- [x] Phase 3: Wishlist & Detail (4/4 plans) — completed 2008-03-23

Full phase details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v2.0 Next.js Rebuild (In Progress)

**Milestone Goal:** Rebuild LibM as a Next.js 14 web app with exact feature parity to the Flutter v1.0 app, keeping the Supabase backend intact.

- [x] **Phase 4: Setup & Auth** - Next.js scaffold, Supabase client, login page, and route protection (completed 2008-03-25)
- [ ] **Phase 5: Bookshelf UI Components** - Shared wooden shelf visual, book spine component, and old-money theme
- [ ] **Phase 6: Library + Add Book** - Library route with drag reorder and full add-book form
- [ ] **Phase 7: Wishlist + Book Detail** - Wishlist screen, book detail view, and move-to-library action

## Phase Details

### Phase 4: Setup & Auth
**Goal**: Users can securely access the app from a browser and unauthenticated visitors are kept out
**Depends on**: Nothing (first phase of v2.0)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. User can log in with their pre-created email and password from a browser
  2. Refreshing or reopening the browser keeps the user logged in (session persists)
  3. Navigating to any protected route while logged out redirects to the login page
  4. No sign-up route or link exists anywhere in the app
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — Scaffold Next.js 14 in web/ with Tailwind design tokens and global layout
- [x] 04-02-PLAN.md — Supabase @supabase/ssr client factories + login page UI
- [x] 04-03-PLAN.md — Next.js middleware for route protection (AUTH-04)

**UI hint**: yes

### Phase 5: Bookshelf UI Components
**Goal**: The shared wooden bookshelf visual and book spine component exist and render correctly with the old-money aesthetic
**Depends on**: Phase 4
**Requirements**: LIB-01, LIB-02
**Success Criteria** (what must be TRUE):
  1. A wooden bookshelf with book spines renders on screen matching the neo-brutalist old-money aesthetic (parchment background, Georgia serif, thick black borders)
  2. Each book spine shows the title and author text rotated vertically, rendered in the book's cover color against a fixed-width spine
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — Wood color tokens + BookSpine component (fixed-width spine, rotated text, auto-contrast)
- [x] 05-02-PLAN.md — Bookshelf component + /library demo route with 8 hardcoded books

**UI hint**: yes

### Phase 6: Library + Add Book
**Goal**: Users can view their full library on the bookshelf, reorder books by dragging, tap a book to open its detail, and add new books
**Depends on**: Phase 5
**Requirements**: LIB-03, LIB-04, BOOK-01, BOOK-02
**Success Criteria** (what must be TRUE):
  1. User can drag a book spine to a new position on the shelf and the order persists after page refresh
  2. Tapping a book spine opens that book's detail view
  3. User can submit the add-book form with title, author, a color swatch selection, and optional notes
  4. A newly added book appears on the library shelf immediately without a manual refresh
**Plans**: 4 plans

Plans:
- [x] 06-01-PLAN.md — Shared Book type + install dnd-kit packages
- [x] 06-02-PLAN.md — Library page: SSR Supabase fetch, "+" button, dnd-kit drag reorder (LIB-03, LIB-04)
- [x] 06-03-PLAN.md — Add Book form at /library/add with 8-swatch picker and Supabase insert (BOOK-01, BOOK-02)
- [x] 06-04-PLAN.md — Book detail page at /books/[id]: read-only SSR view (LIB-04)

**UI hint**: yes

### Phase 7: Wishlist + Book Detail
**Goal**: Users can view the wishlist shelf, read full book details, and he can move a wishlist book to the library in one action
**Depends on**: Phase 6
**Requirements**: WISH-01, WISH-02, WISH-03, DETAIL-01, DETAIL-02
**Success Criteria** (what must be TRUE):
  1. Wishlist screen shows wishlist books on the same wooden bookshelf visual (no drag reorder)
  2. Only her account sees and can use the "Add to Wishlist" button
  3. Tapping a wishlist book spine opens its detail view
  4. Book detail view shows title, author, cover color swatch, and notes in a read-only layout
  5. His account can move a wishlist book to the library from the detail view in one tap, and it appears on the library shelf
**Plans**: 3 plans

Plans:
- [ ] 07-01-PLAN.md — Wishlist screen: WishlistShelf client wrapper + /wishlist Server Component with UID gate (WISH-01, WISH-02, WISH-03)
- [x] 07-02-PLAN.md — Wishlist add form at /wishlist/add mirroring /library/add (WISH-02)
- [x] 07-03-PLAN.md — Book detail extension: conditional back link + MoveToLibraryButton (DETAIL-01, DETAIL-02)

**UI hint**: yes

## Progress

**Execution Order:** 4 → 5 → 6 → 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Auth | v1.0 | 2/2 | Complete | 2008-03-22 |
| 2. Library | v1.0 | 4/4 | Complete | 2008-03-23 |
| 3. Wishlist & Detail | v1.0 | 4/4 | Complete | 2008-03-23 |
| 4. Setup & Auth | v2.0 | 3/3 | Complete   | 2008-03-25 |
| 5. Bookshelf UI Components | v2.0 | 1/2 | In Progress|  |
| 6. Library + Add Book | v2.0 | 3/4 | In Progress|  |
| 7. Wishlist + Book Detail | v2.0 | 2/3 | In Progress|  |
