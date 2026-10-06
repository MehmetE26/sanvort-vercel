"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface CommentWithProfile {
  id: number;
  content: string;
  rating: number;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
    badge: string;
  } | null;
}

export default function CommentsSection() {
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          rating,
          created_at,
          profiles!comments_user_id_fkey (
            username,
            avatar_url,
            badge
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase Hatası:", error.message);
        return;
      }

      if (data) {
        setComments(data as unknown as CommentWithProfile[]);
      }
    } catch (err) {
      console.error("Yorumlar yüklenirken beklenmeyen hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Yorum yapabilmek için giriş yapmalısınız.");
        return;
      }

      // Kullanıcının profili var mı kontrol et, yoksa otomatik oluştur
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: user.id,
          username: user.email?.split("@")[0] || "Kullanıcı",
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
          badge: "Üye",
        });
      }

      // Yorum ekle
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
        content: newComment,
        rating: rating,
      });

      if (error) throw error;

      setNewComment("");
      setRating(5);
      await fetchComments();
    } catch (err: any) {
      alert(err.message || "Yorum gönderilemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 text-white">
      <h2 className="text-3xl font-black text-center mb-8 text-violet-400 tracking-wider">
        Topluluk Yorumları
      </h2>

      {/* Yorum Formu */}
      <form
        onSubmit={handleAddComment}
        className="mb-10 bg-zinc-900/60 border border-violet-500/30 p-6 rounded-2xl backdrop-blur-xl"
      >
        <textarea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="SanVort hakkında yorum yap..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
        />
        <div className="flex justify-between items-center mt-4">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="bg-black/60 border border-white/10 text-amber-400 rounded-lg px-3 py-2 outline-none"
          >
            <option value={5}>★★★★★ (5/5)</option>
            <option value={4}>★★★★☆ (4/5)</option>
            <option value={3}>★★★☆☆ (3/5)</option>
            <option value={2}>★★☆☆☆ (2/5)</option>
            <option value={1}>★☆☆☆☆ (1/5)</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            {submitting ? "Gönderiliyor..." : "Paylaş"}
          </button>
        </div>
      </form>

      {/* Yorumlar Listesi */}
      {loading ? (
        <p className="text-center text-zinc-400">Yorumlar yükleniyor...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-zinc-500">Henüz hiç yorum yapılmamış.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comments.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/40 border border-violet-500/20 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between"
            >
              <p className="text-zinc-200 text-sm italic mb-4">"{item.content}"</p>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.profiles?.avatar_url ||
                      "https://api.dicebear.com/7.x/bottts/svg?seed=user"
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-violet-400/40"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {item.profiles?.username || "Anonim Kullanıcı"}
                    </span>
                    <span className="text-[10px] text-violet-300 bg-violet-500/20 px-1.5 py-0.5 rounded">
                      {item.profiles?.badge || "Üye"}
                    </span>
                  </div>
                </div>
                <span className="text-amber-400 text-xs">
                  {"★".repeat(item.rating)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}