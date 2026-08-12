import { supabase } from "../lib/supabase";

/**
 * Fetch all events ordered by date ascending.
 * The caller decides whether to split into upcoming / past based on event_date.
 */
export const getEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const saveEvent = async (event) => {
  const payload = {
    title:       event.title,
    event_date:  event.event_date,   // ISO date string "YYYY-MM-DD"
    time_label:  event.time_label || null,
    location:    event.location,
    description: event.description || null,
    is_featured: event.is_featured ?? false,
  };

  const request = event.id
    ? supabase.from("events").update(payload).eq("id", event.id)
    : supabase.from("events").insert(payload);

  const { data, error } = await request.select().single();
  if (error) throw error;
  return data;
};

export const deleteEvent = async (id) => {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
};
