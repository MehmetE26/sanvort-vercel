"use client";

import { useState, useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";

interface CreatePostProps {
  postText: string;
  setPostText: (value: string) => void;
  onShare: (mediaUrl?: string, mediaType?: "image" | "video" | null) => void;
}

export default function CreatePost({
  postText,
  setPostText,
  onShare,
}: CreatePostProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  // Kamera akışını tamamen kapatmak için güvenlik temizliği
  useEffect(() => {
    return () => {
      if ((window as any).localStream) {
        (window as any).localStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        (window as any).localStream = null;
      }
    };
  }, []);

  const handleUploadSuccess = (result: any, widget: any) => {
    const uploadedUrl = result?.info?.secure_url;
    const resourceType = result?.info?.resource_type;

    setMediaUrl(uploadedUrl);
    setMediaType(resourceType === "video" ? "video" : "image");
    
    if (widget && typeof widget.close === "function") {
      widget.close();
    }
  };

  const handleDeleteMedia = () => {
    const confirmDelete = window.confirm("Bu medyayı silmek istediğinize emin misiniz?");
    if (confirmDelete) {
      setMediaUrl(null);
      setMediaType(null);
    }
  };

  const handleShareClick = () => {
    onShare(mediaUrl || undefined, mediaType);
    setMediaUrl(null);
    setMediaType(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h3 className="text-2xl font-bold text-violet-300 tracking-wide">
        Ne düşünüyorsun?
      </h3>

      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="Bir şeyler paylaş..."
        className="w-full h-36 rounded-2xl border-2 border-violet-500/20 bg-zinc-950/80 p-6 text-xl text-white placeholder-zinc-500 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all resize-none shadow-inner"
      />

      {/* Yüklenen Medya Önizlemesi ve Sil Butonu */}
      {mediaUrl && (
        <div className="relative rounded-2xl overflow-hidden max-h-72 border-2 border-violet-500/30">
          {mediaType === "video" ? (
            <video src={mediaUrl} controls className="w-full h-full object-cover" />
          ) : (
            <img src={mediaUrl} alt="Önizleme" className="w-full h-full object-cover" />
          )}
          <button
            onClick={handleDeleteMedia}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-xl font-medium text-sm transition-all shadow-lg cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            <span>Sil</span>
          </button>
        </div>
      )}

      {/* Alt Araç Çubuğu */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative overflow-hidden rounded-xl border border-violet-500/30 bg-violet-950/30 hover:bg-violet-900/40 transition-all">
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleUploadSuccess}
            options={{ 
              maxFiles: 1, 
              resourceType: "auto",
              transformation: [
                { width: 1280, height: 720, crop: "limit", quality: "auto", fetch_format: "auto" }
              ]
            } as any}
            className="flex items-center gap-2 px-4 py-3 text-violet-300 font-medium cursor-pointer w-full h-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="pointer-events-none">Medya Ekle</span>
          </CldUploadButton>
        </div>

        <button
          onClick={handleShareClick}
          className="flex-1 py-4 rounded-2xl btn-primary text-xl font-bold tracking-wider hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-[0_0_30px_rgba(139,92,246,0.5)] cursor-pointer"
        >
          Paylaş
        </button>
      </div>
    </div>
  );
}