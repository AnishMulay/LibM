---
phase: quick
plan: 260328-okc
subsystem: data
tags: [bug-fix, supabase, insert, user_id]
dependency_graph:
  requires: []
  provides: [working-book-insert-library, working-book-insert-wishlist]
  affects: [app/library/add/page.tsx, app/wishlist/add/page.tsx]
tech_stack:
  added: []
  patterns: [supabase-insert-with-user_id]
key_files:
  created: []
  modified:
    - app/library/add/page.tsx
    - app/wishlist/add/page.tsx
decisions:
  - "Pass user_id: user.id in both insert payloads — user was already fetched and guarded before the insert call"
metrics:
  duration: 3min
  completed: 2026-03-28
---

# Quick Fix 260328-okc: Fix 400 Bad Request on Supabase books insert

**One-liner:** Added missing `user_id: user.id` field to the Supabase `books` insert payload in both `/library/add` and `/wishlist/add` pages, resolving the 400 Bad Request caused by the NOT NULL constraint.

## Summary

Both `handleSave` functions in `app/library/add/page.tsx` and `app/wishlist/add/page.tsx` already fetched the authenticated user via `supabase.auth.getUser()` and guarded against null/error — but neither passed `user_id` in the subsequent insert object. Supabase rejected each insert with a 400 because the `user_id` column is NOT NULL (and covered by RLS). Adding `user_id: user.id` as the first field in both insert objects resolves the error.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add user_id to library add insert | 272198f | app/library/add/page.tsx |
| 2 | Add user_id to wishlist add insert | 272198f | app/wishlist/add/page.tsx |

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None.

## Self-Check: PASSED

- app/library/add/page.tsx — line 85: `user_id: user.id` present
- app/wishlist/add/page.tsx — line 85: `user_id: user.id` present
- Commit 272198f exists
- TypeScript compilation: no errors
