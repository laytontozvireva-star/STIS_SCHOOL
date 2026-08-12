import { supabase } from "../lib/supabase";

const BUCKET = "gallery-images";

export const getGalleryImages = async () => {
  const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const uploadGalleryImage = async (file) => {
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension.toLowerCase()}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return { path, image_url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl };
};

export const saveGalleryImage = async (image) => {
  const { error } = await supabase.from("gallery_images").insert(image);
  if (error) throw error;
};

export const deleteGalleryImage = async (image) => {
  const { error } = await supabase.from("gallery_images").delete().eq("id", image.id);
  if (error) throw error;
  if (image.storage_path) await supabase.storage.from(BUCKET).remove([image.storage_path]);
};
