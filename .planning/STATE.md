---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Next.js Rebuild
status: Milestone complete
stopped_at: Completed 07-01-PLAN.md
last_updated: "2026-03-27T01:58:13.143Z"
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 12
  completed_plans: 12
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-25)

**Core value:** She adds books she wants; he sees the wishlist, buys them, ships them, and moves them to the shelf — the app is the connective tissue of their shared reading life across distance.
**Current focus:** Phase 07 — wishlist-book-detail

## Current Position

Phase: 07
Plan: Not started

## Performance Metrics

**Velocity:**

- Total plans completed: 0 (v2.0)
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

*Updated after each plan completion*
| Phase 04-setup-auth P01 | 3 | 2 tasks | 12 files |
| Phase 04-setup-auth P02 | 5 | 2 tasks | 5 files |
| Phase 04-setup-auth P03 | 1 | 1 tasks | 1 files |
| Phase 04-setup-auth P03 | 7min | 2 tasks | 1 files |
| Phase 05-bookshelf-ui-components P01 | 1min | 2 tasks | 3 files |
| Phase 05-bookshelf-ui-components P02 | 30 | 3 tasks | 2 files |
| Phase 06-library-add-book P01 | 1min | 2 tasks | 3 files |
| Phase 06-library-add-book P02 | 2min | 2 tasks | 2 files |
| Phase 06-library-add-book P03 | 3min | 1 tasks | 1 files |
| Phase 06-library-add-book P04 | 2min | 1 tasks | 1 files |
| Phase 07-wishlist-book-detail P02 | 2min | 1 tasks | 1 files |
| Phase 07-wishlist-book-detail P03 | 1min | 2 tasks | 2 files |
| Phase 07-wishlist-book-detail P01 | 2min | 2 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.

- v2.0 is a full frontend rebuild: Next.js 14 (App Router) + Tailwind CSS + Supabase JS — Flutter app retired
- Supabase backend (auth, database, RLS) is unchanged — frontend rebuild only
- Exact feature parity with Flutter v1.0; no new features in v2.0
- Deployed on Vercel; environment variables replace flutter_dotenv
- [Phase 04-setup-auth]: next.config.ts renamed to next.config.mjs — Next.js 14.2.29 does not support TypeScript config files
- [Phase 04-setup-auth]: All Tailwind design tokens centralized in web/tailwind.config.ts, mirrored as CSS custom properties — single source of truth for all future phases
- [Phase 04-setup-auth]: CookieOptions type imported from @supabase/ssr required for explicit typing of setAll callback parameter — TypeScript strict mode rejects implicit any
- [Phase 04-setup-auth]: getUser() over getSession() in middleware for authoritative JWT validation against Supabase auth server
- [Phase 04-setup-auth]: Middleware matcher excludes _next/static and _next/image paths so static assets bypass auth checks
- [Phase 04-setup-auth]: getUser() over getSession() in middleware for authoritative JWT validation against Supabase auth server
- [Phase 05-bookshelf-ui-components]: BookSpine fixed at 56x150px for 6-8 spines per row at 1280px; writing-mode:vertical-rl+rotate(180deg) for text rotation; getContrastColor uses WCAG luminance (0.299/0.587/0.114) threshold at 0.5
- [Phase 05-bookshelf-ui-components]: Single flex-wrap shelf strip: wrapping spines continue on same gradient background, producing multi-row shelf visual naturally without row-splitting logic
- [Phase 05-bookshelf-ui-components]: Inline style required for linear-gradient: Tailwind cannot generate gradient stops from custom wood-* color tokens — hex values used directly
- [Phase 06-library-add-book]: Dual Book/BookRow interface pattern: BookRow for raw Supabase snake_case responses, Book for camelCase component consumption, bridged by bookRowToBook() converter
- [Phase 06-library-add-book]: Book.coverColor/isWishlist/createdAt field names aligned to BookSpineProps convention established in Phase 05 — no field remapping needed when passing to BookSpine
- [Phase 06-library-add-book]: PointerSensor distance:8 threshold prevents accidental drags on tap; DragOverlay ghost at opacity 0.5; optimistic reorder with Supabase batch update and revert on failure
- [Phase 06-library-add-book]: Validate-on-submit only for add-book form; position=max+1 query appends to shelf end; cover color required to prevent blank BookSpine renders
- [Phase 06-library-add-book]: notFound() handles both error and null data — covers PGRST116 without inspecting error codes; back link always /library in Phase 6; full Server Component for read-only SSR detail view
- [Phase 07-wishlist-book-detail]: Position uses max+1 of wishlist books to satisfy NOT NULL constraint — wishlist books aren't ordered by position but column requires a value
- [Phase 07-wishlist-book-detail]: Wishlist add button label stays 'Save Book' per UI-SPEC — keeps parity with library add form
- [Phase 07-wishlist-book-detail]: Navigate to /wishlist after move (D-14) — user stays in wishlist-management context, no confirmation dialog (D-11)
- [Phase 07-wishlist-book-detail]: WishlistShelf is a thin 'use client' wrapper — Server Component owns fetch and UID gate
- [Phase 07-wishlist-book-detail]: Silent asymmetry: showAddButton=false renders nothing — no disabled state (D-06)
- [Phase 07-wishlist-book-detail]: Wishlist books ordered by created_at ascending (D-01) vs library's position-based drag order

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260328-okc | Fix 400 Bad Request on Supabase books insert - missing user_id and cover_color type mismatch | 2026-03-28 | 272198f | [260328-okc-fix-400-bad-request-on-supabase-books-in](./quick/260328-okc-fix-400-bad-request-on-supabase-books-in/) |
| 260328-or6 | Full feature parity audit — cache revalidation, wishlist nav, sign-out, cover colors, notes display, wishlist empty state | 2026-03-28 | 40822ef | [260328-or6-full-feature-parity-audit-compare-flutte](./quick/260328-or6-full-feature-parity-audit-compare-flutte/) |

## Session Continuity

Last session: 2026-03-28
Stopped at: Completed quick task 260328-or6: Full feature parity audit — cache revalidation, wishlist nav, sign-out, cover colors, notes display, wishlist empty state
Resume file: None
