"use client";

import { useState, useEffect, useRef } from "react";

export interface Post {
  id: number;
  author: string;
  text: string;
  media_url?: string | null;      
  media_type?: "image" | "video" | null; 
  likes: number;
  liked: boolean;
  comments: any[];
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
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Yorumları tamamen gizlemek için bayrak (false = gizli)
  const SHOW_COMMENTS = false;

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

      {/* Gönderi Medyası (Görsel / Video) */}
      {post.media_url && (
        <div className="w-full rounded-2xl overflow-hidden border border-violet-500/20 bg-zinc-950">
          {post.media_type === "video" ? (
            <video src={post.media_url} controls className="w-full max-h-[500px] object-cover" />
          ) : (
            <img src={post.media_url} alt="Post media" className="w-full max-h-[500px] object-cover" />
          )}
        </div>
      )}

      {/* Beğeni Butonu */}
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
      </div>

      {/* YORUMLAR GİZLENDİ (SHOW_COMMENTS true olduğunda görünür hale gelecektir) */}
      {SHOW_COMMENTS && (
        <div 
          className={`grid transition-all duration-300 ease-in-out ${
            isCommentsOpen 
              ? "grid-rows-[1fr] opacity-100 pt-4 border-t border-violet-500/20" 
              : "grid-rows-[0fr] opacity-0 pt-0 border-t border-transparent"
          }`}
        >
          <div className="overflow-hidden flex flex-col gap-4">
            {/* Yorum Ekleme Alanı ve Listesi */}
          </div>
        </div>
      )}
    </div>
  );
}