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
-- Create the missing portal record for existing student accounts.
INSERT INTO public.students (profile_id)
SELECT p.id
FROM public.profiles p
WHERE p.role = 'student'
  AND NOT EXISTS (
    SELECT 1 FROM public.students s WHERE s.profile_id = p.id
  );

-- Automatically create a portal record for every future student registration.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  account_role TEXT := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    account_role
  );

  IF account_role = 'student' THEN
    INSERT INTO public.students (profile_id) VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create the class timetable table used by the Student Schedule page.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.class_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade TEXT NOT NULL,
  class TEXT NOT NULL,
  day TEXT NOT NULL,
  subject TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT
);

ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own schedule" ON public.class_schedule;
CREATE POLICY "Students can view own schedule" ON public.class_schedule FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.profile_id = auth.uid()
        AND s.grade = class_schedule.grade
        AND s.class = class_schedule.class
    )
    OR public.has_role('teacher')
    OR public.has_role('admin')
  );

DROP POLICY IF EXISTS "Admins can manage schedules" ON public.class_schedule;
CREATE POLICY "Admins can manage schedules" ON public.class_schedule FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));
-- Create teacher class assignments used by the Teacher Portal and Admin assignments page.
CREATE TABLE IF NOT EXISTS public.teacher_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  class TEXT NOT NULL,
  room TEXT,
  UNIQUE (teacher_id, subject, grade, class)
);

ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers and admins can view teacher classes" ON public.teacher_classes;
CREATE POLICY "Teachers and admins can view teacher classes" ON public.teacher_classes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.teachers t
      WHERE t.id = teacher_classes.teacher_id AND t.profile_id = auth.uid()
    )
    OR public.has_role('admin')
  );

DROP POLICY IF EXISTS "Admins can manage teacher classes" ON public.teacher_classes;
CREATE POLICY "Admins can manage teacher classes" ON public.teacher_classes FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));
-- Create missing portal records for existing teacher accounts.
INSERT INTO public.teachers (profile_id)
SELECT p.id
FROM public.profiles p
WHERE p.role = 'teacher'
  AND NOT EXISTS (
    SELECT 1 FROM public.teachers t WHERE t.profile_id = p.id
  );
