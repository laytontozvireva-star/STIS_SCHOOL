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
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
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
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ── Students ────────────────────────────────────────────────────
CREATE POLICY "Students can view own record"
  ON public.students FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Teachers and admins can view all students"
  ON public.students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
    )
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
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can insert grades"
  ON public.grades FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can update grades"
  ON public.grades FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
    )
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
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
    )
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
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
