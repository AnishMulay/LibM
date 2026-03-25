# LibM

## Current Milestone: v2.0 Next.js Rebuild

**Goal:** Rebuild LibM as a Next.js web app with exact feature parity to the Flutter app, keeping the Supabase backend intact.

**Target features:**
- Auth: email + password login, two fixed accounts, no sign-up flow
- Library screen: visual wooden bookshelf with fixed-width book spines (rotated title/author, old-money palette, drag reorder)
- Add Book screen: full-page form with title, author, color swatch picker (8 muted old-money colors)
- Wishlist screen: same shelf visual, no drag reorder, add button gated to her UID
- Book Detail view: read-only (title, author, color swatch, notes)
- Move to Library: one-tap action from wishlist book detail (for him)

## What This Is

A private web app (Next.js) for two people — a shared home library for a couple in a long-distance relationship. It holds their shared book collection on a visual bookshelf, lets her curate a wishlist so he knows what to buy and ship, and gives every book a clean detail view. No one else can ever access it. Rebuilt from Flutter to Next.js in v2.0; Supabase backend unchanged.

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

- [ ] User can log in with pre-created email + password credentials (no sign-up flow) — web
- [ ] Library screen shows all owned books as a visual wooden bookshelf with fixed-width spines
- [ ] Books on the shelf can be manually reordered via drag
- [ ] Books are added manually with: title, author, cover color swatch (8 old-money colors), and optional notes
- [ ] Wishlist screen shows books she wants; only she can add to it (UID gate)
- [ ] A book can be moved from wishlist to library from the book detail view
- [ ] Each book has a read-only detail view showing all its fields
- [ ] App is deployed on Vercel and accessible via web browser

### Out of Scope

- Sign-up / account creation flow — two accounts are pre-created in Supabase, period
- Social features, public sharing, or any third-party visibility — intentionally private
- Recommendations engine — this is a personal shelf, not a discovery app
- Reading status tracking (unread/reading/read) — not in scope
- "Who owns it" field — not tracking physical location per book
- ISBN / barcode scanning — manual entry only
- Image upload for book covers — color swatches only in v2.0
- Native mobile app — web-first now; Flutter app retired

## Context

**v1.0 shipped as Flutter app (1,407 LOC Dart, 116 files, 10 plans, 3 phases). v2.0 is a full frontend rebuild in Next.js — Supabase backend unchanged.**

New tech stack: Next.js 14 (App Router) + Tailwind CSS + Supabase JS client, deployed on Vercel.

Long-distance couple: he uses the web app on his device, she uses it on hers. Browser-based, no native install required.

The wishlist is a gifting signal: she adds what she wants, he checks it when buying gifts to ship to her.

The bookshelf aesthetic is neo-brutalist old-money: parchment/cream backgrounds, forest green/burgundy/navy/aged gold, thick black borders, bold Georgia serif, no rounded corners, no shadows. Should feel like a wood-paneled study shelf.

Auth is intentionally minimal: two pre-created Supabase accounts, login page only, RLS locks data to those two UIDs forever.

## Constraints

- **Tech Stack**: Next.js 14 (App Router) + Tailwind CSS + Supabase JS — replacing Flutter
- **Backend**: Supabase (auth, database, RLS) unchanged — frontend rebuild only
- **Auth**: Email + password only, two pre-created accounts, no OAuth, no magic links, no sign-up
- **Security**: Supabase Row Level Security must prevent any third account from reading or writing data — non-negotiable
- **Deployment**: Vercel — environment variables replace flutter_dotenv
- **Scope**: Exact feature parity with Flutter v1.0; no new features in v2.0

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
*Last updated: 2026-03-25 after v2.0 milestone start*
