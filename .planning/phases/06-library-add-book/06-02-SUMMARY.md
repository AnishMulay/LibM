---
phase: 06-library-add-book
plan: 02
subsystem: library-shelf
tags: [dnd-kit, supabase, drag-reorder, ssr, client-component]
dependency_graph:
  requires: [06-01]
  provides: [live-library-shelf, drag-reorder, tap-navigation, add-book-button]
  affects: [web/app/library/page.tsx, web/components/bookshelf/LibraryShelf.tsx]
tech_stack:
  added: [@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities]
  patterns: [SSR-server-fetch, optimistic-update, client-wrapper-pattern]
key_files:
  created:
    - web/components/bookshelf/LibraryShelf.tsx
  modified:
    - web/app/library/page.tsx
decisions:
  - "PointerSensor distance:8 threshold prevents accidental drags when tapping a spine — onTap still fires for short presses"
  - "DragOverlay ghost at opacity:0.5 floats under cursor; original spine hides (opacity:0) during drag via isSortableDragging"
  - "Optimistic reorder: arrayMove updates state immediately; Supabase batch position update runs in background; failed update reverts to pre-drag order"
  - "Library page is a Server Component — Supabase fetch runs on server at request time; LibraryShelf hydrates as client component with initialBooks prop"
  - "1-based position indexing (index+1) consistent with Flutter v1.0 D-03 decision"
metrics:
  duration: 2min
  completed_date: "2026-03-26"
  tasks_completed: 2
  files_modified: 2
---

# Phase 06 Plan 02: Library Shelf — Live Data + Drag Reorder Summary

Live Supabase-backed library shelf with dnd-kit drag reorder, optimistic updates, tap-to-detail navigation, and a gold "+" add-book button replacing all hardcoded demo data.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create LibraryShelf client component with drag reorder | 0187f31 | web/components/bookshelf/LibraryShelf.tsx (new) |
| 2 | Wire library page to Supabase SSR fetch with "+" button | daa8fbd | web/app/library/page.tsx (modified) |

## What Was Built

### LibraryShelf client component (`web/components/bookshelf/LibraryShelf.tsx`)

A new `'use client'` component that wraps dnd-kit's DndContext + SortableContext around individual book spines. Key behaviors:

- Each spine is wrapped in a `SortableBookSpine` element with `useSortable` — provides drag handle, keyboard reorder support, and position CSS transforms.
- `PointerSensor` configured with `distance: 8` activation constraint — prevents accidental drag initiation when user taps a spine to navigate.
- `DragOverlay` renders a semi-transparent ghost (opacity 0.5) of the dragged spine floating under the cursor while the original hides at opacity 0.
- On drag end: `arrayMove` reorders local state immediately (optimistic), then fires Supabase `update({ position })` for every book via `Promise.allSettled`. If any update fails, local state reverts.
- `onTap` prop on each `SortableBookSpine` calls `router.push(`/books/${book.id}`)` for tap-to-detail navigation (LIB-04).
- Empty state shows "Add your first book" prompt.

### Library page (`web/app/library/page.tsx`)

Server Component replacement of the demo-data page:

- `createClient()` from `@/lib/supabase/server` runs on the server.
- Fetches `.from('books').select('*').eq('is_wishlist', false).order('position', { ascending: true })`.
- Maps raw `BookRow[]` to `Book[]` via `bookRowToBook`.
- Renders page header with "Library" title and a 48x48px aged-gold (#D4AF37) "+" Link button with 2px black border navigating to `/library/add`.
- Passes `initialBooks={books}` to `LibraryShelf` for SSR hydration.

## Requirements Satisfied

- **LIB-03**: Drag reorder — DndContext wraps spines; position persists to Supabase in background
- **LIB-04**: Tap opens detail — `router.push('/books/${id}')` fires on spine tap

## Deviations from Plan

None — plan executed exactly as written. The `_isDragging` prop prefix (unused prop from `SortableBookSpineProps`) was prefixed with underscore to satisfy TypeScript's no-unused-vars rule.

## Known Stubs

None — all data flows from live Supabase. The `/books/[id]` route navigated to on tap does not yet exist (it will be built in a later phase), but the navigation itself is correctly implemented.

## Self-Check: PASSED

- FOUND: web/components/bookshelf/LibraryShelf.tsx
- FOUND: web/app/library/page.tsx
- FOUND commit: 0187f31 (feat: create LibraryShelf)
- FOUND commit: daa8fbd (feat: wire library page)
