# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-23
**Phases:** 3 | **Plans:** 10 | **Tasks:** 21

### What Was Built
- Auth: login-only screen, two pre-created Supabase accounts, RLS enforcement at DB level, no sign-up flow
- Library: visual bookshelf with wood-grain shelves, book spine widgets (56×200px, rotated Georgia text, hex background), drag-reorder with optimistic UI
- Wishlist: she adds books, he moves them to library in one tap, UID gate enforces her-only add
- Book detail: full detail view with cover swatch, all fields, move-to-library action
- Cross-platform: full feature parity confirmed on physical iOS (him) and Android (her) devices

### What Worked
- Single-day delivery (1 day, 1,407 LOC) — tight scope and clear requirements meant no drift
- Optimistic UI pattern for drag-reorder made the shelf feel instant without extra complexity
- GoRouter + onAuthStateChange refresh stream handled all auth state transitions cleanly with no flicker
- Storing coverColor as hex TEXT in DB was simpler than a type column and worked perfectly
- Physical device verification at Phase 3 checkpoint caught nothing — parity was clean

### What Was Inefficient
- RLS migration required manual UUID substitution in Supabase Dashboard — a future improvement would be a seed script
- Two "Validated" sections ended up in PROJECT.md during phase transitions — milestone cleanup consolidated them
- No automated tests written; verification was human-only on physical devices

### Patterns Established
- `flutter_dotenv` + `.env.example` pattern for credentials (keeps secrets out of source control)
- `_GoRouterRefreshStream` inline ChangeNotifier for converting Supabase auth stream to GoRouter refreshListenable
- `BookDetailScreen` via constructor (not GoRouter state extraction) — keeps screens testable
- GoRouter extras: typed objects for complex params, Map for scalar params (e.g., `isWishlist` bool)
- Optimistic setState before async Supabase call — use for any user-perceived-instant operations
- Feature-first directory layout: `lib/features/{feature}/{screen}.dart`, core services in `lib/core/{service}/`

### Key Lessons
1. Scope discipline pays off: a 9-requirement v1 shipped in a single day. Resist adding requirements mid-phase.
2. Physical device testing at the end of each phase is worth it — no surprises at final verification.
3. RLS-enforced two-user constraint is watertight but requires manual UUID setup — document this clearly for anyone resuming.

### Cost Observations
- Model profile: budget
- Phases: 3 | Plans: 10
- Notable: Entire MVP in one session, one day — tight scope + clear planning = maximum efficiency

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 MVP | 3 | 10 | First milestone — baseline established |

### Top Lessons (Verified Across Milestones)

1. Tight scope + clear requirements = fast delivery
2. Human verification on physical devices beats emulator-only testing
