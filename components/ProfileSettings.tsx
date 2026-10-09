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
    <div className="w-full max-w-xl mx-auto my-8 bg-zinc-900/80 border border-violet-500/30 p-6 rounded-2xl text-white backdrop-blur-xl">
      <h3 className="text-xl font-bold text-violet-400 mb-4 text-center">
        Profil Ayarları
      </h3>

      {message && (
        <p className="text-sm text-center mb-4 text-amber-400 bg-amber-500/10 p-2 rounded-lg">
          {message}
        </p>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        {/* Profil Resmi Önizleme ve Yükleme */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={avatarUrl || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
            alt="Profil Resmi"
            className="w-20 h-20 rounded-full object-cover border-2 border-violet-500 shadow-lg"
          />
          <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-xs px-3 py-2 rounded-lg border border-white/10 transition-all">
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
          <label className="text-xs text-zinc-400 block mb-1">Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adın"
            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-violet-500"
            required
          />
        </div>

        {/* Kaydet Butonu */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Profili Kaydet"}
        </button>
      </form>
    </div>
  );
}