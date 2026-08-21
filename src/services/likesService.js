import { supabase } from "../lib/supabase";

/**
 * Fetch like and dislike counts + whether the current user has reacted,
 * for a single piece of content.
 *
 * Returns: { likes, dislikes, userReaction: 'like' | 'dislike' | null }
 */
export const getReactions = async (contentType, contentId, userId = null) => {
  const { data, error } = await supabase
    .from("likes")
    .select("user_id, reaction_type")
    .eq("content_type", contentType)
    .eq("content_id", contentId);

  if (error) throw error;

  const likes    = data.filter((r) => r.reaction_type === "like").length;
  const dislikes = data.filter((r) => r.reaction_type === "dislike").length;
  const userReaction = userId
    ? (data.find((r) => r.user_id === userId)?.reaction_type ?? null)
    : null;

  return { likes, dislikes, userReaction };
};

/**
 * Toggle a reaction.
 * - If the user hasn't reacted yet → insert the reaction.
 * - If the user already has the SAME reaction → remove it (un-like / un-dislike).
 * - If the user has the OPPOSITE reaction → switch to the new one.
 *
 * Returns the updated { likes, dislikes, userReaction }.
 */
export const toggleReaction = async (userId, contentType, contentId, reactionType) => {
  // Fetch the user's existing reaction on this item
  const { data: existing, error: fetchError } = await supabase
    .from("likes")
    .select("id, reaction_type")
    .eq("user_id", userId)
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (!existing) {
    // No reaction yet — insert
    const { error } = await supabase
      .from("likes")
      .insert({ user_id: userId, content_type: contentType, content_id: contentId, reaction_type: reactionType });
    if (error) throw error;
  } else if (existing.reaction_type === reactionType) {
    // Same reaction → remove (toggle off)
    const { error } = await supabase.from("likes").delete().eq("id", existing.id);
    if (error) throw error;
  } else {
    // Opposite reaction → switch
    const { error } = await supabase
      .from("likes")
      .update({ reaction_type: reactionType })
      .eq("id", existing.id);
    if (error) throw error;
  }

  return getReactions(contentType, contentId, userId);
};
