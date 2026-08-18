-- Run this once in Supabase Dashboard -> SQL Editor to repair the deployed RLS policies.
-- It removes the recursive profile policy that prevents every logged-in dashboard from loading.

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = required_role
  );
$$;

REVOKE ALL ON FUNCTION public.has_role(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(TEXT) TO authenticated;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role('admin'));
-- Persist each user's choices from the Profile > Notification Preferences tab.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB NOT NULL
  DEFAULT '{"email": true, "grades": true, "events": false, "announcements": true}'::jsonb;
