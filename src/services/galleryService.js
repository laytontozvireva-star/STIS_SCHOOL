import { supabase } from "../lib/supabase";

const BUCKET = "gallery-images";

const convertToWebp = async (file) => {
  if (file.type === "image/webp") return file;
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas.getContext("2d").drawImage(image, 0, 0);
  image.close();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
  if (!blob) throw new Error("Could not optimize this image.");
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
};

export const getGalleryImages = async () => {
  const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const uploadGalleryImage = async (file) => {
  const optimizedFile = await convertToWebp(file);
  const path = `${Date.now()}-${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, optimizedFile, {
    cacheControl: "3600",
    upsert: false,
    contentType: "image/webp",
  });
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
