// components/magazine/CommentSection.tsx
"use client";

import { useState, useEffect } from "react";
import {
  fetchCommentsForBlogPost,
  createCommentForBlogPost,
  type Comment,
} from "../../services/comment/commentService";



export default function CommentSection({
  articleId,
  locale,
}) {
  /* ------------------------------------------------------------------ */
  /* Local state                                                        */
  /* ------------------------------------------------------------------ */
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  /* ------------------------------------------------------------------ */
  /* Fetch comments on mount                                            */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let mounted = true;

    async function loadComments() {
      try {
        const data = await fetchCommentsForBlogPost(articleId);
        if (mounted) setComments(data);
      } catch (err) {
        if (mounted) setError("خطا در دریافت کامنت‌ها. لطفاً دوباره تلاش کنید.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadComments();
    return () => {
      mounted = false;
    };
  }, [articleId]);

  /* ------------------------------------------------------------------ */
  /* Submit new comment                                                 */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newComment.trim();
    if (!text) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createCommentForBlogPost(articleId, {
        name: "Anonymous User", // در صورت وجود احراز هویت، نام کاربر واقعی را بفرستید
        text,
      });

      // Optimistic update: قرار دادن کامنت جدید در ابتدای لیست
      setComments((prev) => [created, ...prev]);
      setNewComment("");
    } catch {
      setError("ارسال کامنت با خطا مواجه شد. لطفاً بعداً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRTL = locale === "fa";

  return (
    <div className="mt-12 pt-8 border-t border-gray-200" dir={isRTL ? "rtl" : "ltr"}>
      <h3 className="text-2xl font-bold mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isRTL ? "نظر خود را بنویسید…" : "Share your thoughts…"}
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (isRTL ? "در حال ارسال…" : "Posting…") : (isRTL ? "ارسال نظر" : "Post Comment")}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <p className="mb-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Loading state */}
      {isLoading ? (
        <p className="text-gray-500">{isRTL ? "در حال بارگذاری…" : "Loading…"}</p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {/* {comment.name} */}
                    </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString(
                      locale === "fa" ? "fa-IR" : "en-US"
                    )}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-line">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
