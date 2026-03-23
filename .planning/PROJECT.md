# LibM

## What This Is

A private Flutter mobile app (iOS + Android) for two people — a shared home library for a couple in a long-distance relationship. It holds their shared book collection on a visual bookshelf, lets her curate a wishlist so he knows what to buy and ship, and gives every book a clean detail view. No one else can ever access it.

## Core Value

She adds books she wants; he sees the wishlist, buys them, ships them, and moves them to the shelf — the app is the connective tissue of their shared reading life across distance.

## Requirements

### Validated

- [x] User can log in with pre-created email + password credentials (no sign-up flow) — Validated in Phase 01: auth
- [x] Two fixed accounts are the only accounts that can ever access the app (Supabase RLS enforced) — Validated in Phase 01: auth

### Active
- [ ] Library view shows all owned books as a visual bookshelf — book spines on wooden shelves
- [ ] Books on the shelf can be manually reordered via drag
- [ ] Books are added manually with: title, author, cover (color or uploaded image), and optional notes/review
- [ ] Wishlist view shows books she wants (only she can add to her wishlist)
- [ ] A book can be moved from wishlist to library (marks it as arrived/owned)
- [ ] Each book has a detail view showing all its fields
- [ ] App works on iOS (his) and Android (hers)

### Out of Scope

- Sign-up / account creation flow — two accounts are pre-created in Supabase, period
- Social features, public sharing, or any third-party visibility — intentionally private
- Recommendations engine — this is a personal shelf, not a discovery app
- Reading status tracking (unread/reading/read) — not needed for v1
- "Who owns it" field — not tracking physical location per book
- ISBN / barcode scanning — manual entry only for v1
- Web app or desktop — mobile only

## Context

- Long-distance couple: he's on iOS, she's on Android — cross-platform parity matters
- The wishlist is a gifting signal: she adds what she wants, he checks it when buying gifts to ship to her
- The bookshelf aesthetic should feel like a wood-paneled study: neo-brutalist structure with an old-money palette (cream/parchment backgrounds, deep forest green, burgundy, navy, aged gold accents; thick black borders, bold serif typography, no rounded corners, no Material Design defaults)
- Auth is intentionally minimal: two pre-created Supabase accounts, login screen only, RLS locks data to those two UIDs forever
- The cover can be a solid color (user picks from palette) or an uploaded image — both should look good as a book spine on the shelf

## Constraints

- **Tech Stack**: Flutter (Dart) + Supabase — no alternatives considered
- **Auth**: Email + password only, two pre-created accounts, no OAuth, no magic links
- **Security**: Supabase Row Level Security must prevent any third account from reading or writing data — this is non-negotiable
- **Platform**: iOS + Android (Flutter handles cross-platform; no web target for v1)
- **Scope**: v1 is the core loop only — library, wishlist, book detail, auth. No expansion until shipped.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase for backend | Auth + database + RLS in one service, well-supported Flutter SDK | — Pending |
| Two pre-created accounts, no signup | Private app — no one else should ever be able to create an account | — Pending |
| Manual book entry only | Simplicity; no barcode/ISBN API dependency for v1 | — Pending |
| Only she adds to wishlist | Wishlist is her signal to him — shared write access would muddy the intent | — Pending |
| Manual drag reorder on bookshelf | Shelf should feel personal and curated, not algorithmically sorted | — Pending |
| Neo-brutalist old-money aesthetic | App should feel like a physical object — a study shelf, not a CRUD app | — Pending |

## Current Milestone: v1.0 Core Loop

**Goal:** Ship the complete app — auth, visual bookshelf, wishlist, and book detail for two users across iOS and Android.

**Target features:**
- Auth: login screen, 2-account RLS enforcement
- Library: visual bookshelf with spines, drag reorder, add books
- Wishlist: she adds books, he can move them to library
- Book detail: full detail view per book
- Cross-platform: iOS (him) + Android (her) parity

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-23 — Phase 01 (auth) complete*
