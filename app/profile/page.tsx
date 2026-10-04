"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");

  const user = {
    name: "Memari",
    username: "@memari",
    bio: "Oyun Biter. Hikâye Devam Eder.",
    followers: 128,
    following: 54,
    posts: 12,
    level: 17,
    xp: 2480,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#020617] via-[#060b1f] to-black text-white">

      {/* Banner */}
      <div className="relative h-72 overflow-hidden border-b border-zinc-800">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#4338ca55,transparent_60%)]" />

        {[...Array(120)].map((_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random(),
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

      </div>

      <section className="mx-auto -mt-20 max-w-6xl px-6">

        {/* Profil Kartı */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl shadow-2xl">

          <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center">

            {/* Profil Fotoğrafı */}
            <div className="flex justify-center lg:block">

              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-violet-500 bg-gradient-to-br from-violet-500 to-indigo-700 text-6xl font-black shadow-2xl">
                M
              </div>

            </div>

            {/* Bilgiler */}
            <div className="flex-1">

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <h1 className="text-5xl font-black">
                    {user.name}
                  </h1>

                  <p className="mt-1 text-zinc-400">
                    {user.username}
                  </p>

                </div>

                <button className="rounded-xl bg-violet-600 px-7 py-3 font-bold transition hover:bg-violet-500">
                  Profili Düzenle
                </button>

              </div>

              <p className="mt-6 max-w-2xl text-zinc-300">
                {user.bio}
              </p>

              {/* İstatistikler */}
              <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">

                <div className="rounded-2xl bg-zinc-800/60 p-5 text-center">
                  <h2 className="text-3xl font-black">
                    {user.posts}
                  </h2>

                  <p className="text-sm text-zinc-400">
                    Gönderi
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-800/60 p-5 text-center">
                  <h2 className="text-3xl font-black">
                    {user.followers}
                  </h2>

                  <p className="text-sm text-zinc-400">
                    Takipçi
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-800/60 p-5 text-center">
                  <h2 className="text-3xl font-black">
                    {user.following}
                  </h2>

                  <p className="text-sm text-zinc-400">
                    Takip
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-800/60 p-5 text-center">
                  <h2 className="text-3xl font-black text-violet-400">
                    Lv.{user.level}
                  </h2>

                  <p className="text-sm text-zinc-400">
                    Seviye
                  </p>
                </div>

              </div>

              {/* XP */}
              <div className="mt-8">

                <div className="mb-2 flex justify-between text-sm text-zinc-400">
                  <span>Deneyim</span>
                  <span>{user.xp}/3000 XP</span>
                </div>

                <div className="h-3 rounded-full bg-zinc-800">

                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                    style={{ width: "82%" }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Sekmeler */}
        <div className="mt-10 flex gap-4">

          <button
            onClick={() => setActiveTab("posts")}
            className={`rounded-xl px-6 py-3 font-bold transition ${
              activeTab === "posts"
                ? "bg-violet-600"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            Gönderiler
          </button>

          <button
            onClick={() => setActiveTab("games")}
            className={`rounded-xl px-6 py-3 font-bold transition ${
              activeTab === "games"
                ? "bg-violet-600"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            Oyunlar
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`rounded-xl px-6 py-3 font-bold transition ${
              activeTab === "about"
                ? "bg-violet-600"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            Hakkında
          </button>

        </div>

        {/* İçerik */}
        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl">
          {activeTab === "posts" && (
            <div className="grid gap-6">

              {[1, 2, 3].map((post) => (
                <div
                  key={post}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-violet-500"
                >
                  <div className="mb-4 flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 font-bold">
                      M
                    </div>

                    <div>
                      <h2 className="font-bold">
                        {user.name}
                      </h2>

                      <p className="text-sm text-zinc-500">
                        2 saat önce
                      </p>
                    </div>

                  </div>

                  <p className="leading-7 text-zinc-300">
                    SANVORT için ilk gönderim 🚀
                    Yakında çok daha güzel özellikler gelecek.
                  </p>

                  <div className="mt-6 flex gap-8 text-zinc-400">

                    <button className="transition hover:text-violet-400">
                      ❤️ 124
                    </button>

                    <button className="transition hover:text-violet-400">
                      💬 18
                    </button>

                    <button className="transition hover:text-violet-400">
                      🔁 Paylaş
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

          {activeTab === "games" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

              {[
                "GTA V",
                "Minecraft",
                "Forza Horizon 5",
                "EA Sports FC",
                "CS2",
                "Valorant",
              ].map((game) => (
                <div
                  key={game}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center transition hover:border-violet-500 hover:-translate-y-1"
                >
                  <h2 className="text-xl font-bold">
                    {game}
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    Favori Oyun
                  </p>

                </div>
              ))}

            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-5">

              <div className="rounded-2xl bg-zinc-900 p-6">

                <h2 className="mb-3 text-xl font-bold">
                  Hakkında
                </h2>

                <p className="text-zinc-400 leading-7">
                  SANVORT'u kullanan bir oyuncu.
                  Oyunlar, teknoloji ve yazılım ile ilgileniyor.
                </p>

              </div>

              <div className="rounded-2xl bg-zinc-900 p-6">

                <h2 className="mb-3 text-xl font-bold">
                  Rozetler
                </h2>

                <div className="flex gap-4 text-4xl">

                  🏆 🎮 ⭐ 🚀 💎

                </div>

              </div>

            </div>
          )}

        </div>

      </section>

    </main>
  );
}