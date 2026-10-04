"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Star = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Lütfen tüm alanları doldur.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: authData.user.id,
            username: username,
            about: "Henüz kendim hakkında bir şey yazmadım.",
            avatar_url: "",
            banner_url: "",
            badge: "Founder",
          });

        if (profileError) throw profileError;
      }

      alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  // Enter tuşuna basıldığında formu gönderme fonksiyonu
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRegister(e);
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
            Yıldızlar Söner, SANVORT Kalır.
          </p>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleRegister} className="w-full">
          
          <div style={{ marginBottom: "28px" }}>
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-7 py-5 text-lg text-white placeholder-zinc-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-violet-500 focus:bg-white/15 focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50"
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
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

          <div style={{ marginBottom: "28px" }}>
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-7 py-5 text-lg text-white placeholder-zinc-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-violet-500 focus:bg-white/15 focus:ring-2 focus:ring-violet-500/40 disabled:opacity-50"
            />
          </div>

          <div style={{ marginBottom: "36px" }}>
            <input
              type="password"
              placeholder="Şifre Tekrarı"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>

        {/* Alt Bilgi */}
        <p className="mt-10 text-center text-lg text-zinc-300">
          Zaten bir hesabın var mı?{" "}
          <Link
            href="/login"
            className="font-bold text-violet-400 hover:text-violet-300 hover:underline transition-colors ml-1"
          >
            Giriş Yap
          </Link>
        </p>

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