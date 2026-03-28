---
phase: quick
plan: 260328-okc
type: execute
wave: 1
depends_on: []
files_modified:
  - app/library/add/page.tsx
  - app/wishlist/add/page.tsx
autonomous: true
requirements: []

must_haves:
  truths:
    - "Saving a book from /library/add succeeds (no 400 error)"
    - "Saving a book from /wishlist/add succeeds (no 400 error)"
    - "Inserted rows in the books table have the correct user_id"
  artifacts:
    - path: "app/library/add/page.tsx"
      provides: "Fixed insert with user_id"
      contains: "user_id: user.id"
    - path: "app/wishlist/add/page.tsx"
      provides: "Fixed insert with user_id"
      contains: "user_id: user.id"
  key_links:
    - from: "handleSave (both pages)"
      to: "supabase.from('books').insert"
      via: "user.id from supabase.auth.getUser()"
      pattern: "user_id: user\\.id"
---

<objective>
Fix 400 Bad Request returned by Supabase when inserting a book row from /library/add and /wishlist/add.

Purpose: Both insert calls omit the required `user_id` field even though `user` is already fetched from `supabase.auth.getUser()` just before the insert. Supabase RLS or a NOT NULL constraint on `user_id` rejects the row, producing the 400.

Output: Both pages pass `user_id: user.id` in the insert payload, inserts succeed, and the user is redirected after saving.
</objective>

<execution_context>
@/Users/anish/Developer/Personal/LibM/.claude/get-shit-done/workflows/execute-plan.md
@/Users/anish/Developer/Personal/LibM/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@app/library/add/page.tsx
@app/wishlist/add/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add user_id to library add insert</name>
  <files>app/library/add/page.tsx</files>
  <action>
In `handleSave`, the insert object at line 84-91 is missing `user_id`. Add `user_id: user.id` as a field.
The `user` object is already obtained at line 63 via `supabase.auth.getUser()` and guarded against null/error before reaching the insert.
The `cover_color` field already sends a hex string (`coverColor!`) — no change needed there.

Change the insert from:
```ts
const { error } = await supabase.from('books').insert({
  title: title.trim(),
  author: author.trim(),
  cover_color: coverColor!,
  notes: notes.trim() || null,
  position: newPosition,
  is_wishlist: false,
})
```
to:
```ts
const { error } = await supabase.from('books').insert({
  user_id: user.id,
  title: title.trim(),
  author: author.trim(),
  cover_color: coverColor!,
  notes: notes.trim() || null,
  position: newPosition,
  is_wishlist: false,
})
```
  </action>
  <verify>
    <automated>cd /Users/anish/Developer/Personal/LibM/web && grep -n "user_id: user.id" app/library/add/page.tsx</automated>
  </verify>
  <done>app/library/add/page.tsx insert includes `user_id: user.id`</done>
</task>

<task type="auto">
  <name>Task 2: Add user_id to wishlist add insert</name>
  <files>app/wishlist/add/page.tsx</files>
  <action>
The wishlist add page has the identical bug — same pattern, same fix. In `handleSave`, the insert object at line 84-91 is missing `user_id`.

Change the insert from:
```ts
const { error } = await supabase.from('books').insert({
  title: title.trim(),
  author: author.trim(),
  cover_color: coverColor!,
  notes: notes.trim() || null,
  position: newPosition,
  is_wishlist: true,
})
```
to:
```ts
const { error } = await supabase.from('books').insert({
  user_id: user.id,
  title: title.trim(),
  author: author.trim(),
  cover_color: coverColor!,
  notes: notes.trim() || null,
  position: newPosition,
  is_wishlist: true,
})
```
  </action>
  <verify>
    <automated>cd /Users/anish/Developer/Personal/LibM/web && grep -n "user_id: user.id" app/wishlist/add/page.tsx</automated>
  </verify>
  <done>app/wishlist/add/page.tsx insert includes `user_id: user.id`</done>
</task>

</tasks>

<verification>
After both tasks:

```bash
# Confirm both files have the fix
grep -n "user_id: user.id" \
  /Users/anish/Developer/Personal/LibM/web/app/library/add/page.tsx \
  /Users/anish/Developer/Personal/LibM/web/app/wishlist/add/page.tsx

# TypeScript compilation check
cd /Users/anish/Developer/Personal/LibM/web && npx tsc --noEmit
```

Manually verify: Sign in, visit /library/add, fill the form, save — expect redirect to /library with no 400 error. Repeat at /wishlist/add.
</verification>

<success_criteria>
- Both insert calls include `user_id: user.id`
- POST to Supabase /rest/v1/books returns 201 (not 400)
- User is redirected to /library or /wishlist after save
- TypeScript compilation produces no new errors
</success_criteria>

<output>
No SUMMARY.md needed for quick fixes. If a summary is desired, create `.planning/quick/260328-okc-fix-400-bad-request-on-supabase-books-in/260328-okc-SUMMARY.md`.
</output>
