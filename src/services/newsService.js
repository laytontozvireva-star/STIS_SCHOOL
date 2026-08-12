import { supabase } from "../lib/supabase";

export const getNewsPosts = async () => {
  const { data, error } = await supabase.from("news_posts").select("*").order("published_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const saveNewsPost = async (post) => {
  const { error } = await supabase.from("news_posts").insert(post);
  if (error) throw error;
};

export const deleteNewsPost = async (id) => {
  const { error } = await supabase.from("news_posts").delete().eq("id", id);
  if (error) throw error;
};
