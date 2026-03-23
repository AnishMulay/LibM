# LibM

## What This Is

A private Flutter mobile app (iOS + Android) for two people — a shared home library for a couple in a long-distance relationship. It holds their shared book collection on a visual bookshelf, lets her curate a wishlist so he knows what to buy and ship, and gives every book a clean detail view. No one else can ever access it.

## Core Value

She adds books she wants; he sees the wishlist, buys them, ships them, and moves them to the shelf — the app is the connective tissue of their shared reading life across distance.

## Requirements

### Validated

- ✓ User can log in with pre-created email + password credentials (no sign-up flow) — v1.0
- ✓ Two fixed accounts are the only accounts that can ever access the app (Supabase RLS enforced) — v1.0
- ✓ Library view shows all owned books as a visual bookshelf — book spines on wooden shelves — v1.0
- ✓ Books on the shelf can be manually reordered via drag — v1.0
- ✓ Books are added manually with: title, author, cover (solid color from palette), and optional notes — v1.0
- ✓ Wishlist view shows books she wants (only she can add to her wishlist) — v1.0
- ✓ A book can be moved from wishlist to library (marks it as arrived/owned) — v1.0
- ✓ Each book has a detail view showing all its fields — v1.0
- ✓ App works on iOS (his) and Android (hers) — v1.0

### Active

- [ ] Books can use an uploaded image as cover (in addition to solid color swatch)

### Out of Scope

- Sign-up / account creation flow — two accounts are pre-created in Supabase, period
- Social features, public sharing, or any third-party visibility — intentionally private
- Recommendations engine — this is a personal shelf, not a discovery app
- Reading status tracking (unread/reading/read) — not needed for v1
- "Who owns it" field — not tracking physical location per book
- ISBN / barcode scanning — manual entry only
- Web app or desktop — mobile only

## Context

**Shipped v1.0 with 1,407 LOC Dart. 116 files, 10 plans across 3 phases.**

Tech stack: Flutter (Dart) + Supabase (auth + database + RLS) + GoRouter + flutter_dotenv + reorderables.

Long-distance couple: he's on iOS, she's on Android — cross-platform parity confirmed on physical devices.

The wishlist is a gifting signal: she adds what she wants, he checks it when buying gifts to ship to her.

The bookshelf aesthetic is neo-brutalist old-money: parchment/cream backgrounds, forest green/burgundy/navy/aged gold, thick black borders, bold Georgia serif, no rounded corners, no Material defaults.

Auth is intentionally minimal: two pre-created Supabase accounts, login screen only, RLS locks data to those two UIDs forever.

## Constraints

- **Tech Stack**: Flutter (Dart) + Supabase — no alternatives considered
- **Auth**: Email + password only, two pre-created accounts, no OAuth, no magic links
- **Security**: Supabase Row Level Security must prevent any third account from reading or writing data — this is non-negotiable
- **Platform**: iOS + Android (Flutter handles cross-platform; no web target)
- **Scope**: Core loop shipped. Next expansion should be scoped to a new milestone.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase for backend | Auth + database + RLS in one service, well-supported Flutter SDK | ✓ Good — no friction with auth or data layer |
| Two pre-created accounts, no signup | Private app — no one else should ever be able to create an account | ✓ Good — RLS policies enforced at DB level, login-only UI works cleanly |
| Manual book entry only | Simplicity; no barcode/ISBN API dependency | ✓ Good — form is fast, cover color picker works well |
| Only she adds to wishlist | Wishlist is her signal to him — shared write access would muddy the intent | ✓ Good — UID gate implemented cleanly, move-to-library is one tap for him |
| Manual drag reorder on bookshelf | Shelf should feel personal and curated, not algorithmically sorted | ✓ Good — ReorderableWrap with optimistic UI feels natural |
| Neo-brutalist old-money aesthetic | App should feel like a physical object — a study shelf, not a CRUD app | ✓ Good — Georgia serif + parchment/forest green palette validated on both devices |
| flutter_dotenv for credentials | Keeps Supabase URL and anon key out of source control | ✓ Good — .env.example documents required vars |
| GoRouter with onAuthStateChange refresh | Synchronous session check + stream-based refresh covers all auth state transitions | ✓ Good — no login flicker or stale session issues |
| coverColor stored as hex TEXT in DB | No extra type column needed; Flutter parses at render time | ✓ Good — simple and works cleanly |
| Optimistic reorder UI | setState before async Supabase call — shelf feels instant | ✓ Good — no perceived lag on drag-drop |
| BookDetailScreen via constructor (not GoRouter state) | Keeps screen testable and decoupled from routing | ✓ Good — clean pattern, GoRouter extras used for scalar params only |

---
*Last updated: 2026-03-23 after v1.0 milestone*
