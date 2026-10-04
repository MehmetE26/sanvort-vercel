"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Star = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generated = Array.from({ length: 180 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3,
    }));
    setStars(generated);
  }, []);

  async function handleResetRequest(e: FormEvent) {
    e.preventDefault();

    if (!email) {
      alert("Lütfen e-posta adresinizi girin.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Supabase e-posta yönlendirme bağlantısı
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage(
        "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin."
      );
    } catch (err: any) {
      alert(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleResetRequest(e);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white px-6 py-16 selection:bg-purple-600 selection:text-white">
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

      {/* Serbest Alan / Form İçeriği */}
      <div className="relative z-20 w-full max-w-xl flex flex-col items-center">
        
        {/* Başlık ve Slogan */}
        <div className="text-center mb-12">
          <Link href="/">
            <h1 className="select-none text-6xl font-black tracking-[12px] text-white drop-shadow-[0_0_35px_rgba(139,92,246,0.4)] md:text-8xl">
              SANVORT
            </h1>
          </Link>
          <div className="mx-auto mt-4 h-1.5 w-48 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 shadow-[0_0_30px_#8b5cf6]" />
          <p className="mt-6 text-xl italic text-zinc-300 md:text-2xl">
            Şifreni mi unuttun? Sorun değil.
          </p>
        </div>

        {/* Bilgilendirme Mesajı */}
        {message ? (
          <div className="w-full rounded-2xl border border-violet-500/30 bg-violet-900/20 p-6 text-center text-zinc-200 backdrop-blur-md">
            <p className="text-lg leading-relaxed">{message}</p>
            <Link
              href="/login"
              className="mt-6 inline-block font-bold text-violet-400 hover:text-violet-300 hover:underline transition-colors"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleResetRequest} className="w-full">
            <div style={{ marginBottom: "36px" }}>
              <input
                type="email"
                placeholder="E-Posta Adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-7 py-5 text-lg text-white placeholder-zinc-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-violet-500 focus:bg-white/15 focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-5 text-xl font-bold tracking-wide text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Bağlantı Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        )}

        {/* Alt Yönlendirme */}
        {!message && (
          <p className="mt-10 text-center text-lg text-zinc-300">
            Hatırladın mı?{" "}
            <Link
              href="/login"
              className="font-bold text-violet-400 hover:text-violet-300 hover:underline transition-colors ml-1"
            >
              Giriş Yap
            </Link>
          </p>
        )}

      </div>

      {/* Vinyet Efekti */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,.65) 100%)",
        }}
      />
    </main>
  );
}