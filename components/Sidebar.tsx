"use client";

import Link from "next/link";

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
      <div className="fixed top-0 left-0 bottom-0 z-50 w-80 sm:w-96 bg-gradient-to-br from-violet-950/90 via-zinc-950/95 to-blue-950/90 backdrop-blur-2xl p-6 border-r border-violet-500/30 flex flex-col justify-between shadow-[0_0_50px_rgba(139,92,246,0.25)] overflow-y-auto">
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-violet-500/20 pb-4">
            <h2 className="text-xl font-black text-violet-400">SANVORT</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Menü Linkleri */}
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={onClose}
              className="rounded-xl bg-violet-600/20 px-4 py-3 font-semibold text-violet-300 border border-violet-500/30 transition-all hover:bg-violet-600/30 flex items-center gap-3"
            >
              🏠 Ana Sayfa
            </Link>
            <Link
              href="/profile"
              onClick={onClose}
              className="rounded-xl px-4 py-3 font-medium text-zinc-300 hover:bg-violet-600/10 hover:text-white transition-colors flex items-center gap-3"
            >
              👤 Profil
            </Link>
            <Link
              href="/settings"
              onClick={onClose}
              className="rounded-xl px-4 py-3 font-medium text-zinc-300 hover:bg-violet-600/10 hover:text-white transition-colors flex items-center gap-3"
            >
              ⚙️ Ayarlar
            </Link>
          </nav>
        </div>

        <div className="border-t border-violet-500/20 pt-4 text-xs text-zinc-400 text-center">
          © 2026 SANVORT
        </div>
      </div>
    </>
  );
}