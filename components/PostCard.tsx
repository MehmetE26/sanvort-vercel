"use client";

import { useState, useEffect, useRef } from "react";

export interface Post {
  id: number;
  author: string;
  text: string;
  likes: number;
  liked: boolean;
  comments: string[];
}

interface PostCardProps {
  post: Post;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export default function PostCard({ post, posts, setPosts }: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [editingCommentIndex, setEditingCommentIndex] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  
  // Yorum panelinin açık/kapalı olma durumu
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // Kartın referansı (dışarı tıklamayı algılamak için)
  const cardRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklandığında paneli kapatan mantık
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsCommentsOpen(false);
      }
    };

    if (isCommentsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCommentsOpen]);

  const handleLike = () => {
    setPosts(
      posts.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    setPosts(
      posts.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            comments: [...p.comments, commentText],
          };
        }
        return p;
      })
    );

    setCommentText("");
  };

  const handleDeleteComment = (indexToDelete: number) => {
    setPosts(
      posts.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            comments: p.comments.filter((_, index) => index !== indexToDelete),
          };
        }
        return p;
      })
    );
  };

  const handleStartEdit = (index: number, currentText: string) => {
    setEditingCommentIndex(index);
    setEditCommentText(currentText);
  };

  const handleSaveEdit = (indexToEdit: number) => {
    if (!editCommentText.trim()) return;

    setPosts(
      posts.map((p) => {
        if (p.id === post.id) {
          const updatedComments = [...p.comments];
          updatedComments[indexToEdit] = editCommentText;
          return {
            ...p,
            comments: updatedComments,
          };
        }
        return p;
      })
    );

    setEditingCommentIndex(null);
    setEditCommentText("");
  };

  return (
    <div ref={cardRef} className="flex flex-col gap-6 w-full h-full max-w-full overflow-hidden">
      {/* Pürüzlü Alev Kesim SVG Maskesi */}
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="flame-pill-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.25,0 C 0.32,0.08 0.42,-0.06 0.5,0.05 C 0.58,-0.04 0.68,0.07 0.75,0 C 0.9,0 1,0.2 1,0.5 C 1,0.8 0.9,1 0.75,1 C 0.68,0.92 0.58,1.06 0.5,0.95 C 0.42,1.04 0.32,0.93 0.25,1 C 0.1,1 0,0.8 0,0.5 C 0,0.2 0.1,0 0.25,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Yazar Bilgisi */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-black text-2xl text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] flex-shrink-0">
          {post.author.charAt(0).toUpperCase()}
        </div>
        <span className="text-2xl font-bold text-white tracking-wide truncate">
          {post.author}
        </span>
      </div>

      {/* Gönderi Metni */}
      <p className="text-xl text-zinc-200 leading-relaxed font-normal py-2 flex-1 break-words">
        {post.text}
      </p>

      {/* Beğeni ve Yorum Sayısı / Butonu */}
      <div className="flex items-center gap-6 pt-2 border-t border-violet-500/10">
        <button
          onClick={handleLike}
          className={`group flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            post.liked
              ? "bg-red-500/20 text-red-500 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              : "bg-zinc-900/50 text-red-500/80 hover:text-red-500 hover:bg-red-500/10 border border-zinc-800 shadow-md"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-7 h-7 transition-transform duration-300 group-hover:scale-125 ${
              post.liked ? "scale-110 text-red-500" : "text-red-500/80"
            }`}
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <span className="font-bold text-xl">{post.likes}</span>
        </button>

        {/* Yorum Butonu */}
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`flex items-center gap-3 text-xl font-medium px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            isCommentsOpen
              ? "bg-violet-600/30 text-violet-300 border border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              : "text-zinc-400 hover:text-violet-400 hover:bg-violet-950/40 border border-transparent"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-violet-400"
          >
            <path
              fillRule="evenodd"
              d="M4.804 2.169A2.25 2.25 0 002.25 4.5v11.25c0 1.242 1.008 2.25 2.25 2.25h13.5l3.75 3.75V4.5a2.25 2.25 0 00-2.25-2.25H4.804z"
              clipRule="evenodd"
            />
          </svg>
          <span>{post.comments.length}</span>
        </button>
      </div>

      {/* SÜZÜLEREK AÇILAN YORUM PANELİ */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isCommentsOpen 
            ? "grid-rows-[1fr] opacity-100 pt-4 border-t border-violet-500/20" 
            : "grid-rows-[0fr] opacity-0 pt-0 border-t border-transparent"
        }`}
      >
        <div className="overflow-hidden flex flex-col gap-4">
          
          {/* Yorum Ekleme Girişi (İçine Gömülü Gönder Butonu ile) */}
          <div className="relative flex items-center w-full min-w-0">
            <input
              type="text"
              placeholder="Yorum yaz..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              className="w-full rounded-2xl border border-violet-500/30 bg-zinc-950/70 pl-5 pr-28 py-3.5 text-lg text-white placeholder-zinc-500 outline-none focus:border-violet-500 transition-all shadow-inner"
            />
            {/* İNPUT'UN İÇİNE GÖMÜLÜ GÖNDER BUTONU */}
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="absolute right-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-950/50 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
            >
              Gönder
            </button>
          </div>

          {/* Mevcut Yorumlar Listesi */}
          {post.comments.length > 0 && (
            <div className="flex flex-col gap-3 pt-2">
              {post.comments.map((comment, i) => (
                <div
                  key={i}
                  className="bg-zinc-950/60 border border-violet-500/10 rounded-2xl px-6 py-4 text-lg text-zinc-300 flex items-center justify-between gap-4 backdrop-blur-md shadow-md min-w-0"
                >
                  {editingCommentIndex === i ? (
                    <div className="flex-1 flex gap-3 min-w-0">
                      <input
                        type="text"
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(i);
                        }}
                        className="flex-1 min-w-0 rounded-xl border border-violet-500/40 bg-zinc-900 px-4 py-2 text-white outline-none focus:border-violet-400 transition-all"
                      />
                      <button
                        onClick={() => handleSaveEdit(i)}
                        className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all flex-shrink-0 cursor-pointer"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={() => setEditingCommentIndex(null)}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-sm transition-all flex-shrink-0 cursor-pointer"
                      >
                        Vazgeç
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 break-words min-w-0">{comment}</span>
                      
                      {/* PÜRÜZLÜ ÜST/ALT KENARLI ALEV BUTONLARI */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* DÜZENLE BUTONU */}
                        <button
                          onClick={() => handleStartEdit(i, comment)}
                          title="Düzenle"
                          style={{ clipPath: "url(#flame-pill-clip)" }}
                          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.6)] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Düzenle</span>
                        </button>

                        {/* SİL BUTONU */}
                        <button
                          onClick={() => handleDeleteComment(i)}
                          title="Sil"
                          style={{ clipPath: "url(#flame-pill-clip)" }}
                          className="px-6 py-2.5 bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-extrabold text-base tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Sil</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}