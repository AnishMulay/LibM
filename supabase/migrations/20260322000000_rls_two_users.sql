-- LibM: Two-user RLS constraint
-- Apply this migration in Supabase Dashboard > SQL Editor
-- Replace the two UUIDs below with the actual UIDs from your auth.users table.
--
-- To find UIDs: Supabase Dashboard > Authentication > Users > copy the UUID column

-- Replace with actual User A UID (her account — she adds to wishlist)
-- Replace with actual User B UID (his account — he buys and ships)

DO $$
DECLARE
  user_a_uid UUID := 'd05b0e9e-17a4-489b-a775-03fe3fbab83d'; -- Shruti
  user_b_uid UUID := '67981be5-832f-44d4-bd45-a8a331565891'; -- Anish
BEGIN

  -- Enable RLS on books table (created in Phase 2; safe to run now)
  -- ALTER TABLE books ENABLE ROW LEVEL SECURITY;

  -- Policy: only the two known UIDs can select any row
  -- Uncomment and apply per table as each table is created in later phases.
  --
  -- CREATE POLICY "two_users_only_select" ON books
  --   FOR SELECT USING (auth.uid() IN (user_a_uid, user_b_uid));
  --
  -- CREATE POLICY "two_users_only_insert" ON books
  --   FOR INSERT WITH CHECK (auth.uid() IN (user_a_uid, user_b_uid));
  --
  -- CREATE POLICY "two_users_only_update" ON books
  --   FOR UPDATE USING (auth.uid() IN (user_a_uid, user_b_uid));
  --
  -- CREATE POLICY "two_users_only_delete" ON books
  --   FOR DELETE USING (auth.uid() IN (user_a_uid, user_b_uid));

END $$;

-- Verify: after applying, run in SQL editor:
-- SELECT * FROM pg_policies WHERE tablename = 'books';
-- Expected: rows with (user_a_uid, user_b_uid) in the USING expression
