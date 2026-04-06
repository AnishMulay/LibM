-- LibM: repair and harden books RLS policies
-- Apply this against the same Supabase project your Vercel app uses.
-- The UUIDs below are project-specific. Replace them with the current IDs
-- from Authentication > Users in the deployed Supabase project before running.

DO $$
DECLARE
  user_a_uid UUID := 'd05b0e9e-17a4-489b-a775-03fe3fbab83d'; -- Shruti
  user_b_uid UUID := '67981be5-832f-44d4-bd45-a8a331565891'; -- Anish
BEGIN
  ALTER TABLE books ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "two_users_only_select" ON books;
  DROP POLICY IF EXISTS "two_users_only_insert" ON books;
  DROP POLICY IF EXISTS "two_users_only_update" ON books;
  DROP POLICY IF EXISTS "two_users_only_delete" ON books;

  EXECUTE format(
    'CREATE POLICY "two_users_only_select" ON books
       FOR SELECT
       USING (auth.uid() IN (''%s''::UUID, ''%s''::UUID))',
    user_a_uid, user_b_uid
  );

  EXECUTE format(
    'CREATE POLICY "two_users_only_insert" ON books
       FOR INSERT
       WITH CHECK (
         auth.uid() = user_id
         AND auth.uid() IN (''%s''::UUID, ''%s''::UUID)
       )',
    user_a_uid, user_b_uid
  );

  EXECUTE format(
    'CREATE POLICY "two_users_only_update" ON books
       FOR UPDATE
       USING (auth.uid() IN (''%s''::UUID, ''%s''::UUID))
       WITH CHECK (
         auth.uid() IN (''%s''::UUID, ''%s''::UUID)
         AND user_id IN (''%s''::UUID, ''%s''::UUID)
       )',
    user_a_uid, user_b_uid, user_a_uid, user_b_uid, user_a_uid, user_b_uid
  );

  EXECUTE format(
    'CREATE POLICY "two_users_only_delete" ON books
       FOR DELETE
       USING (auth.uid() IN (''%s''::UUID, ''%s''::UUID))',
    user_a_uid, user_b_uid
  );
END $$;

-- Useful checks after applying:
-- SELECT id, email FROM auth.users ORDER BY created_at;
-- SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'books';
