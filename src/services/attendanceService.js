import { supabase } from "../lib/supabase";

/**
 * Fetch attendance records for a student.
 */
export const getAttendanceByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Fetch attendance for all students on a given date (for teachers).
 */
export const getAttendanceByDate = async (date) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, students(id, profiles(name))")
    .eq("date", date);
  if (error) throw error;
  return data;
};

/**
 * Mark attendance for a student.
 */
export const markAttendance = async ({ studentId, date, status }) => {
  const { data, error } = await supabase
    .from("attendance")
    .upsert(
      { student_id: studentId, date, status },
      { onConflict: "student_id,date" }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
};
