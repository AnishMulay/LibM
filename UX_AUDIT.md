# UX/UI Audit: LibM

## Executive Summary

LibM has a coherent visual concept, but the interaction design is materially below the bar for a polished product. The app currently works more like a thin demo of a bookshelf than a trustworthy reading companion: core management actions are missing, key flows give weak or no feedback, and several states strand the user with too little context. The shelf aesthetic is distinctive, but readability, accessibility, and mobile ergonomics are all compromised by the fixed spine treatment and minimal interaction system. The result is an app that looks intentional at first glance, then quickly feels fragile, opaque, and harder to use than it should.

## 1. Missing Core Functionality

- `I01. Existing books cannot be edited after creation, so any typo, wrong author, wrong notes, or wrong color choice becomes permanent.` Where: book detail flow and both shelf views; tapping a book only opens a read-only detail screen. Ideal fix: add an `Edit` action from the detail screen, reuse the add-book form in edit mode, and prefill all existing values.
- `I02. There is no delete or archive action for books, which makes accidental entries, duplicates, and no-longer-wanted books impossible to clean up.` Where: library, wishlist, and book detail; there is no UI path to remove a record once saved. Ideal fix: add a destructive action on the detail screen with a confirmation step and a short-lived undo.
- `I03. Shelf membership is only reversible in one direction, even though the product model clearly supports two shelf states.` Where: wishlist books can move to Library, but library books cannot move back to Wishlist. Ideal fix: expose a symmetric `Move to Wishlist` action for library books and keep the action placement consistent across both shelf states.
- `I04. A common failure case has no recovery path: leaving the add-book form discards all typed content immediately.` Where: add-book screen; the back action just exits with no warning. Ideal fix: track dirty form state and show a discard confirmation before navigating away.

## 2. Navigation & Flow

- `I05. The information architecture is inconsistent and weakens orientation.` Where: the primary shelf is labeled `Library`, but its canonical route is `/home`; details live at `/book-detail?id=...`; there are also alias routes like `/library` and `/books/[id]`. Ideal fix: use one canonical URL per destination, make route names match nav labels, and move detail pages to a clean resource URL like `/books/[id]`.
- `I06. The book detail screen has almost no location context, so it feels detached from the rest of the app.` Where: book detail; the app bar title is blank and only shows a back arrow. Ideal fix: show the book title in the app bar or a clear breadcrumb/state label such as `Wishlist` or `Library`.
- `I07. Stale or invalid deep links lead to a generic Next.js not-found page instead of a branded recovery path.` Where: direct visits to invalid book detail routes. Ideal fix: replace the default dead-end 404 with an app-specific empty/error state that explains what happened and offers a route back to Library and Wishlist.
- `I08. Wishlist permissions are invisible, which makes the screen feel arbitrarily read-only for one of the two users.` Where: wishlist screen; the add button simply disappears for the non-owner account with no explanation. Ideal fix: explicitly label the wishlist as read-only for him, explain that only she can add items, and make that rule visible in the UI rather than hidden in behavior.

## 3. Empty States

- `I09. The library empty state is visually on-theme but functionally weak.` Where: empty Library view; it only says `Add your first book` and does not include an inline call to action. Ideal fix: add a primary `Add Book` button directly inside the empty state and a short sentence explaining what the shelf is for.
- `I10. The wishlist empty state is too thin and not role-aware.` Where: empty Wishlist view; it only says `Her wishlist is empty`, which is vague for her and passive for him. Ideal fix: make the copy depend on who is signed in, add a direct CTA for her, and give him useful guidance such as checking back later or returning to the Library.

## 4. Feedback & Responsiveness

- `I11. Reordering in the Library can fail silently, which makes the interface untrustworthy.` Where: drag-and-drop on the Library shelf; the UI optimistically reorders books, but failed saves are swallowed with no rollback or message. Ideal fix: show a transient `Saving order...` state, surface failures, and restore the previous order when persistence fails.
- `I12. The Library error state is a dead end.` Where: Library load failure; the user only sees error text with no retry action. Ideal fix: add a clear `Retry` button and keep the shelf chrome visible so the page still feels navigable.
- `I13. Successful actions disappear without acknowledgment.` Where: adding a book and moving a wishlist book to the Library; both flows simply navigate away after completion. Ideal fix: show a success toast/banner and briefly highlight the newly added or moved item when the user lands back on the shelf.
- `I14. Loading feedback is present but generic, so the app often feels frozen rather than responsive.` Where: login, library, wishlist, add-book save, and move-to-library. Ideal fix: pair spinners with contextual copy, use inline progress states where possible, and prefer shelf/form skeletons over blank waiting screens for page loads.
- `I15. Login errors are too raw and too opaque at the same time.` Where: login screen; backend error strings are shown directly, but the page gives no guidance about what a legitimate user should do next if login fails. Ideal fix: map auth failures to human-friendly copy and add a small support/help sentence for this private two-account product.

## 5. Micro-interactions & Polish

- `I16. Interactive elements do not have a shared behavior system, so the app feels dead under the cursor.` Where: primary buttons, color swatches, book spines, and most form controls; only a few nav/icon buttons have hover behavior. Ideal fix: define consistent hover, pressed, and disabled states across all clickable elements.
- `I17. The app uses almost no motion to explain change.` Where: add, move, and screen-state transitions; UI changes are abrupt and binary. Ideal fix: add restrained transitions for shelf updates, button state changes, and page-entry moments so the interface feels deliberate instead of jumpy.

## 6. Typography & Readability

- `I18. The bookshelf interaction prioritizes the aesthetic of narrow spines over actual scanability.` Where: Library and Wishlist shelves; titles/authors are rotated, tightly constrained, and heavily truncated. Ideal fix: preserve the shelf look, but add a richer preview on hover/focus/tap, support longer readable labels in a tooltip or detail card, and consider a more compact alternative layout on smaller screens.
- `I19. Text hierarchy is strong in headlines but underpowered in supporting states.` Where: error copy, helper copy, and empty states across the app. Ideal fix: establish clearer secondary text styles and longer explanatory copy where the user needs guidance, not just labels.

## 7. Consistency

- `I20. Similar screens solve similar problems in inconsistent ways.` Where: Wishlist has a retry affordance but Library does not; top-level shelves use a top nav while detail/add screens use a different chrome pattern; actions are sometimes labeled and sometimes icon-only. Ideal fix: standardize state handling, page chrome, and action language so comparable moments behave the same everywhere.
- `I21. The app has a visual system, but not yet a product interaction system.` Where: across navigation, button treatment, error handling, empty states, and action outcomes. Ideal fix: define a small set of repeatable UX patterns for loading, success, failure, destructive actions, and read-only states, then apply them across every flow.

## 8. Accessibility

- `I22. Keyboard focus visibility is too weak and too inconsistent for a custom UI.` Where: nav links, icon buttons, primary buttons, book spines, and color swatches; there are no explicit `focus-visible` treatments across the system. Ideal fix: add a clear, high-contrast focus ring for every interactive element and ensure it is consistent on mouse, keyboard, and touch-assisted devices.
- `I23. Library reordering is effectively pointer-only.` Where: drag-and-drop on the Library shelf; there is no keyboard sensor or clear non-pointer reorder path. Ideal fix: implement keyboard drag-and-drop support or provide alternate reorder controls for assistive tech and keyboard-only users.
- `I24. Loading buttons lose their accessible name while busy.` Where: the shared primary button swaps its text for an `aria-hidden` spinner during loading. Ideal fix: keep the button label available to assistive technologies and add `aria-busy` or a visually hidden status string.
- `I25. The color picker is technically labeled but semantically poor.` Where: add-book screen; swatches announce raw hex values like `Select #F5F0E8`, which is not meaningful to humans. Ideal fix: give each swatch a readable color name, expose the selected value in text, and strengthen the visual selected state beyond a thin border.

## 9. Mobile & Responsiveness

- `I26. The bookshelf is only lightly responsive, not genuinely mobile-optimized.` Where: Library and Wishlist on smaller screens; book spines stay fixed at `56x200`, row gaps remain large, and the sticky nav still consumes a lot of vertical space. Ideal fix: scale spine dimensions and spacing down at mobile breakpoints, tighten the sticky header, and test the shelf for fast thumb-scanning on narrow devices.
- `I27. The main shelf views are likely to become scroll-heavy faster than necessary on phones.` Where: any medium-to-large collection on mobile. Ideal fix: reduce vertical waste between rows, consider denser mobile shelf packing, and surface quick metadata or filters so users can find books without excessive scrolling.

## 10. Anything Else

- `I28. The app does not explain itself well enough for a first-time user.` Where: especially login and wishlist; the product is private, role-based, and relationship-specific, but the interface assumes the user already understands the rules. Ideal fix: add a little onboarding copy in the right places so the product model is legible without needing prior context.
- `I29. Book detail is a cul-de-sac for comparison browsing.` Where: detail screen; after opening one book, the only path is back, which makes comparing several books tedious. Ideal fix: add adjacent navigation, a close-to-shelf pattern that preserves position, or a preview drawer pattern instead of forcing full backtracking every time.

## Priority List

- `P1 — I11. Reordering in the Library can fail silently, which makes the interface untrustworthy.`
- `P1 — I01. Existing books cannot be edited after creation, so common mistakes are permanent.`
- `P1 — I02. There is no delete or archive action for books, so the collection cannot be cleaned up.`
- `P1 — I03. Shelf membership is only reversible in one direction; users cannot move a library book back to Wishlist.`
- `P1 — I08. Wishlist permissions are invisible, which makes the screen feel arbitrarily read-only for one user.`
- `P1 — I22. Keyboard focus visibility is too weak and too inconsistent for a custom UI.`
- `P1 — I23. Library reordering is effectively pointer-only.`
- `P2 — I05. The information architecture is inconsistent and weakens orientation.`
- `P2 — I06. The book detail screen has almost no location context.`
- `P2 — I09. The library empty state is visually on-theme but functionally weak.`
- `P2 — I10. The wishlist empty state is too thin and not role-aware.`
- `P2 — I12. The Library error state is a dead end.`
- `P2 — I13. Successful actions disappear without acknowledgment.`
- `P2 — I14. Loading feedback is present but generic, so the app often feels frozen rather than responsive.`
- `P2 — I15. Login errors are too raw and too opaque at the same time.`
- `P2 — I16. Interactive elements do not have a shared behavior system, so the app feels dead under the cursor.`
- `P2 — I18. The bookshelf interaction prioritizes narrow-spine aesthetics over scanability.`
- `P2 — I20. Similar screens solve similar problems in inconsistent ways.`
- `P2 — I24. Loading buttons lose their accessible name while busy.`
- `P2 — I25. The color picker is technically labeled but semantically poor.`
- `P2 — I26. The bookshelf is only lightly responsive, not genuinely mobile-optimized.`
- `P2 — I28. The app does not explain itself well enough for a first-time user.`
- `P3 — I04. Leaving the add-book form discards typed content immediately.`
- `P3 — I07. Stale or invalid deep links lead to a generic Next.js not-found page instead of a branded recovery path.`
- `P3 — I17. The app uses almost no motion to explain change.`
- `P3 — I19. Text hierarchy is strong in headlines but underpowered in supporting states.`
- `P3 — I21. The app has a visual system, but not yet a product interaction system.`
- `P3 — I27. The main shelf views are likely to become scroll-heavy faster than necessary on phones.`
- `P3 — I29. Book detail is a cul-de-sac for comparison browsing.`
