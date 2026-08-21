-- ================================================================
-- STIS School — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → Run
-- ================================================================

-- ── Enable UUID extension ────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- PROFILES
-- Extended user info tied to auth.users
-- ================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT,
  role        TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
  phone       TEXT,
  address     TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile when a new auth user signs up
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- STUDENTS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.students (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  grade       TEXT,
  class       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- TEACHERS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.teachers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject     TEXT,
  department  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- GRADES
-- ================================================================
CREATE TABLE IF NOT EXISTS public.grades (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject     TEXT NOT NULL,
  score       NUMERIC(5, 2) CHECK (score >= 0 AND score <= 100),
  term        TEXT CHECK (term IN ('Term 1', 'Term 2', 'Term 3')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ATTENDANCE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.attendance (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id  UUID REFERENCES public.students(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  UNIQUE (student_id, date)
);

-- ================================================================
-- ADMISSIONS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.admissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  grade_applying  TEXT NOT NULL,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROLE CHECK HELPER
-- SECURITY DEFINER prevents RLS policies from recursively querying profiles.
-- ================================================================
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
-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;

-- ── Profiles ────────────────────────────────────────────────────
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    public.has_role('admin')
  );

-- ── Students ────────────────────────────────────────────────────
CREATE POLICY "Students can view own record"
  ON public.students FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Teachers and admins can view all students"
  ON public.students FOR SELECT
  USING (
    (public.has_role('teacher') OR public.has_role('admin'))
  );

-- ── Grades ──────────────────────────────────────────────────────
CREATE POLICY "Students can view own grades"
  ON public.grades FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = grades.student_id AND s.profile_id = auth.uid()
    )
  );

CREATE POLICY "Teachers and admins can view all grades"
  ON public.grades FOR SELECT
  USING (
    (public.has_role('teacher') OR public.has_role('admin'))
  );

CREATE POLICY "Teachers can insert grades"
  ON public.grades FOR INSERT
  WITH CHECK (
    (public.has_role('teacher') OR public.has_role('admin'))
  );

CREATE POLICY "Teachers can update grades"
  ON public.grades FOR UPDATE
  USING (
    (public.has_role('teacher') OR public.has_role('admin'))
  );

-- ── Attendance ──────────────────────────────────────────────────
CREATE POLICY "Students can view own attendance"
  ON public.attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.id = attendance.student_id AND s.profile_id = auth.uid()
    )
  );

CREATE POLICY "Teachers and admins can manage attendance"
  ON public.attendance FOR ALL
  USING (
    (public.has_role('teacher') OR public.has_role('admin'))
  );

-- ── Admissions ──────────────────────────────────────────────────
-- Anyone can submit an admission (even unauthenticated users)
CREATE POLICY "Anyone can submit admission"
  ON public.admissions FOR INSERT
  WITH CHECK (true);

-- Only admins can read/update admissions
CREATE POLICY "Admins can manage admissions"
  ON public.admissions FOR ALL
  USING (
    public.has_role('admin')
  );


-- ================================================================
-- VACATION POSTS
-- Run this section in Supabase before using the admin Vacation Posts page.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.vacation_posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  term          TEXT NOT NULL,
  dates         TEXT NOT NULL,
  subjects      TEXT[] NOT NULL DEFAULT '{}',
  fees          JSONB NOT NULL DEFAULT '[]'::jsonb,
  accommodation TEXT,
  image_url     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vacation_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active vacation posts"
  ON public.vacation_posts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage vacation posts"
  ON public.vacation_posts FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));


-- Vacation flyer uploads (run this section in Supabase before using Add flyer)
INSERT INTO storage.buckets (id, name, public)
VALUES ('vacation-flyers', 'vacation-flyers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Admins can upload vacation flyers" ON storage.objects;
CREATE POLICY "Admins can upload vacation flyers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'vacation-flyers' AND
    public.has_role('admin')
  );

DROP POLICY IF EXISTS "Anyone can view vacation flyers" ON storage.objects;
CREATE POLICY "Anyone can view vacation flyers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vacation-flyers');


-- ================================================================
-- PORTAL DASHBOARD DATA AND SECURITY
-- Run this section in Supabase SQL Editor before using the live dashboards.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.parent_students (
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.teacher_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  class TEXT NOT NULL,
  room TEXT,
  UNIQUE (teacher_id, subject, grade, class)
);

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

ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Parents can view their children" ON public.parent_students;
CREATE POLICY "Parents can view their children" ON public.parent_students FOR SELECT
  USING (parent_id = auth.uid() OR public.has_role('admin'));

DROP POLICY IF EXISTS "Admins can manage parent links" ON public.parent_students;
CREATE POLICY "Admins can manage parent links" ON public.parent_students FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

DROP POLICY IF EXISTS "Teachers and admins can view teacher classes" ON public.teacher_classes;
CREATE POLICY "Teachers and admins can view teacher classes" ON public.teacher_classes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.teachers t WHERE t.id = teacher_id AND t.profile_id = auth.uid()) OR public.has_role('admin'));

DROP POLICY IF EXISTS "Admins can manage teacher classes" ON public.teacher_classes;
CREATE POLICY "Admins can manage teacher classes" ON public.teacher_classes FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

DROP POLICY IF EXISTS "Students can view own schedule" ON public.class_schedule;
CREATE POLICY "Students can view own schedule" ON public.class_schedule FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.profile_id = auth.uid() AND s.grade = class_schedule.grade AND s.class = class_schedule.class) OR (public.has_role('teacher') OR public.has_role('admin')));

DROP POLICY IF EXISTS "Admins can manage schedules" ON public.class_schedule;
CREATE POLICY "Admins can manage schedules" ON public.class_schedule FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

DROP POLICY IF EXISTS "Parents can view linked student grades" ON public.grades;
CREATE POLICY "Parents can view linked student grades" ON public.grades FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = grades.student_id));

DROP POLICY IF EXISTS "Parents can view linked student attendance" ON public.attendance;
CREATE POLICY "Parents can view linked student attendance" ON public.attendance FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.parent_students ps WHERE ps.parent_id = auth.uid() AND ps.student_id = attendance.student_id));

DROP POLICY IF EXISTS "Admins can manage students" ON public.students;
CREATE POLICY "Admins can manage students" ON public.students FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

DROP POLICY IF EXISTS "Admins can manage teachers" ON public.teachers;
CREATE POLICY "Admins can manage teachers" ON public.teachers FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

-- Public signup always creates a student. Privileged accounts must be provisioned by the school.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'New User'), NEW.email, 'student');
  
  INSERT INTO public.students (profile_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (name, email, phone, address, bio) ON public.profiles TO authenticated;

-- ================================================================
-- GALLERY AND NEWS CONTENT MANAGEMENT
-- Run this section in Supabase SQL Editor before using the admin pages.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Campus', 'Events', 'Sports', 'Academics')),
  image_url TEXT NOT NULL,
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.news_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view gallery images" ON public.gallery_images;
CREATE POLICY "Anyone can view gallery images" ON public.gallery_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;
CREATE POLICY "Admins can manage gallery images" ON public.gallery_images FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

DROP POLICY IF EXISTS "Anyone can view news posts" ON public.news_posts;
CREATE POLICY "Anyone can view news posts" ON public.news_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage news posts" ON public.news_posts;
CREATE POLICY "Admins can manage news posts" ON public.news_posts FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;
CREATE POLICY "Admins can upload gallery images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery-images' AND public.has_role('admin'));
DROP POLICY IF EXISTS "Admins can delete gallery images" ON storage.objects;
CREATE POLICY "Admins can delete gallery images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'gallery-images' AND public.has_role('admin'));
DROP POLICY IF EXISTS "Anyone can view gallery image files" ON storage.objects;
CREATE POLICY "Anyone can view gallery image files" ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery-images');

-- ================================================================
-- EVENTS MANAGEMENT
-- Run this section in Supabase SQL Editor before using the admin Events page.
-- Past vs upcoming is derived automatically: event_date < today = past.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  event_date   DATE NOT NULL,
  time_label   TEXT,                        -- e.g. "8:00 AM – 3:00 PM"
  location     TEXT NOT NULL DEFAULT 'Sir Tshobs International School',
  description  TEXT,
  is_featured  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING  (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

-- ================================================================
-- ADMIN ACCOUNT PROVISIONING EDGE FUNCTION
-- Deploy after reviewing: supabase functions deploy admin-create-account
-- The function verifies the caller's profiles.role is admin before it can
-- create a teacher, parent, or administrator account. Never expose the
-- SUPABASE_SERVICE_ROLE_KEY in the React application.
-- ================================================================

-- ================================================================
-- CONTACT MESSAGES
-- Run this section in Supabase SQL Editor before deploying the contact form.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new'
               CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;
CREATE POLICY "Admins can manage contact messages"
  ON public.contact_messages FOR ALL
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));
-- ================================================================
-- PROFILE AVATARS
-- Run this section in Supabase SQL Editor before enabling photo uploads.
-- ================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_path TEXT;
GRANT UPDATE (avatar_path) ON public.profiles TO authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Users can upload own avatars" ON storage.objects;
CREATE POLICY "Users can upload own avatars" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users can view own avatars" ON storage.objects;
CREATE POLICY "Users can view own avatars" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
-- ================================================================
-- PARENT SELF-REGISTRATION
-- Give each enrolled student a unique student number and a private
-- parent access code. Share the code only with that student's parent.
-- Deploy the matching function with:
--   supabase functions deploy parent-self-register
-- ================================================================
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS student_number TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS parent_access_code TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS students_student_number_unique
  ON public.students (student_number)
  WHERE student_number IS NOT NULL;
-- ================================================================
-- PROFILE NOTIFICATION PREFERENCES
-- ================================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB NOT NULL
  DEFAULT '{"email": true, "grades": true, "events": false, "announcements": true}'::jsonb;

-- ================================================================
-- LIKES & DISLIKES
-- Run this section in Supabase SQL Editor to enable reactions on
-- Events, News posts, and Vacation posts.
-- ================================================================
CREATE TABLE IF NOT EXISTS public.likes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('event', 'news', 'vacation_post')),
  content_id   UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, content_type, content_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Anyone (including guests) can view reaction counts
DROP POLICY IF EXISTS "Anyone can view likes" ON public.likes;
CREATE POLICY "Anyone can view likes"
  ON public.likes FOR SELECT USING (true);

-- Authenticated users can insert their own reactions
DROP POLICY IF EXISTS "Users can insert own likes" ON public.likes;
CREATE POLICY "Users can insert own likes"
  ON public.likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reactions (like → dislike and vice versa)
DROP POLICY IF EXISTS "Users can update own likes" ON public.likes;
CREATE POLICY "Users can update own likes"
  ON public.likes FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only remove their own reactions
DROP POLICY IF EXISTS "Users can delete own likes" ON public.likes;
CREATE POLICY "Users can delete own likes"
  ON public.likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

