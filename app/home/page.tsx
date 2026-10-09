"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Profile {
  username: string;
  avatar_url: string;
}

interface CommentItem {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: Profile | null;
}

export default function CommentsSection() {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. Mevcut oturum açmış kullanıcıyı al
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();
    fetchComments();
  }, []);

  // 2. Yorumları ve her yorumun yazar profilini veritabanından çek
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles!comments_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Yorum çekme hatası:", error.message);
      } else {
        // Supabase bazen dizi döndürebildiği için uygun formata getiriyoruz
        const formattedData = (data || []).map((item: any) => ({
          ...item,
          profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
        }));
        setComments(formattedData);
      }
    } catch (err) {
      console.error("Beklenmeyen hata:", err);
    }
  };

  // 3. Yeni yorum gönderme mantığı
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      alert("Yorum yapabilmek için giriş yapmalısın!");
      return;
    }

    setLoading(true);

    try {
      // Önce kullanıcının profil tablosunda var olduğundan emin olalım
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
        });
      }

      // Yorum kaydını ekle
      const { error } = await supabase.from("comments").insert({
        content: newComment,
        user_id: user.id,
      });

      if (error) {
        console.error("Yorum gönderme hatası:", error.message);
        alert("Yorum gönderilemedi: " + error.message);
      } else {
        setNewComment("");
        // Yorumları tekrar yükle
        fetchComments();
      }
    } catch (err: any) {
      console.error("İşlem hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-zinc-900/80 border border-violet-500/20 p-6 rounded-2xl text-white backdrop-blur-xl">
      <h3 className="text-xl font-bold text-violet-400 mb-6 text-center">
        Topluluk Yorumları
      </h3>

      {/* Yorum Listesi */}
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-center text-zinc-500 text-sm py-4">
            Henüz yorum yapılmamış. İlk yorumu sen yaz!
          </p>
        ) : (
          comments.map((comment) => {
            const avatar =
              comment.profiles?.avatar_url ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${comment.user_id}`;
            const username = comment.profiles?.username || "Anonim Kullanıcı";

            return (
              <div
                key={comment.id}
                className="flex items-start gap-3 bg-zinc-800/40 p-3.5 rounded-xl border border-white/5"
              >
                <img
                  src={avatar}
                  alt={username}
                  className="w-10 h-10 rounded-full object-cover border border-violet-500/50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-violet-300 truncate">
                      {username}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(comment.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Yorum Gönderme Formu */}
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            user ? "Yorumunu yaz..." : "Yorum yapmak için giriş yapmalısın"
          }
          disabled={!user || loading}
          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!user || loading || !newComment.trim()}
          className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
        >
          {loading ? "..." : "Paylaş"}
        </button>
      </form>
    </div>
  );
}