---
phase: 08-ui-faithful-port
plan: 01
subsystem: design-tokens
tags: [tailwind, css, design-tokens, flutter-parity, colors, typography]
dependency_graph:
  requires: []
  provides: [correct-wood-colors, aged-gold-token, heading-font-size, error-font-size]
  affects: [08-02, 08-03, 08-04, 08-05, 08-06, 08-07]
tech_stack:
  added: []
  patterns: [Flutter AppColors as Tailwind/CSS token source of truth]
key_files:
  created: []
  modified:
    - web/tailwind.config.ts
    - web/app/globals.css
decisions:
  - "wood-mid token removed entirely — Flutter ShelfWidget uses 2-stop gradient (light→dark), no mid stop"
  - "wood-lip added as third distinct color token for shelf lip (separate from wood-dark)"
  - "aged-gold (#D4AF6A) added from Flutter coverSwatches[4] — used by add buttons in downstream plans"
  - "heading fontSize 32px/700 added to match Flutter AppTextStyles page title size"
  - "error fontSize corrected 13px→14px to match Flutter AppTextStyles"
metrics:
  duration: 41s
  completed: 2026-03-28
  tasks_completed: 2
  files_modified: 2
---

# Phase 8 Plan 1: Design Token Correction (Flutter AppColors Alignment) Summary

Corrected Tailwind design tokens and CSS custom properties to exactly match Flutter AppColors.dart hex values — replacing wrong approximations with verified Flutter source values, removing the unused mid-stop, and adding missing aged-gold and heading tokens.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Correct wood color tokens, add aged-gold, heading/error font sizes | 7832ecf | web/tailwind.config.ts |
| 2 | Mirror corrected tokens as CSS custom properties | f8b4fc0 | web/app/globals.css |

## Changes Made

### web/tailwind.config.ts

Colors section:
- `wood-light`: `#8B6F47` → `#C8A06E` (Flutter AppColors.shelfWoodLight)
- `wood-dark`: `#4A3728` → `#8B5E3C` (Flutter AppColors.shelfWoodDark)
- Removed `wood-mid: #6B5438` (Flutter uses 2-stop gradient, no mid)
- Added `wood-lip: #4A2E1A` (Flutter AppColors.shelfLip)
- Added `aged-gold: #D4AF6A` (Flutter coverSwatches[4])

fontSize section:
- Added `heading: ['32px', { lineHeight: '1.0', fontWeight: '700' }]` (Flutter AppTextStyles)
- Fixed `error: ['13px', ...]` → `error: ['14px', ...]` (Flutter AppTextStyles)

### web/app/globals.css

:root custom properties:
- `--color-wood-light: #8B6F47` → `#C8A06E`
- `--color-wood-dark: #4A3728` → `#8B5E3C`
- Removed `--color-wood-mid: #6B5438`
- Added `--color-wood-lip: #4A2E1A`
- Added `--color-aged-gold: #D4AF6A`

## Verification

- `grep -c "C8A06E\|8B5E3C\|4A2E1A\|D4AF6A" tailwind.config.ts` → 4 (all four correct values present)
- `grep -c "C8A06E\|8B5E3C\|4A2E1A\|D4AF6A" globals.css` → 4 (all four mirrored)
- No `wood-mid`, `#8B6F47`, `#6B5438`, or `#4A3728` in wood section remain
- `npx tsc --noEmit` passes with zero errors

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - this plan is token-only (no UI components, no data flow).

## Self-Check: PASSED

- web/tailwind.config.ts — modified with correct values
- web/app/globals.css — modified with correct values
- Commit 7832ecf — confirmed in git log
- Commit f8b4fc0 — confirmed in git log
