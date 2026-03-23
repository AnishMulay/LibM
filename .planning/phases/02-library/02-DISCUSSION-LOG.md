# Phase 2: Library - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the Q&A.

**Date:** 2026-03-22
**Phase:** 02-library
**Mode:** discuss
**Areas discussed:** Shelf & spine visuals, Add book flow, Data model & order

## Areas Discussed

### Shelf & Spine Visuals

| Question | Options Presented | User Selected |
|----------|------------------|---------------|
| How should the wooden shelf render? | Illustrated wood (Recommended), Simple ruled line | Illustrated wood |
| How wide should each book spine be? | Variable by title length (Recommended), Fixed width all same | Fixed width, all same |
| How should title/author text appear? | Rotated 90° down spine (Recommended), Horizontal on face | Rotated 90° down spine |
| How many per row / empty state? | Fill row + wrap (Recommended), Fixed slots per row | Fill row + wrap |
| Empty shelf state? | Empty shelf + add prompt (Recommended), Centered CTA | Empty shelf + add prompt |

### Add Book Flow

| Question | Options Presented | User Selected |
|----------|------------------|---------------|
| How does user trigger adding a book? | FAB (Recommended), App bar '+' button | App bar '+' button |
| How is the form presented? | Full-screen route (Recommended), Bottom sheet | Full-screen route |
| How does user choose cover color? | Fixed old-money palette (Recommended), Full color wheel | Fixed old-money palette |
| Image upload support? | Gallery only (Recommended), Gallery + camera | No image upload in v1 (user note: "Color palette only. Keep it simple.") |

### Data Model & Order

| Question | Options Presented | User Selected |
|----------|------------------|---------------|
| How should book order be stored? | Integer position column (Recommended), Fractional/LexoRank | Integer position column |
| Wishlist table strategy? | Single table + is_wishlist boolean (Recommended), Separate tables per phase | Single table + is_wishlist boolean |

## Corrections Made

No corrections — user selected recommended options throughout, with one explicit scope reduction:
- **Cover image upload**: LIB-03 specified "color or uploaded image" — user explicitly deferred image upload to a future phase. Captured in `<deferred>`.

## Deferred Ideas

- Image upload for book covers (future phase)
