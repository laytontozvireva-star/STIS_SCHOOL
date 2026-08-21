import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getReactions, toggleReaction } from "../services/likesService";

/**
 * Reusable Like + Dislike button pair.
 *
 * Props:
 *   contentType — "event" | "news" | "vacation_post"
 *   contentId   — the UUID of the content item
 *
 * Behaviour:
 *   • Loads the current counts and whether the logged-in user has reacted.
 *   • Clicking like/dislike toggles the reaction instantly (optimistic UI).
 *   • Guests are redirected to /login on click.
 */
const LikeButton = ({ contentType, contentId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likes, setLikes]         = useState(0);
  const [dislikes, setDislikes]   = useState(0);
  const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null
  const [busy, setBusy]           = useState(false);

  const load = useCallback(async () => {
    // contentId might be a number (fallback data) — skip for non-UUID items
    if (!contentId || typeof contentId === "number") return;
    try {
      const data = await getReactions(contentType, contentId, user?.id ?? null);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(data.userReaction);
    } catch {
      // Silently fail if likes table doesn't exist yet
    }
  }, [contentType, contentId, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleClick = async (reactionType) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (busy || typeof contentId === "number") return;

    // Optimistic update
    const prevLikes    = likes;
    const prevDislikes = dislikes;
    const prevReaction = userReaction;

    if (userReaction === reactionType) {
      // Toggle off
      setUserReaction(null);
      if (reactionType === "like")    setLikes((n) => Math.max(0, n - 1));
      if (reactionType === "dislike") setDislikes((n) => Math.max(0, n - 1));
    } else {
      // Switch or new
      if (userReaction === "like")    setLikes((n) => Math.max(0, n - 1));
      if (userReaction === "dislike") setDislikes((n) => Math.max(0, n - 1));
      if (reactionType === "like")    setLikes((n) => n + 1);
      if (reactionType === "dislike") setDislikes((n) => n + 1);
      setUserReaction(reactionType);
    }

    setBusy(true);
    try {
      const data = await toggleReaction(user.id, contentType, contentId, reactionType);
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserReaction(data.userReaction);
    } catch {
      // Revert on error
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setUserReaction(prevReaction);
    } finally {
      setBusy(false);
    }
  };

  // Don't render for fallback (non-UUID) items
  if (typeof contentId === "number") return null;

  return (
    <div className="flex items-center gap-3">
      {/* Like */}
      <button
        onClick={() => handleClick("like")}
        disabled={busy}
        title={userReaction === "like" ? "Remove like" : "Like"}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition
          ${userReaction === "like"
            ? "bg-primary text-white"
            : "bg-primary/8 text-primary hover:bg-primary/15"
          } disabled:opacity-60`}
      >
        <ThumbsUp className="h-4 w-4" strokeWidth={2} />
        <span>{likes}</span>
      </button>

      {/* Dislike */}
      <button
        onClick={() => handleClick("dislike")}
        disabled={busy}
        title={userReaction === "dislike" ? "Remove dislike" : "Dislike"}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition
          ${userReaction === "dislike"
            ? "bg-red-500 text-white"
            : "bg-red-50 text-red-500 hover:bg-red-100"
          } disabled:opacity-60`}
      >
        <ThumbsDown className="h-4 w-4" strokeWidth={2} />
        <span>{dislikes}</span>
      </button>
    </div>
  );
};

export default LikeButton;
