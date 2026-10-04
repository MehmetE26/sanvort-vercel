"use client";

interface CreatePostProps {
  postText: string;
  setPostText: (value: string) => void;
  onShare: () => void;
}

export default function CreatePost({
  postText,
  setPostText,
  onShare,
}: CreatePostProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <h3 className="text-2xl font-bold text-violet-300 tracking-wide">
        Ne düşünüyorsun?
      </h3>

      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="Bir şeyler paylaş..."
        className="w-full h-48 rounded-2xl border-2 border-violet-500/20 bg-zinc-950/80 p-6 text-xl text-white placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all resize-none shadow-inner"
      />

      <button
        onClick={onShare}
        className="w-full py-5 rounded-2xl btn-primary text-xl font-bold tracking-wider hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
      >
        Paylaş
      </button>
    </div>
  );
}