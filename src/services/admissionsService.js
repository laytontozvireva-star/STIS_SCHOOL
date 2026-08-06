import { supabase } from "../lib/supabase";

/**
 * Submit a new admission application.
 */
export const submitAdmission = async ({ fullName, email, phone, gradeApplying, notes }) => {
  const { data, error } = await supabase
    .from("admissions")
    .insert({
      full_name: fullName,
      email,
      phone,
      grade_applying: gradeApplying,
      notes,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Fetch all admissions (admin only).
 */
export const getAllAdmissions = async () => {
  const { data, error } = await supabase
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

/**
 * Update the status of an admission (approve/reject).
 */
export const updateAdmissionStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("admissions")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

/**
 * Delete an admission record.
 */
export const deleteAdmission = async (id) => {
  const { error } = await supabase.from("admissions").delete().eq("id", id);
  if (error) throw error;
};
