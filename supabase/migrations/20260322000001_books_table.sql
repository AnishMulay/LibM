-- LibM Phase 2: books table + RLS activation
-- Apply in Supabase Dashboard > SQL Editor
-- Uses the same two UIDs from 20260322000000_rls_two_users.sql

DO $$
DECLARE
  user_a_uid UUID := '67981be5-832f-44d4-bd45-a8a331565891'; -- REPLACE ME (same as migration 000000)
  user_b_uid UUID := '4840af1a-7d60-4b0d-a3e2-a8c8ecfbfb7f'; -- REPLACE ME (same as migration 000000)
BEGIN

  -- Create books table
  CREATE TABLE IF NOT EXISTS books (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    author      TEXT NOT NULL,
    cover_color TEXT NOT NULL DEFAULT '#F5F0E8',
    notes       TEXT,
    position    INTEGER NOT NULL DEFAULT 0,
    is_wishlist BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Enable RLS
  ALTER TABLE books ENABLE ROW LEVEL SECURITY;

  -- Policy: only the two known UIDs can SELECT any row
  EXECUTE format(
    'CREATE POLICY "two_users_only_select" ON books
       FOR SELECT USING (auth.uid() IN (''%s''::UUID, ''%s''::UUID))',
    user_a_uid, user_b_uid
  );

  -- Policy: only the two known UIDs can INSERT
  EXECUTE format(
    'CREATE POLICY "two_users_only_insert" ON books
       FOR INSERT WITH CHECK (auth.uid() IN (''%s''::UUID, ''%s''::UUID))',
    user_a_uid, user_b_uid
  );

  -- Policy: only the two known UIDs can UPDATE
  EXECUTE format(
    'CREATE POLICY "two_users_only_update" ON books
       FOR UPDATE USING (auth.uid() IN (''%s''::UUID, ''%s''::UUID))',
    user_a_uid, user_b_uid
  );

  -- Policy: only the two known UIDs can DELETE
  EXECUTE format(
    'CREATE POLICY "two_users_only_delete" ON books
       FOR DELETE USING (auth.uid() IN (''%s''::UUID, ''%s''::UUID))',
    user_a_uid, user_b_uid
  );

END $$;

-- Verify: run after applying:
-- SELECT * FROM pg_policies WHERE tablename = 'books';
-- Expected: 4 rows with two_users_only_{select,insert,update,delete}
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'books';
-- Expected: id, user_id, title, author, cover_color, notes, position, is_wishlist, created_at
