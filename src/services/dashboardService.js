import { supabase } from "../lib/supabase";

const result = ({ data, error }) => { if (error) throw error; return data; };

export const getMyStudent = async (profileId) => result(await supabase.from("students").select("id, grade, class, profiles(name)").eq("profile_id", profileId).maybeSingle());
export const getStudentGrades = async (studentId) => result(await supabase.from("grades").select("*").eq("student_id", studentId).order("created_at", { ascending: false }));
export const getStudentAttendance = async (studentId) => result(await supabase.from("attendance").select("*").eq("student_id", studentId).order("date", { ascending: false }));
export const getClassSchedule = async (grade, className) => result(await supabase.from("class_schedule").select("*").eq("grade", grade).eq("class", className).order("day").order("start_time"));
export const getMyTeacher = async (profileId) => result(await supabase.from("teachers").select("id, subject, department, profiles(name)").eq("profile_id", profileId).maybeSingle());
export const getTeacherClasses = async (teacherId) => result(await supabase.from("teacher_classes").select("*").eq("teacher_id", teacherId).order("grade").order("class"));
export const getStudents = async () => result(await supabase.from("students").select("id, grade, class, profiles(name, email)").order("grade").order("class"));
export const getParentChildren = async () => result(await supabase.from("parent_students").select("students(id, grade, class, profiles(name))"));
export const getAdmissions = async () => result(await supabase.from("admissions").select("*").order("created_at", { ascending: false }));
export const setAdmissionStatus = async (id, status) => result(await supabase.from("admissions").update({ status }).eq("id", id).select().single());
export const getTeachers = async () => result(await supabase.from("teachers").select("id, subject, department, profiles(name, email)").order("created_at", { ascending: false }));
export const getAllTeacherClasses = async () => result(await supabase.from("teacher_classes").select("*, teachers(id, profiles(name))").order("grade").order("class"));
export const assignTeacherClass = async ({ teacherId, subject, grade, className, room }) => result(await supabase.from("teacher_classes").insert({ teacher_id: teacherId, subject, grade, class: className, room: room || null }).select().single());
export const removeTeacherClass = async (id) => result(await supabase.from("teacher_classes").delete().eq("id", id));
export const updateStudent = async (studentId, updates) => result(await supabase.from("students").update(updates).eq("id", studentId).select().single());