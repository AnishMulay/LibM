# Phase 7: Wishlist + Book Detail - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the discussion.

**Date:** 2026-03-26
**Phase:** 07-wishlist-book-detail
**Mode:** discuss
**Areas discussed:** UID gating, Post-move navigation, Detail page strategy

## Gray Areas Identified

After codebase analysis (read: Bookshelf.tsx, LibraryShelf.tsx, books/[id]/page.tsx, library/page.tsx, types/book.ts, supabase migrations, prior CONTEXT.md for phases 3, 5, 6), three genuine gray areas were surfaced:

1. **UID gating mechanism** — Where "her UID" lives in Next.js
2. **Post-move navigation** — /wishlist vs /library after move-to-library
3. **Detail page strategy** — Single /books/[id] route vs. separate /wishlist/books/[id]

Most other decisions were confidently inferred from Phase 3 (Flutter) and Phase 6 (prior web phase) context.

## Decisions Made

### UID Gating
- **Question:** Env var (`NEXT_PUBLIC_HER_UID`) vs. constants file?
- **Decision:** Env var — `NEXT_PUBLIC_HER_UID` in `.env.local` and `.env.example`
- **Reason:** Consistent with existing pattern (Supabase URL + anon key already in env vars); UID doesn't end up in source

### Post-Move Navigation
- **Question:** Navigate to `/wishlist` or `/library` after move-to-library?
- **Decision:** Stay on `/wishlist`
- **Reason:** Matches Phase 3 Flutter D-08; keeps user in wishlist-management mode; shelf refreshes naturally

### Detail Page Strategy
- **Question:** Single `/books/[id]` with isWishlist check, or separate `/wishlist/books/[id]`?
- **Decision:** Single `/books/[id]` route extended with isWishlist check
- **Reason:** Phase 6 D-10 explicitly designed this as an extension point; no logic duplication; cleaner

## Confirmed Carry-Forwards (no discussion needed)

| Decision | Source |
|----------|--------|
| Static Bookshelf.tsx for wishlist (no drag) | Phase 6 D-04 |
| Wishlist ordered by created_at ascending | Phase 3 D-02 |
| Silent asymmetry — no add button for him | Phase 3 D-04 |
| Move to Library: is_wishlist=false, position=max+1 | Phase 3 D-08 |
| Move to Library button on isWishlist=true books | Phase 3 D-12 |
| /wishlist/add form: same fields, is_wishlist=true | Phase 3 (Claude's discretion) |

## No Corrections

All confirmed options were recommended defaults.
