# Phase 3: Wishlist & Detail - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the discussion.

**Date:** 2026-03-22
**Phase:** 03-wishlist-detail
**Mode:** discuss
**Areas discussed:** Wishlist screen layout, Wishlist permissions UX, Move-to-library action, Book detail view

---

## Areas Discussed

### Wishlist Screen Layout
**Question:** Same visual shelf as library, vertical list, or shelf with no drag?
**Decision:** Shelf with no drag — same spine-on-shelf visual, books in chronological order (no reorder)
**Rationale:** Consistent aesthetic with the library; the wishlist feels like a preview of her future shelf. Simpler than library (no ReorderableWrap needed).

### Wishlist Permissions UX
**Question:** What does he see when the add button is only for her?
**Decision:** No add button at all in his view — the '+' is conditionally rendered based on his UID. No disabled state, no label.
**Rationale:** Clean, silent asymmetry. He uses the wishlist to act (move to library), not to add.

### Move-to-Library Action
**Question:** Where does the "move to library" action live — in detail, on the spine, or both?
**Decision:** In book detail only. Tap spine → open detail → "Move to Library" button at bottom.
**Rationale:** Clean separation: wishlist is read-only at list level, action happens inside the book. One consistent interaction model.

### Book Detail View
**Question:** Read-only all fields, or read-only with edit button?
**Decision:** Read-only, all fields (cover swatch, title, author, notes). No edit path from detail.
**Rationale:** Keeps scope tight. Editing is a future capability. "Move to Library" button present only for wishlist books.

---

## No Corrections or Scope Creep

Discussion stayed within phase scope. No deferred ideas surfaced during discussion beyond the already-known deferrals (image upload, book editing).
