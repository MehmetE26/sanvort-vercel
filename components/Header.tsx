"use client";

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-black/90 px-6 backdrop-blur-md">
      <button
        onClick={onMenuOpen}
        className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-2xl font-black tracking-widest text-violet-500 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
        SANVORT
      </h1>

      <div className="flex items-center gap-4">
        <button className="text-zinc-400 hover:text-white transition-colors">🔔</button>
        <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-sm">
          M
        </div>
      </div>
    </header>
  );
}