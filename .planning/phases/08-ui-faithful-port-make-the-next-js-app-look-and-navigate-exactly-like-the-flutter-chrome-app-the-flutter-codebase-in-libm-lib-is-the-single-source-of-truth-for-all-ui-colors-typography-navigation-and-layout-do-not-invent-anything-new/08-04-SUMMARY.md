---
phase: 08-ui-faithful-port
plan: "04"
subsystem: ui
tags: [ui, flutter-parity, typography, colors, forms]
dependency_graph:
  requires: [08-01]
  provides: [library-heading-32px, add-button-aged-gold, add-form-forest-green-focus, add-form-swatch-3px-black, save-button-forest-green]
  affects: [web/app/library/page.tsx, web/app/library/add/page.tsx, web/app/wishlist/add/page.tsx]
tech_stack:
  added: []
  patterns: [inline-style correction, Flutter color token alignment]
key_files:
  created: []
  modified:
    - web/app/library/page.tsx
    - web/app/library/add/page.tsx
    - web/app/wishlist/add/page.tsx
decisions:
  - Library heading letterSpacing removed — Flutter AppTextStyles.heading has no letter spacing (only display/app-name has letterSpacing: 2px)
  - Save button text changed to #FFFFFF — forest green #2D4A3E background requires white text for WCAG contrast
  - Swatch outline/outlineOffset removed — Flutter ColorPickerWidget uses only border, no CSS outline
metrics:
  duration: 94s
  completed_date: "2026-03-28"
  tasks_completed: 2
  files_modified: 3
---

# Phase 08 Plan 04: Library and Add Book Form UI Corrections Summary

Library heading corrected to 32px Georgia with aged-gold #D4AF6A add button; add book forms (library and wishlist) updated with forest-green focus borders, 3px black selected swatch borders, and forest-green Save button with white text — all matching Flutter AddBookScreen exactly.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Fix Library heading to 32px, add button to #D4AF6A | a914109 | web/app/library/page.tsx |
| 2 | Fix add book forms: heading 32px, focus #2D4A3E, swatch 3px black, Save green | 409f9a0 | web/app/library/add/page.tsx, web/app/wishlist/add/page.tsx |

## Changes Made

### Task 1: Library page (web/app/library/page.tsx)

- h1 `fontSize` corrected: `48px` → `32px` (matches Flutter LibraryScreen AppBar title using AppTextStyles.heading)
- h1 `letterSpacing: '2px'` removed (Flutter heading style has no letter spacing; only the app display name uses 2px letter spacing)
- Add button `backgroundColor` corrected: `#D4AF37` → `#D4AF6A` (correct Flutter coverSwatches[4] Aged Gold)
- Updated stale comment from `#D4AF37` to `#D4AF6A`

### Task 2: Add book forms (library/add and wishlist/add)

Applied identically to both `web/app/library/add/page.tsx` and `web/app/wishlist/add/page.tsx`:

- Page heading `fontSize`: `48px` → `32px` (matches Flutter AddBookScreen heading style)
- Title input `onFocus` border: `'2px solid #D4AF37'` → `'2px solid #2D4A3E'` (Flutter: focusedBorder color = AppColors.forestGreen)
- Author input `onFocus` border: same correction
- Notes textarea `onFocus` border: same correction
- Color swatch selected border: `'2px solid #D4AF37'` → `'3px solid #000000'` (Flutter: selectedBorder: Border.all(color: Colors.black, width: 3))
- Color swatch unselected border: `'2px solid #000000'` → `'1px solid rgba(0, 0, 0, 0.1)'` (Flutter: thin rgba border for unselected)
- Removed `outline` and `outlineOffset` from swatch button styles (Flutter uses only border)
- Save button `backgroundColor`: `saving ? 'rgba(212, 175, 55, 0.5)' : '#D4AF37'` → `saving ? 'rgba(45, 74, 62, 0.5)' : '#2D4A3E'` (forest green)
- Save button `color`: `#222222` → `#FFFFFF` (white text required for WCAG contrast on dark green background)

## Verification Results

- Zero occurrences of `#D4AF37` remain anywhere in `web/app/`
- All three files contain `fontSize: '32px'` on their headings
- Both add forms contain `2px solid #2D4A3E` on all `onFocus` handlers
- Both add forms contain `3px solid #000000` for selected swatch border
- Both add forms contain `1px solid rgba(0, 0, 0, 0.1)` for unselected swatch border
- No `outline` or `outlineOffset` on swatch buttons
- Save buttons: `#2D4A3E` background, `#FFFFFF` text
- TypeScript compiled without errors

## Deviations from Plan

None — plan executed exactly as written.

Note: The plan's success criterion "Zero occurrences of #D4AF37 anywhere in web/app/" was fully met. The only remaining reference was in a comment in library/page.tsx (stale documentation), which was updated as part of Task 1 to keep comments accurate.

## Known Stubs

None.

## Self-Check: PASSED

Files verified:
- web/app/library/page.tsx — FOUND, contains `fontSize: '32px'` and `backgroundColor: '#D4AF6A'`
- web/app/library/add/page.tsx — FOUND, contains `fontSize: '32px'`, `#2D4A3E`, `3px solid #000000`, `#FFFFFF`
- web/app/wishlist/add/page.tsx — FOUND, contains `fontSize: '32px'`, `#2D4A3E`, `3px solid #000000`, `#FFFFFF`

Commits verified:
- a914109: feat(08-04): fix Library heading to 32px, add button to aged-gold #D4AF6A
- 409f9a0: feat(08-04): fix add book forms to match Flutter AddBookScreen exactly
