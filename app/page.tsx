"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Star = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

export default function LandingPage() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generated = Array.from({ length: 220 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3,
    }));

    setStars(generated);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent selection:bg-purple-600 selection:text-white">
      {/* Arka Plan Yapısı */}
      <div className="space"></div>
      <div className="nebula"></div>
      <div className="glow-center"></div>

      {/* Yıldızlar */}
      <div className="stars">
        {mounted &&
          stars.map((star, index) => (
            <span
              key={index}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
      </div>

      {/* Ana İçerik */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs font-bold tracking-[14px] text-violet-400 md:text-sm">
          WELCOME TO
        </p>

        <h1 className="select-none text-7xl font-black tracking-[12px] text-white md:text-[9rem] drop-shadow-[0_0_35px_rgba(139,92,246,0.3)]">
          SANVORT
        </h1>

        <div className="mt-4 h-1.5 w-48 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 shadow-[0_0_30px_#8b5cf6] md:w-64" />

        <p className="mt-8 max-w-2xl text-lg italic text-zinc-300 md:text-2xl">
          Yıldızlar Söner, SANVORT Kalır.
        </p>

        {/* Buton Alanı */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-8 w-full max-w-xl">
          <Link
            href="/login"
            className="w-full sm:w-auto btn-primary rounded-xl px-14 py-5 text-xl font-bold tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(139,92,246,0.6)] text-center"
          >
            Giriş Yap
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto btn-outline rounded-xl px-14 py-5 text-xl font-bold tracking-wide text-white transition-all duration-300 hover:scale-105 hover:bg-violet-600/20 text-center"
          >
            Kaydol
          </Link>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-20 text-center">
          <p className="text-[10px] uppercase tracking-[7px] text-zinc-500 md:text-xs">
            Powered By
          </p>

          <p className="mt-2 text-2xl font-black tracking-[6px] text-violet-400 md:text-3xl">
            SANVORT
          </p>

          <p className="mt-3 text-sm text-zinc-500 tracking-wider">
            Connect • Play • Share
          </p>

          <p className="mt-28 text-xs text-zinc-700 font-mono tracking-widest">
            Beta v0.1
          </p>
        </div>
      </div>

      {/* Geçiş Sis Efektleri */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-violet-500/10 via-violet-500/5 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-indigo-500/10 via-violet-500/5 to-transparent" />

      {/* Vinyet Efekti */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(3, 7, 18, 0.65) 100%)",
        }}
      />
    </main>
  );
}