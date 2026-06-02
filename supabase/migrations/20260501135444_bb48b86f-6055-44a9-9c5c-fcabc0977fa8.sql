DROP POLICY IF EXISTS "Public can view memory images" ON storage.objects;
-- Public bucket already serves files via public URL without needing a SELECT policy.
-- Listing is now blocked for anonymous users (only service role can list).
