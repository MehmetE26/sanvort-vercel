"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import CreatePost from "../../components/CreatePost";
import PostCard, { Post } from "../../components/PostCard";
import Footer from "../../components/Footer";
import CommentsSection from "../../components/CommentsSection";

// Varsayılan ilk veriler
const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "Mehmet",
    text: "🎉 SanVort'un ilk sürümü sonunda hazır!",
    likes: 12,
    liked: false,
    comments: [],
  },
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sayfa ilk yüklendiğinde tarayıcı hafızasından (localStorage) verileri çek
  useEffect(() => {
    const savedPosts = localStorage.getItem("sanvort_posts");
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (error) {
        console.error("Yükleme hatası:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Postlar veya yorumlar her değiştiğinde tarayıcı hafızasına kaydet
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sanvort_posts", JSON.stringify(posts));
    }
  }, [posts, isLoaded]);

  const handleShare = () => {
    if (!postText.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: "Mehmet",
      text: postText,
      likes: 0,
      liked: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setPostText("");
  };

  return (
    <main className="relative min-h-screen w-full text-white flex flex-col items-center bg-transparent selection:bg-purple-600 selection:text-white">
      {/* Uzay Katmanları */}
      <div className="space" />
      <div className="nebula" />
      <div className="glow-center" />
      <div className="stars" />

      {/* Header & Sidebar */}
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <Sidebar menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* AKIŞ ALANI */}
      <div className="relative z-10 w-full max-w-3xl px-6 pt-[120px] pb-24 flex flex-col gap-14">
        
        {/* Arama Kutusu */}
        <div className="w-full">
          <input
            type="text"
            placeholder="SanVort evreninde ara..."
            className="w-full rounded-2xl border-2 border-violet-500/30 bg-zinc-900/60 backdrop-blur-xl px-8 py-7 text-2xl font-medium outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/30 text-white placeholder-zinc-400 transition-all shadow-[0_0_25px_rgba(139,92,246,0.15)]"
          />
        </div>

        {/* Gönderi Yazma Kutusu */}
        <div className="glass rounded-3xl px-10 py-12 border-2 border-violet-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] min-h-[360px] flex flex-col justify-between">
          <CreatePost
            postText={postText}
            setPostText={setPostText}
            onShare={handleShare}
          />
        </div>

        {/* Akış Kartları */}
        <div className="flex flex-col gap-12">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="glass rounded-3xl px-10 py-12 border-2 border-violet-500/20 hover:border-violet-500/40 transition-all shadow-2xl min-h-[300px] flex flex-col justify-between"
            >
              <PostCard
                post={post}
                posts={posts}
                setPosts={setPosts}
              />
            </div>
          ))}
        </div>

        {/* Veritabanı Yorum Alanı */}
        <div className="w-full mt-8 border-t border-violet-500/20 pt-10">
          <CommentsSection />
        </div>

      </div>

      <Footer />
    </main>
  );
}