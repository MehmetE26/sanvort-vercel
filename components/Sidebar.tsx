"use client";

import Link from "next/link";
import ProfileSettings from "./ProfileSettings";

interface SidebarProps {
  menuOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ menuOpen, onClose }: SidebarProps) {
  if (!menuOpen) return null;

  return (
    <>
      {/* Arka Plan Karartma (Overlay) */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Yan Panel */}
      <div className="fixed top-0 left-0 bottom-0 z-50 w-80 sm:w-96 bg-zinc-950 p-6 border-r border-zinc-800 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-xl font-black text-violet-500">SANVORT</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Menü Linkleri */}
          <nav className="flex flex-col gap-3 mb-8">
            <Link
              href="/home"
              onClick={onClose}
              className="rounded-xl bg-violet-600/10 px-4 py-3 font-semibold text-violet-400 border border-violet-500/20"
            >
              🏠 Ana Sayfa
            </Link>
            <Link
              href="/profile"
              onClick={onClose}
              className="rounded-xl px-4 py-3 font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              👤 Profil
            </Link>
            <Link
              href="/settings"
              onClick={onClose}
              className="rounded-xl px-4 py-3 font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              ⚙️ Ayarlar
            </Link>
          </nav>

          {/* Profil Ayarları Alanı */}
          <div className="border-t border-zinc-800 pt-6">
            <ProfileSettings />
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-4 mt-8 text-xs text-zinc-500 text-center">
          © 2026 SANVORT
        </div>
      </div>
    </>
  );
}