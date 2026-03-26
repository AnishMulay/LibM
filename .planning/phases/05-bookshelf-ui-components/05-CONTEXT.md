# Phase 5: Bookshelf UI Components - Context

**Gathered:** 2026-03-25 (discuss mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the shared `Bookshelf` and `BookSpine` React components that render the visual wooden shelf with book spines. These are reusable UI components consumed by Library (Phase 6) and Wishlist (Phase 7). This phase does NOT include: real Supabase data fetching, drag-and-drop reorder, routing logic, or add-book flow — those are Phase 6. The components render correctly from props alone and are verified via a `/library` route with hardcoded data.

</domain>

<decisions>
## Implementation Decisions

### Shelf Visual
- **D-01:** Shelf background is a warm brown gradient (linear-gradient from mid-wood-brown at top to a darker tone at bottom) — faithful to the Flutter version. Add 2–3 wood-brown color tokens (`wood-light`, `wood-mid`, `wood-dark` or similar) to `web/tailwind.config.ts` and mirror as CSS custom properties in `web/app/globals.css`.
- **D-02:** Shelf lip (bottom border) is **12px or thicker** — a strong, prominent visual divider between shelf rows. This is an intentional design choice: the shelf edge should read clearly as a physical shelf, not a subtle rule.
- **D-03:** Each shelf row is its own strip of the wooden shelf visual. Spines fill the row horizontally and wrap to a new shelf below when the row is full (carrying forward from Phase 2 Flutter decisions).

### Spine Dimensions & Layout
- **D-04:** Fixed spine width for all books — no variable width by title length (carrying forward from Phase 2).
- **D-05:** Title text rotated 90° down the spine (writing-mode or CSS transform); author text smaller, also rotated, below the title (carrying forward from Phase 2).
- **D-06:** Approximately 6–8 books per row at typical viewport width. Exact pixel width is Claude's discretion (see below).

### Spine Text Color
- **D-07:** Auto-contrast text: **white text** on dark cover colors (forest green, navy, burgundy, charcoal), **black text** on light cover colors (parchment, cream, aged gold). Computed per book at render time from the cover color's brightness/luminance. No single fixed text color — readability is required across all 8 palette swatches.

### Demo / Showcase Route
- **D-08:** Create `web/app/library/page.tsx` with 6–8 hardcoded book objects (varied titles, authors, and cover colors spanning all 8 palette swatches). This is the Phase 5 showcase — the Bookshelf and BookSpine components render from static props. Phase 6 replaces hardcoded data with real Supabase fetching. The `/library` route must be a protected route (middleware already protects all non-`/login` routes per Phase 4).

### Claude's Discretion
- Exact spine width in px (target: 6–8 per row at ~1280px viewport; fluid/responsive layout is fine)
- Exact spine height (should comfortably fit a typical title + author without truncation)
- Exact wood gradient color values (must feel warm and physical; consistent with the old-money palette)
- Brightness threshold for auto-contrast (e.g., luminance < 0.5 → white text)
- Component prop interfaces (`BookSpine`, `Bookshelf`) — designed for Phase 6 drop-in integration
- Text truncation behavior on very long titles (ellipsis or fade at spine edge)
- Whether `Bookshelf` accepts `children` (BookSpine elements) or a `books` array prop

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — LIB-01 (visual wooden bookshelf with fixed-width spines), LIB-02 (rotated title and author text in book's cover color)

### Visual & Aesthetic Decisions (Flutter → Web continuity)
- `.planning/phases/02-library/02-CONTEXT.md` — D-01 through D-09: canonical shelf/spine decisions made during Flutter v1.0 that carry forward to the web rebuild. Includes: shelf row visual, empty state design, add-book flow, 8-color palette swatches, spine text orientation.

### Existing Tailwind Tokens (DO NOT redefine — extend)
- `web/tailwind.config.ts` — Existing color tokens (`parchment`, `forest-green`, `dark-red`), font family (`georgia`), spacing scale, border-radius overrides. Phase 5 adds wood-brown tokens to this file.
- `web/app/globals.css` — CSS custom properties pattern. New wood color tokens MUST be mirrored here as `--color-wood-*` vars to match the existing pattern.

### Project Constraints
- `.planning/PROJECT.md` — Constraints section: tech stack (Next.js 14 App Router + Tailwind CSS), aesthetic requirements (neo-brutalist old-money: parchment background, Georgia serif, thick black borders, border-radius: 0)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `web/tailwind.config.ts` — All design tokens: add wood colors here alongside existing `parchment`, `forest-green`
- `web/app/globals.css` — CSS custom properties: mirror new wood tokens as `--color-wood-*`
- `web/app/layout.tsx` — Root layout already sets `bg-parchment font-georgia text-text-primary` — components inherit these

### Established Patterns
- Border-radius: 0 is globally enforced via `* { border-radius: 0 !important }` in globals.css — no rounded corners needed anywhere
- 2px black borders (`border-2 border-black` in Tailwind) is the established border pattern from Phase 4
- Georgia font via `font-georgia` Tailwind class
- `web/components/` does not exist yet — Phase 5 creates it

### Integration Points
- `web/app/library/page.tsx` — created in this phase as the showcase route (hardcoded data)
- `web/components/bookshelf/` — suggested location for `Bookshelf.tsx` and `BookSpine.tsx`
- `web/middleware.ts` — already protects all non-`/login` routes; `/library` requires auth (no changes needed)

</code_context>

<specifics>
## Specific Ideas

- The Flutter wooden shelf had "a warm brown gradient Container with a thick dark horizontal lip at the bottom" — the web version should have the same feel: a gradient brown strip with an especially heavy bottom border
- The shelf lip (D-02: 12px+) is intentionally heavy — the physical shelf edge should be a strong visual divider, not a thin ruled line
- Auto-contrast text (D-07) must work across the full swatch range: parchment (`#F5F0E8`) needs dark text; forest green (`#2D4A3E`) needs white text

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-bookshelf-ui-components*
*Context gathered: 2026-03-25*
