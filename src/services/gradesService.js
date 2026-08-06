import { supabase } from "../lib/supabase";

/**
 * Fetch grades for a given student ID.
 */
export const getGradesByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from("grades")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Fetch all grades for a class (for teachers).
 */
export const getGradesByClass = async (className) => {
  const { data, error } = await supabase
    .from("grades")
    .select("*, students(id, profiles(name))")
    .eq("students.class", className)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Add a grade record.
 */
export const addGrade = async ({ studentId, subject, score, term }) => {
  const { data, error } = await supabase
    .from("grades")
    .insert({ student_id: studentId, subject, score, term })
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Update an existing grade.
 */
export const updateGrade = async (gradeId, updates) => {
  const { data, error } = await supabase
    .from("grades")
    .update(updates)
    .eq("id", gradeId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Delete a grade record.
 */
export const deleteGrade = async (gradeId) => {
  const { error } = await supabase.from("grades").delete().eq("id", gradeId);
  if (error) throw error;
};
