import { supabase } from "../lib/supabase";

export const getActiveVacationPost = async () => {
  const { data, error } = await supabase
    .from("vacation_posts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getVacationPosts = async () => {
  const { data, error } = await supabase
    .from("vacation_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const saveVacationPost = async (post) => {
  if (post.is_active) {
    const { error: deactivateError } = await supabase
      .from("vacation_posts")
      .update({ is_active: false })
      .eq("is_active", true)
      .neq("id", post.id || "00000000-0000-0000-0000-000000000000");
    if (deactivateError) throw deactivateError;
  }

  const payload = {
    title: post.title,
    term: post.term,
    dates: post.dates,
    subjects: post.subjects,
    fees: post.fees,
    accommodation: post.accommodation,
    image_url: post.image_url || null,
    is_active: post.is_active,
  };

  const request = post.id
    ? supabase.from("vacation_posts").update(payload).eq("id", post.id)
    : supabase.from("vacation_posts").insert(payload);
  const { data, error } = await request.select().single();
  if (error) throw error;
  return data;
};

export const deleteVacationPost = async (id) => {
  const { error } = await supabase.from("vacation_posts").delete().eq("id", id);
  if (error) throw error;
};


const FLYER_BUCKET = "vacation-flyers";

export const uploadVacationFlyer = async (file) => {
  const extension = file.name.split(".").pop() || "png";
  const filename = `${Date.now()}-vacation-flyer.${extension.toLowerCase()}`;
  const { error } = await supabase.storage.from(FLYER_BUCKET).upload(filename, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(FLYER_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
};
