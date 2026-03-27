# Requirements: LibM

**Defined:** 2026-03-25
**Core Value:** She adds books she wants; he sees the wishlist, buys them, ships them, and moves them to the shelf — the app is the connective tissue of their shared reading life across distance.

## v2.0 Requirements

Exact feature parity with Flutter v1.0, rebuilt in Next.js 14 (App Router) + Tailwind CSS + Supabase JS.

### Authentication

- [x] **AUTH-01**: User can log in with email and password
- [x] **AUTH-02**: Login page is the only entry point — no sign-up route exists
- [x] **AUTH-03**: Authenticated session persists across page refreshes (Supabase session)
- [x] **AUTH-04**: Unauthenticated users are redirected to login for all protected routes

### Library

- [x] **LIB-01**: Library screen shows all owned books as a visual wooden bookshelf with fixed-width spines
- [x] **LIB-02**: Each book spine shows rotated title and author text in the book's cover color
- [x] **LIB-03**: Books on the shelf can be manually reordered via drag-and-drop
- [x] **LIB-04**: Tapping a book spine opens the book detail view

### Add Book

- [x] **BOOK-01**: User can add a book with title, author, cover color (8 old-money swatches), and optional notes
- [x] **BOOK-02**: Book is saved to Supabase and appears on the shelf immediately

### Wishlist

- [ ] **WISH-01**: Wishlist screen shows wishlist books on the same visual wooden bookshelf (no drag reorder)
- [ ] **WISH-02**: Only her UID can see and use the "Add to Wishlist" button
- [ ] **WISH-03**: Tapping a wishlist book spine opens the book detail view

### Book Detail

- [x] **DETAIL-01**: Book detail view shows all fields read-only: title, author, cover color swatch, notes
- [x] **DETAIL-02**: From a wishlist book's detail view, he can move it to the library in one action

## Future Requirements

### Cover Images

- **IMG-01**: User can upload an image as book cover (in addition to color swatch)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sign-up / account creation | Two accounts pre-created in Supabase; no third account can ever exist |
| Image upload for covers | Deferred to future milestone; color swatches only in v2.0 |
| Social features / public sharing | Intentionally private — two users only |
| Recommendations engine | Personal shelf, not a discovery app |
| Reading status tracking | Not in scope |
| ISBN / barcode scanning | Manual entry only |
| Native mobile app | Flutter app retired; web-first from v2.0 onward |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 4 | Complete |
| AUTH-02 | Phase 4 | Complete |
| AUTH-03 | Phase 4 | Complete |
| AUTH-04 | Phase 4 | Complete |
| LIB-01 | Phase 5 | Complete |
| LIB-02 | Phase 5 | Complete |
| LIB-03 | Phase 6 | Complete |
| LIB-04 | Phase 6 | Complete |
| BOOK-01 | Phase 6 | Complete |
| BOOK-02 | Phase 6 | Complete |
| WISH-01 | Phase 7 | Pending |
| WISH-02 | Phase 7 | Pending |
| WISH-03 | Phase 7 | Pending |
| DETAIL-01 | Phase 7 | Complete |
| DETAIL-02 | Phase 7 | Complete |

**Coverage:**
- v2.0 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-25*
*Last updated: 2026-03-25 after roadmap creation*
