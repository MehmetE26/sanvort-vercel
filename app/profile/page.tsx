"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import ProfileSettings from "@/components/ProfileSettings";

// Yıldız Arka Plan Bileşeni
function InternalStarBackground() {
  const [stars, setStars] = useState<{ left: number; top: number; delay: number }[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 120 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setStars(generatedStars);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" suppressHydrationWarning>
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-white animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = {
    followers: 128,
    following: 54,
    posts: 12,
    level: 17,
    xp: 2480,
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username || "Uzay Yolcusu");
        setAvatarUrl(data.avatar_url || "");
      } else {
        setUsername("Uzay Yolcusu");
      }
    } catch (err) {
      console.error("Profil çekme hatası:", err);
      setUsername("Uzay Yolcusu");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0 || !userId) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);

      await supabase.from("profiles").upsert({
        id: userId,
        username,
        avatar_url: data.publicUrl,
      });

    } catch (err: any) {
      alert("Yükleme hatası: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#030014] via-[#09051d] to-[#02000a] text-white pb-24 w-full flex flex-col items-center relative overflow-x-hidden">

      {/* Üst Lacivert / Mor Parıltılı Yıldız Alanı */}
      <div className="relative w-full h-32 overflow-hidden border-b border-violet-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#4c1d95aa_0%,#1e1b4b66_50%,transparent_100%)]" />
        <InternalStarBackground />
      </div>

      {/* Ana Profil ve İçerik Alanı */}
      <div className="w-full px-4 sm:px-8 lg:px-12 -mt-14 relative z-10">

        {/* Profil Kartı */}
        <div className="w-full rounded-3xl border border-violet-500/40 bg-[#0d0722]/85 backdrop-blur-md p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

            {/* Profil Fotoğrafı */}
            <div className="flex justify-center lg:block flex-shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer h-32 w-32 sm:h-36 sm:w-36 rounded-full overflow-hidden border-4 border-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-5xl font-black"
              >
                {loading ? (
                  <div className="h-full w-full bg-zinc-800 animate-pulse" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Profil Resmi" className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-60" />
                ) : (
                  username ? username.charAt(0).toUpperCase() : "U"
                )}

                {/* Hover Kamera Efekti */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                  <div className="p-3 rounded-full bg-violet-600/90 text-white shadow-[0_0_20px_rgba(139,92,246,0.9)] animate-pulse">
                    {uploading ? (
                      <span className="text-xs font-bold animate-spin">⏳</span>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleQuickAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
            </div>

            {/* İsim & Ayarlar Çarkı */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    {loading ? (
                      <div className="h-10 w-48 bg-zinc-800 rounded-xl animate-pulse" />
                    ) : (
                      <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-white drop-shadow-[0_2px_10px_rgba(139,92,246,0.3)]">
                        {username}
                      </h1>
                    )}

                    <button
                      onClick={() => setIsEditOpen(true)}
                      title="Profil Ayarları"
                      className="p-2 rounded-xl bg-violet-950/80 hover:bg-violet-600/60 text-violet-200 hover:text-white border border-violet-500/40 transition-all cursor-pointer hover:rotate-45 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>

                  <p className="mt-1 text-sm text-violet-300/70">
                    @{username ? username.toLowerCase().replace(/\s+/g, "") : "kullanici"}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-zinc-300 text-sm font-medium">
                Oyun Biter. Hikâye Devam Eder. 🚀
              </p>

              {/* İstatistikler */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                <div className="rounded-2xl bg-violet-950/30 p-3.5 text-center border border-violet-500/20">
                  <h2 className="text-2xl font-black">{stats.posts}</h2>
                  <p className="text-xs text-zinc-400">Gönderi</p>
                </div>
                <div className="rounded-2xl bg-violet-950/30 p-3.5 text-center border border-violet-500/20">
                  <h2 className="text-2xl font-black">{stats.followers}</h2>
                  <p className="text-xs text-zinc-400">Takipçi</p>
                </div>
                <div className="rounded-2xl bg-violet-950/30 p-3.5 text-center border border-violet-500/20">
                  <h2 className="text-2xl font-black">{stats.following}</h2>
                  <p className="text-xs text-zinc-400">Takip</p>
                </div>
                <div className="rounded-2xl bg-violet-950/30 p-3.5 text-center border border-violet-500/20">
                  <h2 className="text-2xl font-black text-violet-400">Lv.{stats.level}</h2>
                  <p className="text-xs text-zinc-400">Seviye</p>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mt-5">
                <div className="mb-1.5 flex justify-between text-xs text-zinc-400">
                  <span>Deneyim (XP)</span>
                  <span>{stats.xp}/3000 XP</span>
                </div>
                <div className="h-2.5 rounded-full bg-violet-950/50 overflow-hidden border border-violet-500/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                    style={{ width: `${(stats.xp / 3000) * 100}%` }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setActiveTab("posts")}
            className={`rounded-xl px-6 py-3.5 font-bold transition cursor-pointer text-base ${
              activeTab === "posts" ? "bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.4)] text-white" : "bg-[#0d0722]/80 text-zinc-400 hover:bg-violet-950/50 border border-violet-500/20"
            }`}
          >
            Gönderiler
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`rounded-xl px-6 py-3.5 font-bold transition cursor-pointer text-base ${
              activeTab === "games" ? "bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.4)] text-white" : "bg-[#0d0722]/80 text-zinc-400 hover:bg-violet-950/50 border border-violet-500/20"
            }`}
          >
            Oyunlar
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`rounded-xl px-6 py-3.5 font-bold transition cursor-pointer text-base ${
              activeTab === "about" ? "bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.4)] text-white" : "bg-[#0d0722]/80 text-zinc-400 hover:bg-violet-950/50 border border-violet-500/20"
            }`}
          >
            Hakkında
          </button>
        </div>

        {/* İçerik Alanı (Büyütülmüş ve Dolgun Gönderi Kartları) */}
        <div className="mt-6 rounded-3xl border border-violet-500/30 bg-[#0d0722]/85 backdrop-blur-md p-8 sm:p-10 min-h-[500px]">
          {activeTab === "posts" && (
            <div className="grid gap-8">
              {/* Büyütülmüş Paylaşım Kutusu */}
              <div className="rounded-3xl border border-violet-500/30 bg-violet-950/30 p-6 sm:p-8">
                <textarea
                  placeholder="SanVort uzayında neler oluyor? Düşüncelerini paylaş..."
                  rows={4}
                  className="w-full rounded-2xl bg-[#060312] px-5 py-4 text-white text-base border border-violet-500/20 focus:border-violet-500 outline-none resize-none transition"
                />
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-6 text-sm text-zinc-300 font-medium">
                    <button className="hover:text-violet-400 cursor-pointer flex items-center gap-2 py-1">📷 Fotoğraf</button>
                    <button className="hover:text-violet-400 cursor-pointer flex items-center gap-2 py-1">📹 Video</button>
                  </div>
                  <button className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-7 py-3 rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                    Paylaş
                  </button>
                </div>
              </div>

              {/* Büyütülmüş & Ferahlatılmış Akış Kartları (Sadece Mevcut 2 Gönderi) */}
              {[1, 2].map((post) => (
                <div key={post} className="rounded-3xl border border-violet-500/20 bg-violet-950/20 p-8 sm:p-10 transition hover:border-violet-500/50 shadow-lg">
                  <div className="mb-6 flex items-center gap-5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 font-bold overflow-hidden border-2 border-violet-400/40 text-xl shadow-md">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        username ? username.charAt(0).toUpperCase() : "U"
                      )}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-white">{username || "Kullanıcı"}</h2>
                      <p className="text-sm text-zinc-400">2 saat önce</p>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg leading-8 text-zinc-200">
                    SANVORT için ilk gönderim 🚀 Yakında çok daha güzel özellikler gelecek.
                  </p>
                  <div className="mt-8 flex gap-8 text-sm font-semibold text-zinc-300">
                    <button className="transition hover:text-violet-400 cursor-pointer flex items-center gap-2">❤️ 124</button>
                    <button className="transition hover:text-violet-400 cursor-pointer flex items-center gap-2">💬 18</button>
                    <button className="transition hover:text-violet-400 cursor-pointer flex items-center gap-2">🔁 Paylaş</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "games" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {["GTA V", "Minecraft", "Forza Horizon 5", "EA Sports FC", "CS2", "Valorant"].map((game) => (
                <div key={game} className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-8 text-center transition hover:border-violet-500 hover:-translate-y-1">
                  <h2 className="text-xl font-bold text-white">{game}</h2>
                  <p className="mt-2 text-sm text-zinc-400">Favori Oyun</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-violet-950/20 p-8 border border-violet-500/20">
                <h2 className="mb-3 text-xl font-bold text-white">Hakkında</h2>
                <p className="text-base text-zinc-300 leading-8">
                  SANVORT'u kullanan bir uzay yolcusu. Oyunlar, teknoloji ve yazılım ile ilgileniyor.
                </p>
              </div>
              <div className="rounded-2xl bg-violet-950/20 p-8 border border-violet-500/20">
                <h2 className="mb-3 text-xl font-bold text-white">Rozetler</h2>
                <div className="flex gap-5 text-4xl">🏆 🎮 ⭐ 🚀 💎</div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* PROFİL AYARLARI MODALI */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-violet-500/40 bg-[#0d0722] p-6 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition hover:bg-zinc-700 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <ProfileSettings />
          </div>
        </div>
      )}

    </main>
  );
}