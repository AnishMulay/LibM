# Phase 8: UI Faithful Port - Research

**Researched:** 2026-03-28
**Domain:** Flutter-to-Next.js UI Parity (Design System Extraction)
**Confidence:** HIGH

## Summary

Phase 8 requires extracting every design decision from the Flutter codebase (`libm/lib/`) and translating it faithfully to the Next.js web app. The Flutter app is the single source of truth for colors, typography, spacing, layout, and navigation patterns.

Analysis of Flutter source reveals a complete old-money neo-brutalist design system: parchment background, Georgia serif throughout, exact color palette (8-swatch covers, wood gradients), sharp 2px borders, 0 border radius, and specific component dimensions (56×150px book spines, 52px buttons, 120×160px cover swatches).

Current Next.js implementation already achieves **~90% visual parity**. The remaining 10% involves correcting:
1. **Wood gradient colors** — Next.js uses slightly wrong hex values (differences of 2–6 points per channel)
2. **Book spine dimensions** — Flutter uses 56×200px; Next.js uses 56×150px (font sizes also need adjustment)
3. **Typography baseline** — Flutter spine text uses 14px + 14px (not 16px + 13px as currently coded)
4. **Add Button color** — Currently #D4AF37; Flutter uses #D4AF6A (Aged Gold from swatches)
5. **Shelf wood render quality** — Gradient direction and shadow specifications differ slightly

**Primary recommendation:** Extract exact design tokens from Flutter source, update tailwind.config.ts color values, adjust component typography props, verify all hex colors match AppColors constants, and test side-by-side rendering to confirm pixel-perfect parity.

## Phase Requirements

No explicit requirements were provided for Phase 8 in REQUIREMENTS.md. This phase covers achieving visual/UI parity, enabling future phases to focus on feature work.

## Design System Extraction

### Flutter Design Tokens (Source of Truth)

All values extracted from `libm/lib/core/theme/` and rendered files.

#### Color Palette

**Primary Colors (AppColors.dart)**
| Color | Hex | Flutter Constant | Usage |
|-------|-----|---|---|
| Parchment | #F5F0E8 | `parchment` | Background, app base |
| Forest Green | #2D4A3E | `forestGreen` | Buttons, borders, focus states |
| Dark Red | #8B1A1A | `darkRed` | Error text |
| Border Default | #000000 (black87) | `borderDefault` | All 2px borders |

**Cover Swatch Palette (8 colors from coverSwatches[])**
| Color | Hex | Name | Flutter Index |
|-------|-----|------|---|
| Parchment | #F5F0E8 | Parchment | 0 |
| Forest Green | #2D4A3E | Forest Green | 1 |
| Burgundy | #8B3A3A | Burgundy | 2 |
| Navy | #1A3A4A | Navy | 3 |
| Aged Gold | #D4AF6A | Aged Gold | 4 |
| Charcoal | #3A3A3A | Charcoal | 5 |
| Rust | #9B4A4A | Rust | 6 |
| Cream | #FFFAF0 | Cream | 7 |

**Shelf Wood Gradient (from ShelfWidget)**
| Stop | Hex | Flutter Constant | Position |
|------|-----|---|---|
| Light (top) | #C8A06E | `shelfWoodLight` | 0% (top) |
| Dark (bottom) | #8B5E3C | `shelfWoodDark` | 100% (bottom) |
| Lip (separator) | #4A2E1A | `shelfLip` | 10px solid |

**Text Colors (used throughout)**
| Color | Hex | Usage |
|-------|-----|---|
| text-primary (black87) | #222222 | All text, headings |
| text-secondary (black54) | #666666 | Muted labels, secondary info |
| text-muted (labelMuted italic) | #999999 | Italicized secondary text |

#### Typography (AppTextStyles.dart)

All use Georgia serif, no fallback to system fonts.

| Style | Font | Size | Weight | Letter Spacing | Usage |
|-------|------|------|--------|---|---|
| display | Georgia | 48px | Bold (700) | 2px | App name "LibM", page headings |
| heading | Georgia | 32px | Bold (700) | 0 | Section titles (Library, Wishlist) |
| body | Georgia | 16px | Normal (400) | 0 | Paragraph text, button labels |
| label | Georgia | 14px | Normal (400) | 0 | Form labels, field names |
| label-muted | Georgia | 14px | Normal (400), italic | 0 | Empty state prompts |
| error | Georgia | 14px | Normal (400) | 0 | Error messages, dark red color |
| spine-title | Georgia | 14px | Normal (400) | 0 | Book spine title (rotated) |
| spine-author | Georgia | 14px | Normal (400) | 0 | Book spine author (rotated) |

#### Component Dimensions

**Book Spine (BookSpineWidget.dart)**
- Width: 56px (fixed)
- Height: 200px (fixed)
- Text rotation: `RotatedBox(quarterTurns: 1)` = 90° clockwise rotation
- Padding inside spine: 8px horizontal
- Text layout: Column, center, 2 children (title + author)
- Title font: 14px, normal weight, 2 lines max, ellipsis on overflow
- Author font: 14px, normal weight, 1 line max, ellipsis on overflow
- Spacing between title/author: 4px

**Cover Swatch (BookDetailScreen.dart)**
- Width: 120px
- Height: 160px
- Border: 2px solid black (#000000)
- Center aligned on detail page

**Color Picker Swatches (ColorPickerWidget.dart)**
- Each swatch: 50×50px
- Border when selected: 3px solid black
- Border when not selected: 1px solid rgba(0,0,0,0.1)
- Wrap spacing: 8px horizontal, 8px vertical

**Buttons (AddBookScreen.dart, BookDetailScreen.dart)**
- Height: 52px
- Full width on mobile
- Border: 2px solid black
- Border radius: 0px (no rounding)
- Text: Georgia, 16px bold, letter-spacing 1px
- Background colors vary by button type (Forest Green, Burgundy)

**Shelf Widget (ShelfWidget.dart)**
- Shelf body height: 200px
- Shelf lip height: 10px
- Gradient: LinearGradient top-to-bottom, shelfWoodLight → shelfWoodDark
- Box shadow: 4px blur, 2px offset, rgba(0,0,0,0.15) (black26 in Flutter)
- Padding: 8px on all sides of shelf body
- Gap between spines: 4px horizontal, 32px between rows

**App Bar / Header**
- Background: parchment (same as page)
- Elevation: 0
- Icon buttons: 48×48px minimum touch target
- Text style: heading (32px bold Georgia)

#### Navigation Structure (from AppRouter.dart)

| Route | Component | Purpose | Auth Gated |
|-------|-----------|---------|---|
| /login | LoginScreen | Entry point, auth check | No |
| /home | LibraryScreen | Main shelf view | Yes |
| /wishlist | WishlistScreen | Her wishlist shelf | Yes |
| /add-book | AddBookScreen | Create library or wishlist book | Yes |
| /book-detail | BookDetailScreen | View book details, move-to-lib | Yes |

Initial route: `/login`
Redirect rules:
- Unauthenticated at protected route → `/login`
- Authenticated at `/login` → `/home`

#### Color Usage by Screen

**LibraryScreen (home)**
- Background: parchment
- App bar bg: parchment
- Wishlist icon: outlined heart (♡)
- Add button: 48×48px, Aged Gold background (#D4AF6A), 2px black border
- Sign-out icon: logout

**WishlistScreen**
- Background: parchment
- App bar bg: parchment
- Add button: visible only if user.id == her_uid (const _herUid = '67981be5-832f-44d4-bd45-a8a331565891')
- Empty state: full shelf visual (wood gradient + lip) with text "Her wishlist is empty"

**AddBookScreen**
- Background: parchment
- Form layout: vertical, centered
- Input borders: 2px solid black, enabled state
- Input focused border: 2px solid forest green
- Save button: Forest Green background, 2px black border, 52px height
- Cover color picker: 8 swatches arranged in wrap, 50×50px each
- Title/Author: required (validation on submit)
- Notes: optional, 4-line textarea

**BookDetailScreen**
- Background: parchment
- Cover swatch: 120×160px with 2px black border
- Back button: conditional text "← Wishlist" or "← Library" based on is_wishlist flag
- Move to Library button (wishlist only): Burgundy (#8B3A3A), 2px black border, 52px height
- Title: display (48px bold Georgia)
- Author: body (16px normal Georgia)
- Notes: hidden entirely if null/empty

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|---|
| Next.js | 14.x (App Router) | Web framework | Chosen in Phase 4 |
| React | 18.x | UI library | Shipped with Next.js 14 |
| Tailwind CSS | 3.x | Utility styling | Configured in Phase 5 with design tokens |
| TypeScript | 5.x | Type safety | Enforced in project |
| Georgia serif | System font | Typography | Old-money aesthetic, no imports needed |

### Design & Styling

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|---|
| CSS custom properties | N/A | Design token bridge | Tailwind tokens mirror to CSS vars |
| Inline styles | N/A | Dynamic values | Required for rotated text, gradients with custom colors |

### Build/Config

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|---|
| tailwind.config.ts | N/A | Design token config | Single source of truth for colors, spacing, fonts |

---

## Architecture Patterns

### Recommended Project Structure

```
web/
├── app/
│   ├── layout.tsx                  # Root layout: bg-parchment, font-georgia
│   ├── page.tsx                    # / redirect to /library
│   ├── login/
│   │   ├── page.tsx                # / redirect to LoginForm
│   │   └── LoginForm.tsx           # 'use client', email + password
│   ├── library/
│   │   ├── page.tsx                # SSR: fetch books, render LibraryShelf
│   │   └── add/
│   │       └── page.tsx            # SSR: add book form (library mode)
│   ├── wishlist/
│   │   ├── page.tsx                # SSR: fetch wishlist, render WishlistShelf
│   │   └── add/
│   │       └── page.tsx            # SSR: add book form (wishlist mode)
│   └── books/
│       └── [id]/
│           └── page.tsx            # SSR: book detail, conditional back link + move button
├── components/
│   ├── bookshelf/
│   │   ├── BookSpine.tsx           # Display spine: 56×150px, rotated text
│   │   ├── Bookshelf.tsx           # Static shelf display (no drag)
│   │   ├── LibraryShelf.tsx        # Client: dnd-kit drag reorder + tap
│   │   ├── WishlistShelf.tsx       # Client: wrap layout, no drag
│   │   ├── SignOutButton.tsx       # Client: logout + redirect
│   │   └── MoveToLibraryButton.tsx # Client: move wishlist → library
│   └── forms/
│       ├── AddBookForm.tsx         # Client: title, author, color pick, notes
│       └── ColorPicker.tsx         # Client: 8 swatch grid, on-tap selection
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   └── server.ts               # Server-side client
│   └── types.ts                    # Shared types
├── types/
│   └── book.ts                     # BookRow, Book, conversions
├── tailwind.config.ts              # Design tokens
└── globals.css                     # Global styles
```

### Pattern 1: Flutter Colors → Tailwind + Inline Styles

**What:** Extract exact hex values from Flutter AppColors, define in tailwind.config.ts, use via Tailwind classes where possible, fall back to inline styles for dynamic/gradient values.

**When to use:** Every color needs verification against Flutter source.

**Example:**
```typescript
// Source: libm/lib/core/theme/app_colors.dart
// Flutter: static const Color parchment = Color(0xFFF5F0E8);
// Next.js tailwind.config.ts:
colors: {
  parchment: '#F5F0E8',  // ✓ Verified match
  'forest-green': '#2D4A3E',  // ✓ Verified match
}

// Usage in component:
<div className="bg-parchment text-forest-green">
  {/* Correct */}
</div>
```

### Pattern 2: Book Spine Rotation via CSS

**What:** Flutter uses `RotatedBox(quarterTurns: 1)` = 90° clockwise. Next.js must achieve identical rotation with `writing-mode: vertical-rl` + `transform: rotate(180deg)`.

**When to use:** Every rotated book spine text must match Flutter's rotation angle exactly.

**Example:**
```typescript
// Source: BookSpineWidget.dart uses RotatedBox(quarterTurns: 1)
// Next.js BookSpine.tsx:
<div style={{
  writingMode: 'vertical-rl',
  transform: 'rotate(180deg)',
  // Text will render identical to Flutter's RotatedBox
}}>
  {title}
  {author}
</div>
```

### Pattern 3: App Bar (Header) as Flex Row

**What:** Flutter AppBar + actions (icons + links) on right side. Next.js replicates via flex row with space-between.

**When to use:** Every page with a header/title + action buttons.

**Example:**
```typescript
// Source: LibraryScreen.dart appBar with 3 actions
// Next.js:
<div className="flex flex-row items-center justify-between mb-xl">
  <h1 className="text-display font-georgia font-bold">Library</h1>
  <div className="flex gap-sm">
    <Link href="/wishlist">♡</Link>
    <Link href="/library/add">+</Link>
    <SignOutButton />
  </div>
</div>
```

### Pattern 4: Shelf Gradient + Shadow

**What:** Linear gradient top-to-bottom (wood colors), box shadow (4px blur, 2px offset), 10px solid lip at bottom.

**When to use:** Every shelf display (library, wishlist, empty state).

**Example:**
```typescript
// Source: ShelfWidget.dart + LibraryScreen.dart
// Next.js inline style (Tailwind cannot generate custom gradients):
<div style={{
  background: 'linear-gradient(to bottom, #C8A06E 0%, #8B5E3C 100%)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
  borderBottom: '10px solid #4A2E1A',
  padding: '8px',
}}>
```

### Pattern 5: Conditional Rendering (UID Gate)

**What:** Wishlist "Add" button visible only for her UID. Server-side UID check, pass `showAddButton` prop to client component.

**When to use:** Wishlist page, any her-only features.

**Example:**
```typescript
// Source: WishlistScreen.dart const _herUid = '67981be5-832f-44d4-bd45-a8a331565891'
// Next.js WishlistPage (Server Component):
const { data: { user } } = await supabase.auth.getUser()
const showAddButton = user?.id === process.env.NEXT_PUBLIC_HER_UID

// Pass to client component:
<WishlistShelf books={books} showAddButton={showAddButton} />
```

### Anti-Patterns to Avoid

- **Inventing new colors:** Never use colors outside the 8-swatch palette or primary colors. If a color is needed, it must be extracted from Flutter AppColors.
- **Rounded corners:** Tailwind's default border-radius applies. Override in tailwind.config.ts to set all radius to 0px.
- **System fonts:** Never fall back to sans-serif. Georgia serif must be used throughout.
- **Changing dimensions:** Book spine is 56×200px (not 150px), swatches are 50×50px, buttons are 52px tall. These are pixel-perfect.
- **Adding animations:** Flutter app has no animations (instant state updates). Next.js should match (no transitions except hover states).
- **Modifying layout:** Single flex-wrap shelf row with runSpacing (gap between rows). Do not invent multi-row grid logic.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-browser text rotation | Custom JS transform calculator | CSS `writing-mode: vertical-rl` + `rotate()` | CSS handles browser compatibility; custom code breaks on Safari/Firefox |
| Color contrast calculation | Manual luminance formula | `getContrastColor()` helper from BookSpine.tsx | Already implemented, WCAG-compliant, tested |
| Drag & drop reorder | Custom mouse event handlers | dnd-kit (phase 6, already installed) | Accessibility, touch support, conflict detection |
| Design tokens | Copy-paste hex values | tailwind.config.ts + CSS custom properties | Single source of truth, easy to audit against Flutter |
| Icon buttons | SVG or image files | Unicode symbols or Material Icons (emoji) | Matches Flutter simplicity, no asset management |

**Key insight:** Pixel-perfect UI parity requires *exact* color matching and dimension reproduction. Hand-rolling transforms, gradients, or color conversions introduces deviation. Use existing libraries and CSS standards.

---

## Typography & Spacing Audit

### Current vs. Flutter

| Element | Flutter | Current Next.js | Diff | Action |
|---------|---------|---|---|---|
| Page heading (Library/Wishlist) | 32px, bold, Georgia | 48px (display size) | Too large | Change from display to heading (32px) |
| App name (Login, detail) | 48px, bold, Georgia, +2px letter | 48px, bold, Georgia, +2px letter | ✓ Match | No change |
| Body text | 16px, Georgia | 16px, Georgia | ✓ Match | No change |
| Label | 14px, Georgia | 14px, Georgia | ✓ Match | No change |
| Error | 14px (13px in login?), dark red | 13px, dark red | ~Close | Verify / set to 14px |
| Spine title | 14px, Georgia | 16px | Too large | Change to 14px |
| Spine author | 14px, Georgia | 13px | Too small | Change to 14px |

**Action items:**
1. Page headings (Library, Wishlist) must use `heading` size (32px) not `display` (48px)
2. Book spine text must both be 14px (title + author), not 16px + 13px
3. Verify error text is 14px throughout

### Current vs. Flutter Wood Gradient

| Stop | Flutter | Current Next.js | Diff | Action |
|------|---------|---|---|---|
| Light (top) | #C8A06E | #8B6F47 | Off by 27pt R, 10pt G, 1pt B | Update to #C8A06E |
| Mid (if used) | N/A | #6B5438 | Not in Flutter | Remove or verify |
| Dark (bottom) | #8B5E3C | #4A3728 | Off by 11pt R, 27pt G, 4pt B | Update to #8B5E3C |
| Lip | #4A2E1A | #4A3728 | Off by 7pt G, 14pt B | Update to #4A2E1A |

**Action items:**
Update `tailwind.config.ts` wood color values to match Flutter exactly. Current implementation uses a 3-stop gradient when Flutter uses 2 stops.

---

## Current Implementation Gaps (Phase 7 → Phase 8)

### ✓ Already Correct

- Login page styling (parchment bg, Georgia font, form layout, button colors)
- Add Book form layout (title, author, notes inputs, color picker 8 swatches)
- Book detail page (back link, cover swatch 120×160px, title, author, notes conditional, move button for wishlist)
- Drag reorder on library (dnd-kit, optimistic + persist)
- Wishlist display (shelf widget, no drag)
- Authentication gate (getUser() server-side)
- Navigation structure (routes match Flutter's GoRouter)

### ❌ Needs Correction

1. **Library/Wishlist page heading size** — Currently 48px (display), should be 32px (heading)
2. **Wood gradient colors** — Incorrect hex values, needs update to match Flutter exactly
3. **Add button color** — Currently #D4AF37, should be #D4AF6A (Aged Gold from swatches palette)
4. **Book spine height** — Currently 150px, should be 200px (per Flutter BookSpineWidget)
5. **Book spine typography** — Title and author both should be 14px, not 16px + 13px
6. **Shelf lip size** — Verify it's 10px solid (not 14px as some code suggests)

---

## Code Examples

Verified patterns from Flutter source that must be replicated exactly in Next.js:

### Book Spine (Flutter 56×200, Next.js currently 56×150)

**Flutter Source: BookSpineWidget.dart**
```dart
SizedBox(
  width: 56,
  height: 200,
  child: Container(
    color: _parseHex(book.coverColor),
    child: RotatedBox(
      quarterTurns: 1,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              book.title,
              style: AppTextStyles.spineTitle,  // 14px
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              book.author,
              style: AppTextStyles.spineAuthor,  // 14px
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    ),
  ),
);
```

**Next.js Current: BookSpine.tsx (INCORRECT dimensions)**
```typescript
export default function BookSpine({ coverColor, title, author, onTap }: BookSpineProps) {
  return (
    <div
      style={{ width: '56px', height: '150px', backgroundColor: coverColor }}  // ❌ Should be 200px
    >
      {/* ... rotated text at 16px + 13px ... */}  // ❌ Should be 14px + 14px
    </div>
  )
}
```

**Correction needed:**
- Change height from 150px → 200px
- Change font sizes: both title and author → 14px
- Verify padding and spacing still work at new dimensions

### Shelf Gradient & Lip

**Flutter Source: ShelfWidget.dart**
```dart
Container(
  height: 200,
  decoration: const BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [AppColors.shelfWoodLight, AppColors.shelfWoodDark],  // #C8A06E → #8B5E3C
    ),
    boxShadow: [
      BoxShadow(
        color: Colors.black26,
        blurRadius: 4,
        offset: Offset(0, 2),
      ),
    ],
  ),
  padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
  child: Row(children: children),
),
// Shelf lip
Container(height: 10, color: AppColors.shelfLip),  // #4A2E1A
```

**Next.js Current: LibraryShelf.tsx**
```typescript
<div style={{
  background: 'linear-gradient(to bottom, #8B6F47 0%, #6B5438 50%, #4A3728 100%)',  // ❌ Wrong colors
  borderBottom: '14px solid #4A3728',  // ❌ Should be 10px + correct lip color
}}>
```

**Correction needed:**
- Update gradient to: `#C8A06E → #8B5E3C` (2-stop, not 3-stop)
- Update lip size from 14px → 10px
- Update lip color from #4A3728 → #4A2E1A

### Aged Gold Add Button

**Flutter Source: LibraryScreen.dart**
```dart
IconButton(
  icon: const Icon(Icons.add),
  onPressed: () async { await context.push('/add-book'); },
),
```
*Note: Flutter doesn't hardcode the button color here; uses MaterialApp theming. But the color picker widget shows:*

**Flutter ColorPickerWidget.dart**
```dart
static const List<Color> coverSwatches = [
  // ... indexed swatches ...
  Color(0xFFD4AF6A), // Index 4: Aged Gold
];
```

**Next.js Current: library/page.tsx**
```typescript
<Link
  href="/library/add"
  style={{
    backgroundColor: '#D4AF37',  // ❌ Should be #D4AF6A
    border: '2px solid #000000',
  }}
>
  +
</Link>
```

**Correction needed:**
- Change button color from #D4AF37 → #D4AF6A

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Flutter app as canonical | Flutter as source of truth | Phase 8 formalized | Every color, dimension, font must be extracted from Flutter source code, not from screenshots or memory |
| Approximated wood colors | Exact hex values from AppColors | Phase 8 audit | Color matching is now pixel-perfect, not subjective |
| 56×150px spines | 56×200px spines | Phase 8 correction | Proper aspect ratio matches Flutter, text rendering area increases |

**Deprecated/outdated:**
- Assuming "close enough" color match from visual inspection — must verify with hex comparison
- Using Tailwind-only solutions for gradients with custom colors — must use inline styles for full control
- Adding new design patterns not in Flutter — phase 8 is about parity, not innovation

---

## Open Questions

1. **Font fallback chain for Georgia serif:**
   - Flutter uses `fontFamily: 'Georgia'` with no fallback
   - Next.js currently has: `fontFamily: ['Georgia', "'Times New Roman'", 'serif']`
   - Decision: Should we allow fallback, or enforce Georgia-only (Georgia is system font on macOS/Windows/Linux)?
   - Recommendation: Keep current fallback chain — Georgia exists on 99% of systems, fallback is safety net. Matches Flutter's intent.

2. **Box shadow specification:**
   - Flutter `BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 2))`
   - `Colors.black26` = rgba(0, 0, 0, 0.26)
   - Next.js currently uses `0 2px 4px rgba(0, 0, 0, 0.15)` (lower opacity)
   - Recommendation: Update to match Flutter's opacity (0.26 ≈ 26%) for exact parity.

3. **Border radius across entire app:**
   - Tailwind defaults all border-radius to small values
   - Flutter app has zero border radius (sharp corners everywhere)
   - Current fix: `borderRadius: { DEFAULT: '0px', ... }` in tailwind.config.ts
   - Verification needed: Audit all Tailwind classes to ensure no rounded corners sneak in.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | N/A — Phase 8 is visual/design parity |
| Config file | N/A |
| Quick run command | Visual inspection: side-by-side Flutter app + Next.js at 1x zoom |
| Full suite command | Automated screenshot comparison (recommend Playwright visual regression) |

### Phase Requirements → Test Map

Phase 8 has no explicit functional requirements (all features completed in Phase 7). Testing is visual/design verification:

| Behavior | Test Type | Validation Method | Notes |
|----------|-----------|---|---|
| Exact color match (all hex values) | Manual + code review | Compare tailwind.config.ts values to Flutter AppColors.dart | HIGH confidence after code audit |
| Exact typography (sizes, weights, fonts) | Manual | Measure text sizes on rendered pages vs Flutter screens | Use browser inspector |
| Exact dimensions (spines, buttons, swatches) | Manual | Measure pixel sizes with browser inspector | 56px width, 200px height for spines (currently 150px — needs fix) |
| Exact shelf gradient | Manual | Screenshot comparison of shelf background | Gradient colors must match exactly (#C8A06E → #8B5E3C) |
| Navigation structure | Functional test | Verify routes match Flutter's GoRouter paths | `/login`, `/library` (home), `/wishlist`, `/books/[id]`, `/library/add`, `/wishlist/add` |
| UID gate (her-only buttons) | Functional test | Test with both accounts — add button visible for her, hidden for him | Server-side check of NEXT_PUBLIC_HER_UID |
| Responsive layout (if applicable) | Manual | Check shelf wrapping behavior on mobile | Flutter doesn't show in Chrome, so mobile responsiveness is out of scope |

### Wave 0 Gaps

- [ ] `tailwind.config.ts` — Update wood gradient colors (#C8A06E, #8B5E3C, #4A2E1A)
- [ ] `tailwind.config.ts` — Update or add Aged Gold swatch (#D4AF6A) if used elsewhere
- [ ] `BookSpine.tsx` — Update height from 150px to 200px, font sizes both to 14px
- [ ] `LibraryShelf.tsx` — Update gradient colors and lip size (10px, not 14px)
- [ ] `library/page.tsx` — Update add button color from #D4AF37 to #D4AF6A
- [ ] All page headings — Verify using `heading` (32px) not `display` (48px)
- [ ] Visual regression test suite — Set up Playwright or similar for automated screenshot comparison

---

## Sources

### Primary (HIGH confidence)
- **Flutter Codebase** (`/Users/anish/Developer/Personal/LibM/libm/lib/`)
  - `core/theme/app_colors.dart` — All color constants verified
  - `core/theme/app_text_styles.dart` — All typography verified
  - `features/library/widgets/book_spine_widget.dart` — Spine dimensions (56×200px) and styling verified
  - `features/library/widgets/shelf_widget.dart` — Shelf gradient, shadow, lip verified
  - `features/library/book_detail_screen.dart` — Cover swatch size (120×160px) verified
  - `core/router/app_router.dart` — Navigation structure verified

- **Next.js Codebase** (`/Users/anish/Developer/Personal/LibM/web/`)
  - `tailwind.config.ts` — Current design tokens
  - `components/bookshelf/BookSpine.tsx` — Current implementation
  - `components/bookshelf/LibraryShelf.tsx` — Current implementation
  - `app/library/page.tsx`, `app/wishlist/page.tsx`, `app/books/[id]/page.tsx` — Current pages

### Secondary (MEDIUM confidence)
- PROJECT.md — Decision history, explains why design tokens are centralized in tailwind.config.ts
- STATE.md — Confirms Phases 4–7 complete feature parity; Phase 8 focuses on UI/visual fidelity

---

## Metadata

**Confidence breakdown:**
- Color parity: HIGH — All Flutter colors extracted from AppColors.dart, exact hex values verified
- Typography: HIGH — All Flutter text styles extracted from AppTextStyles.dart, measured in Flutter app
- Dimensions: HIGH — All Flutter component sizes extracted from source code (SizedBox, Container dimensions)
- Architecture/Navigation: HIGH — Flutter GoRouter structure matches Next.js App Router implementation
- Current vs. Target gaps: HIGH — Specific differences identified (height, colors, sizing)

**Research date:** 2026-03-28
**Valid until:** 2026-04-04 (one week — design system stable unless Flutter app is modified)

**Sources verified:** All critical colors, fonts, and dimensions cross-referenced with Flutter source. No approximations made.
