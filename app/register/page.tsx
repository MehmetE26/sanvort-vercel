"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function Register() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // CANLI ORTAMDA GARANTİ ÇALIŞAN CANVAS MOTORU
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth || document.documentElement.clientWidth;
      canvas.height = window.innerHeight || document.documentElement.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Yıldız listesi
    const starCount = 250;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha >= 1 || star.alpha <= 0.1) {
          star.speed = -star.speed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#c084fc"; // Parlak Mor Parıltı
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
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
          data: { username },
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRegister(e);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#030014] text-white px-6 py-12">
      
      {/* 1. Ekranı tamamen kaplayan Sabit Yıldız Katmanı (z-0) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
      />

      {/* 2. Arka Plan Işıkları (z-1) */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[140px] pointer-events-none z-1" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none z-1" />

      {/* 3. Form Alanı (z-10 - En üstte) */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="select-none text-5xl font-black tracking-[10px] text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-violet-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] md:text-7xl">
              SANVORT
            </h1>
          </Link>
          <div className="mx-auto mt-3 h-1.5 w-40 rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 shadow-[0_0_25px_#a855f7]" />
          <p className="mt-4 text-lg italic text-purple-200/80 md:text-xl font-medium">
            Yıldızlar Söner, SANVORT Kalır.
          </p>
        </div>

        {/* Cam Kart */}
        <div className="w-full rounded-3xl border border-purple-500/20 bg-white/[0.04] p-8 backdrop-blur-md shadow-[0_0_50px_rgba(139,92,246,0.15)]">
          <form onSubmit={handleRegister} className="w-full">
            <div style={{ marginBottom: "18px" }}>
              <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ padding: "14px 20px" }}
                className="w-full rounded-2xl border border-white/20 bg-white/10 text-lg text-white placeholder-purple-200/50 outline-none transition-all duration-300 focus:border-purple-400 focus:bg-purple-950/40 focus:ring-4 focus:ring-purple-500/40 disabled:opacity-50"
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <input
                type="email"
                placeholder="E-Posta Adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ padding: "14px 20px" }}
                className="w-full rounded-2xl border border-white/20 bg-white/10 text-lg text-white placeholder-purple-200/50 outline-none transition-all duration-300 focus:border-purple-400 focus:bg-purple-950/40 focus:ring-4 focus:ring-purple-500/40 disabled:opacity-50"
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ padding: "14px 20px" }}
                className="w-full rounded-2xl border border-white/20 bg-white/10 text-lg text-white placeholder-purple-200/50 outline-none transition-all duration-300 focus:border-purple-400 focus:bg-purple-950/40 focus:ring-4 focus:ring-purple-500/40 disabled:opacity-50"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <input
                type="password"
                placeholder="Şifre Tekrarı"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ padding: "14px 20px" }}
                className="w-full rounded-2xl border border-white/20 bg-white/10 text-lg text-white placeholder-purple-200/50 outline-none transition-all duration-300 focus:border-purple-400 focus:bg-purple-950/40 focus:ring-4 focus:ring-purple-500/40 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ padding: "16px" }}
              className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-lg font-bold tracking-wider text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
            </button>
          </form>

          <p className="mt-6 text-center text-base text-zinc-300">
            Zaten bir hesabın var mı?{" "}
            <Link
              href="/login"
              className="font-bold text-purple-400 hover:text-purple-300 hover:underline transition-colors ml-1"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}