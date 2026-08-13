import { supabase } from "../lib/supabase";

export const submitContactMessage = async ({ name, email, message }) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({ name, email, message })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getContactMessages = async () => {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateContactMessageStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};