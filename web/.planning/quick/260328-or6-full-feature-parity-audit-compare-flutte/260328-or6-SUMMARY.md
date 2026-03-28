---
phase: quick
plan: 260328-or6
subsystem: web-app
tags: [parity, cache, auth, ui, colors]
tech-stack:
  added: []
  patterns: [router.refresh() for RSC cache busting, client component sign-out]
key-files:
  created:
    - web/components/bookshelf/SignOutButton.tsx
  modified:
    - web/app/library/add/page.tsx
    - web/app/wishlist/add/page.tsx
    - web/app/library/page.tsx
    - web/components/bookshelf/WishlistShelf.tsx
    - web/app/books/[id]/page.tsx
decisions:
  - router.refresh() called after router.push() to force RSC re-fetch on the target page
  - SignOutButton is a thin 'use client' wrapper calling supabase.auth.signOut() then router.push('/login') + router.refresh()
  - Wishlist empty state uses custom wood-gradient container matching Bookshelf shell visual
  - Notes section hidden entirely when null or empty (not a fallback "No notes" label)
metrics:
  duration: ~10min
  completed: "2026-03-28T21:54:50Z"
  tasks: 3
  files: 6
---

# Quick Task 260328-or6: Full Feature Parity Audit Summary

**One-liner:** Fixed 6 Flutter parity gaps — cache revalidation via router.refresh(), wishlist nav, sign-out on both pages, canonical cover colors (#8B3A3A/#1A3A4A/#D4AF6A/#3A3A3A/#9B4A4A/#FFFAF0), hidden empty notes, "Her wishlist is empty" empty state.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Fix cache revalidation after add + correct cover color swatches | c3d4727 | web/app/library/add/page.tsx, web/app/wishlist/add/page.tsx |
| 2 | Add wishlist navigation link and sign-out button to Library page | 663df03 | web/app/library/page.tsx, web/components/bookshelf/SignOutButton.tsx |
| 3 | Add sign-out to Wishlist + fix empty state + fix Book detail notes | 40822ef | web/components/bookshelf/WishlistShelf.tsx, web/app/books/[id]/page.tsx |

## What Was Fixed

### Critical gaps (3)

**1. Cache revalidation after add**
- Root cause: `router.push('/library')` alone does not invalidate Next.js RSC cache; the Server Component serves stale data
- Fix: Added `router.refresh()` after `router.push()` in both `/library/add` and `/wishlist/add`
- Flutter equivalent: `_loadBooks()` called after Navigator.pop re-fetches from Firestore/Supabase

**2. Wishlist navigation from Library**
- Root cause: No link to `/wishlist` existed anywhere in the web app
- Fix: Added heart icon link (`♡`) to Library page header, positioned left of the `+` button
- Flutter equivalent: Heart icon in LibraryScreen appbar actions row

**3. Sign-out button**
- Root cause: No sign-out functionality existed in any page
- Fix: Created `SignOutButton` client component; added to both Library header and WishlistShelf header
- Flutter equivalent: Logout icon in both LibraryScreen and WishlistScreen appbar actions

### Minor mismatches (3)

**4. Cover color swatches**
- Fixed 6 of 8 colors that diverged from Flutter `AppColors.coverSwatches`:
  - Burgundy: `#8B1A1A` → `#8B3A3A`
  - Navy: `#0B3D91` → `#1A3A4A`
  - Aged Gold: `#D4AF37` → `#D4AF6A`
  - Charcoal: `#2C2C2C` → `#3A3A3A`
  - Rust: `#A0522D` → `#9B4A4A`
  - Cream: `#F5E6D3` → `#FFFAF0`

**5. Notes display on book detail**
- Root cause: Always rendered "Notes" label with "No notes" fallback
- Fix: Wrapped in `{book.notes && book.notes.trim().length > 0 && (...)}`
- Flutter equivalent: `if (book.notes != null && book.notes!.isNotEmpty)`

**6. Wishlist empty state**
- Root cause: Used same generic "Add your first book" empty state as Library
- Fix: Added conditional render in WishlistShelf before `<Bookshelf>` — shows wood-gradient shelf with "Her wishlist is empty" text
- Flutter equivalent: `WishlistShelf` shows "Her wishlist is empty" string in shelf container

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all changes wire live data or UI behavior.

## Self-Check: PASSED

- `web/components/bookshelf/SignOutButton.tsx` — created, exists
- Commits c3d4727, 663df03, 40822ef — all present in git log
- router.refresh() present in both add pages after router.push()
- COVER_COLORS updated in both add pages
- WishlistShelf has SignOutButton import and usage
- Book detail notes section is conditionally rendered
