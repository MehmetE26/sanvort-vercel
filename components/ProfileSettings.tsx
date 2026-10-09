"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error(error);
      }

      if (data) {
        setUsername(data.username || "");
        setAvatarUrl(data.avatar_url || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Profil Resmi Yükleme (Supabase Storage)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setMessage("");

      if (!e.target.files || e.target.files.length === 0) return;
      if (!userId) return;

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      // 1. Supabase Storage 'avatars' bucket'ına resmi yükle
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Yüklenen resmin public URL'ini al
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setAvatarUrl(publicUrl);
      setMessage("Fotoğraf yüklendi! Lütfen 'Kaydet'e bas.");
    } catch (err: any) {
      setMessage("Fotoğraf yükleme hatası: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Kullanıcı Adı ve Profil Resmini Güncelleme
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setLoading(true);
      setMessage("");

      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        username,
        avatar_url: avatarUrl,
      });

      if (error) throw error;
      setMessage("Profilin başarıyla güncellendi!");
      // Değişikliklerin yorum alanına yansıması için sayfayı yenile
      window.location.reload();
    } catch (err: any) {
      setMessage("Güncelleme hatası: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null; // Giriş yapmamışsa gösterme

  return (
  
    <div className="w-full max-w-3xl mx-auto glass rounded-3xl p-8 border-2 border-violet-500/30 shadow-[0_15px_50px_rgba(0,0,0,0.6)] text-white">
      <h3 className="text-2xl font-bold text-violet-400 mb-6 text-center">
        Profil Ayarları
      </h3>

      {message && (
        <p className="text-sm text-center mb-6 text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
          {message}
        </p>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Profil Resmi Önizleme ve Yükleme */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
            alt="Profil Resmi"
            className="w-24 h-24 rounded-full object-cover border-2 border-violet-500 shadow-xl"
          />
          <label className="cursor-pointer bg-zinc-900/80 hover:bg-violet-600/30 text-xs px-4 py-2.5 rounded-xl border border-violet-500/30 transition-all font-medium">
            {uploading ? "Fotoğraf Yükleniyor..." : "Profil Resmi Seç"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Kullanıcı Adı */}
        <div>
          <label className="text-sm text-zinc-400 block mb-2 font-medium">Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adın"
            className="w-full bg-zinc-900/80 border border-violet-500/30 rounded-2xl p-4 text-white text-base focus:outline-none focus:border-violet-500 transition-all placeholder-zinc-400"
            required
          />
        </div>

        {/* Kaydet Butonu */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50 text-base shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        >
          {loading ? "Kaydediliyor..." : "Profili Kaydet"}
        </button>
      </form>
    </div>
  );
}