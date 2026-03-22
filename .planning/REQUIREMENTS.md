# Requirements: LibM

**Defined:** 2026-03-22
**Core Value:** She adds books she wants; he sees the wishlist, buys them, ships them, and moves them to the shelf — the app is the connective tissue of their shared reading life across distance.

## v1 Requirements

### Authentication

- [x] **AUTH-01**: User can log in with pre-created email + password credentials (no sign-up flow)
- [x] **AUTH-02**: Two fixed accounts are the only accounts that can ever access the app (Supabase RLS enforced)

### Library

- [ ] **LIB-01**: User sees all owned books as a visual bookshelf with book spines on wooden shelves
- [ ] **LIB-02**: User can manually reorder books on the shelf via drag
- [ ] **LIB-03**: User can add a book manually with title, author, cover (color or uploaded image), and optional notes/review

### Wishlist

- [ ] **WISH-01**: Wishlist view shows books she wants; only she can add to her wishlist
- [ ] **WISH-02**: User can move a book from wishlist to library (marks it as arrived/owned)

### Book Detail

- [ ] **BOOK-01**: Each book has a detail view showing all its fields

### Platform

- [ ] **PLAT-01**: App runs on iOS (his device) and Android (her device) with full parity

## Future Requirements

(None defined — v1 is the full intended scope)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sign-up / account creation | Two accounts are pre-created in Supabase, period |
| Social features, public sharing | Intentionally private — no third-party visibility ever |
| Recommendations engine | Personal shelf, not a discovery app |
| Reading status tracking | Not needed for v1 |
| "Who owns it" field | Not tracking physical location per book |
| ISBN / barcode scanning | Manual entry only for v1 |
| Web app or desktop | Mobile only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| LIB-01 | Phase 2 | Pending |
| LIB-02 | Phase 2 | Pending |
| LIB-03 | Phase 2 | Pending |
| WISH-01 | Phase 3 | Pending |
| WISH-02 | Phase 3 | Pending |
| BOOK-01 | Phase 3 | Pending |
| PLAT-01 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after roadmap creation*
