# Roadmap: LibM

## Overview

Three phases deliver the complete app: auth gates entry and enforces the two-user constraint; the library phase builds the visual bookshelf that is the app's centrepiece; the final phase completes the core loop with the wishlist and book detail, then verifies parity across both devices.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Auth** - Secure login for exactly two accounts, no sign-up flow (completed 2026-03-22)
- [ ] **Phase 2: Library** - Visual bookshelf with spines, drag reorder, and manual book entry
- [ ] **Phase 3: Wishlist & Detail** - Wishlist flow, move-to-library, book detail view, and cross-platform delivery

## Phase Details

### Phase 1: Auth
**Goal**: Both users can securely access the app and no one else ever can
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02
**Success Criteria** (what must be TRUE):
  1. User can open the app and see a login screen (no sign-up option present)
  2. User can log in with their pre-created email and password and reach the main app
  3. A third email/password combination is rejected at the database level via Supabase RLS — not just the UI
  4. Logging out returns the user to the login screen and clears their session
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Bootstrap Flutter project with Supabase integration and routing scaffold
- [x] 01-02-PLAN.md — Auth service, login UI, and RLS migration for two-user enforcement
**UI hint**: yes

### Phase 2: Library
**Goal**: Users can see their book collection as a visual shelf and add new books to it
**Depends on**: Phase 1
**Requirements**: LIB-01, LIB-02, LIB-03
**Success Criteria** (what must be TRUE):
  1. The library screen renders books as spines on wooden shelves in the neo-brutalist old-money aesthetic
  2. User can add a book by entering title, author, a cover (solid colour from palette), and optional notes/review
  3. A newly added book appears on the shelf immediately after saving
  4. User can drag a book spine to a new position on the shelf and the order persists after leaving and returning to the screen
**Plans**: 4 plans
Plans:
- [x] 02-01-PLAN.md — Foundation: AppColors, AppTextStyles, books migration, BookModel, BookService, reorderables dep
- [ ] 02-02-PLAN.md — LibraryScreen with ShelfWidget and BookSpineWidget; router wired to LibraryScreen
- [ ] 02-03-PLAN.md — AddBookScreen with ColorPickerWidget, form validation, Supabase insert
- [ ] 02-04-PLAN.md — Drag-reorder via ReorderableWrap; position persistence; human verification checkpoint
**UI hint**: yes

### Phase 3: Wishlist & Detail
**Goal**: She can signal what she wants, he can act on it, and every book has a full detail view — all working identically on iOS and Android
**Depends on**: Phase 2
**Requirements**: WISH-01, WISH-02, BOOK-01, PLAT-01
**Success Criteria** (what must be TRUE):
  1. The wishlist screen shows books she has added; only her account can add entries to it
  2. He can tap a wishlist book and move it to the library in one action, removing it from the wishlist
  3. Tapping any book (on shelf or wishlist) opens a detail view showing all its fields
  4. The complete app builds and runs with full feature parity on his iOS device and her Android device
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Auth | 2/2 | Complete   | 2026-03-22 |
| 2. Library | 1/4 | In Progress|  |
| 3. Wishlist & Detail | 0/TBD | Not started | - |
