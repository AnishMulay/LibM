---
phase: 04-setup-auth
plan: 01
subsystem: ui
tags: [nextjs, tailwindcss, typescript, supabase, design-tokens]

# Dependency graph
requires: []
provides:
  - Next.js 14 App Router project scaffolded in web/ subdirectory
  - Centralized Tailwind design tokens: parchment/forest-green/dark-red palette, Georgia font, all border-radius 0px
  - CSS custom properties for all design tokens in globals.css
  - Root layout applying parchment background and Georgia font globally
  - Environment variable documentation (.env.example) for Supabase credentials
affects: [04-02, 04-03, 05-library, 06-books, 07-wishlist]

# Tech tracking
tech-stack:
  added:
    - next@14.2.29 (App Router)
    - react@18
    - tailwindcss@3.4.17
    - "@supabase/supabase-js@^2.49.4"
    - "@supabase/ssr@^0.6.1"
    - typescript@5
    - postcss + autoprefixer
  patterns:
    - App Router file conventions (app/layout.tsx, app/page.tsx)
    - Tailwind config as single source of truth for design tokens
    - CSS custom properties mirror Tailwind tokens for direct CSS access
    - All border-radius globally overridden to 0 via globals.css !important reset

key-files:
  created:
    - web/package.json
    - web/tsconfig.json
    - web/next.config.mjs
    - web/postcss.config.mjs
    - web/.env.example
    - web/.gitignore
    - web/tailwind.config.ts
    - web/app/globals.css
    - web/app/layout.tsx
    - web/app/page.tsx
    - web/next-env.d.ts
    - web/package-lock.json
  modified: []

key-decisions:
  - "next.config.ts renamed to next.config.mjs — Next.js 14.2.29 does not support TypeScript config files"
  - "web/.gitignore created to exclude .next/ build output and node_modules from version control"
  - "Border-radius global reset applied via globals.css !important to guarantee 0px everywhere"

patterns-established:
  - "Design tokens: all color/spacing/typography values defined in tailwind.config.ts, mirrored as CSS custom properties in globals.css"
  - "Neo-brutalist aesthetic enforced globally via globals.css body and * reset rules"
  - "App Router root layout (layout.tsx) imports globals.css and sets bg-parchment + font-georgia on body"

requirements-completed: [AUTH-01, AUTH-02]

# Metrics
duration: 3min
completed: 2026-03-25
---

# Phase 4 Plan 01: Next.js Scaffold & Design Tokens Summary

**Next.js 14 App Router project bootstrapped in web/ with Tailwind design token system (parchment/forest-green/dark-red palette, Georgia serif, 0px border-radius) ready for all future phases**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-25T23:16:52Z
- **Completed:** 2026-03-25T23:19:45Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments

- Next.js 14.2.29 (App Router) project scaffolded manually in web/ with full dependency set (next, react, @supabase/ssr, @supabase/supabase-js, tailwindcss)
- Centralized Tailwind config with all design tokens: parchment (#F5F0E8), forest-green (#2D4A3E), dark-red (#8B1A1A), text colors, border colors, Georgia font family, spacing scale, input height 52px, all border-radius overridden to 0px
- Root layout and global CSS establish parchment background and Georgia serif globally; build verified with `npm run build` exiting 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Next.js 14 project in web/** - `96fceae` (feat)
2. **Task 2: Configure Tailwind design tokens and global CSS** - `65c626b` (feat)
3. **Deviation fix: .gitignore and package-lock.json** - `50028b9` (chore)

## Files Created/Modified

- `web/package.json` - Next.js 14 project with all required dependencies
- `web/tsconfig.json` - TypeScript strict mode config with bundler moduleResolution
- `web/next.config.mjs` - Minimal App Router config (renamed from .ts — see deviations)
- `web/postcss.config.mjs` - PostCSS config with tailwindcss and autoprefixer
- `web/.env.example` - Documents NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- `web/.gitignore` - Excludes .next/, node_modules/, .env files
- `web/tailwind.config.ts` - Full design token system: colors, font, borderRadius (all 0px), spacing, heights, letterSpacing, fontSize
- `web/app/globals.css` - CSS custom properties for all tokens + global resets (body, *, inputs)
- `web/app/layout.tsx` - Root layout importing globals.css, bg-parchment + font-georgia on body
- `web/app/page.tsx` - Minimal root page (returns null; middleware will redirect in Plan 03)
- `web/next-env.d.ts` - Next.js TypeScript declarations (generated)
- `web/package-lock.json` - Dependency lockfile for reproducible installs

## Decisions Made

- Renamed `next.config.ts` to `next.config.mjs`: Next.js 14.2.29 does not support TypeScript config files — build failed with explicit error. Used JSDoc `@type {import('next').NextConfig}` annotation instead.
- Created `web/.gitignore`: No gitignore existed at repo root; without it, `.next/` build output and `node_modules/` would be untracked. Standard Next.js gitignore patterns applied.
- Applied `border-radius: 0 !important` in globals.css `*` selector as a global override. Tailwind borderRadius tokens also set to 0px as belt-and-suspenders. This ensures third-party components cannot introduce rounded corners.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Renamed next.config.ts to next.config.mjs**
- **Found during:** Task 2 verification (`npm run build`)
- **Issue:** Next.js 14.2.29 does not support `.ts` config files — build errors with "Configuring Next.js via 'next.config.ts' is not supported"
- **Fix:** Renamed to `next.config.mjs`, replaced TypeScript type import with JSDoc `@type` annotation
- **Files modified:** web/next.config.mjs (renamed from web/next.config.ts)
- **Verification:** `npm run build` exits 0
- **Committed in:** 65c626b (Task 2 commit)

**2. [Rule 2 - Missing Critical] Added web/.gitignore**
- **Found during:** Post-task git status check
- **Issue:** No .gitignore existed; .next/ build output and node_modules/ were untracked
- **Fix:** Created web/.gitignore with standard Next.js excludes
- **Files modified:** web/.gitignore
- **Verification:** git status shows only .planning/STATE.md after commit
- **Committed in:** 50028b9

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both fixes necessary for correct operation. No scope creep.

## Issues Encountered

- Next.js 14.2.29 TypeScript config incompatibility required renaming next.config.ts → next.config.mjs (auto-fixed)

## User Setup Required

None - no external service configuration required for scaffolding.

## Known Stubs

- `web/app/page.tsx` — Returns `null`. Intentional placeholder; middleware (Plan 03) will redirect unauthenticated users to `/login`. Home route content will be implemented in Phase 5.

## Next Phase Readiness

- Next.js 14 project is bootable (`npm run build` exits 0)
- All design tokens centralized in tailwind.config.ts — Plans 02 and 03 can import these tokens directly
- Supabase dependencies installed — Plan 02 can create the client factory immediately
- `web/lib/`, `web/components/` directories exist (empty) — ready for Plan 02 content

---
*Phase: 04-setup-auth*
*Completed: 2026-03-25*
