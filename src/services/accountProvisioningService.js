import { supabase } from "../lib/supabase";

export const createPrivilegedAccount = async (account) => {
  const { data, error } = await supabase.functions.invoke("admin-create-account", { body: account });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};
