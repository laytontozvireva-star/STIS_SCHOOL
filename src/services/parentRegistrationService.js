import { supabase } from "../lib/supabase";

export const registerParent = async ({ name, email, password, studentNumber, accessCode }) => {
  const { data, error } = await supabase.functions.invoke("parent-self-register", {
    body: { name, email, password, studentNumber, accessCode },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};