import { supabase } from "../lib/supabase";

export const createPrivilegedAccount = async (account) => {
  const { data, error } = await supabase.functions.invoke("admin-create-account", { body: account });

  if (error) {
    const details = await error.context?.json().catch(() => null);
    throw new Error(details?.error || error.message || "Could not create this account.");
  }
  if (data?.error) throw new Error(data.error);
  return data;
};