import { supabase } from "../lib/supabase";

/**
 * Fetch a user's profile by their auth user ID.
 */
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Update a user's profile fields.
 */
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
export const getAvatarUrl = async (path) => {
  if (!path) return null;
  const { data, error } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
};

export const uploadAvatar = async (userId, file) => {
  const path = `${userId}/avatar`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: true });
  if (uploadError) throw uploadError;

  await updateProfile(userId, { avatar_path: path });
  return getAvatarUrl(path);
};