"use client";

import React, { useState } from "react";
import { Download, Eye, X, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface MatchedPhotosGridProps {
  photos: any[];
  hasScanned: boolean;
  isLoading: boolean;
}

export default function MatchedPhotosGrid({
  photos,
  hasScanned,
  isLoading,
}: MatchedPhotosGridProps) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const handleDownload = async (url: string, id: string) => {
    try {
      toast.loading("Downloading photo...", { id: "dl-toast" });
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `eventora_photo_${id.slice(0, 6)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Photo downloaded!", { id: "dl-toast" });
    } catch {
      toast.error("Download failed.", { id: "dl-toast" });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
      <h3 className="text-base font-bold text-[#172554] mb-4">
        2. Matched Photos ({photos.length})
      </h3>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          Scanning event photos with AI facial detection...
        </div>
      ) : !hasScanned ? (
        <div className="py-16 text-center text-xs text-slate-400">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p>Capture or upload a selfie, then click "Match My Face" to discover your photos.</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">No matching photos found in this event gallery.</p>
          <p className="text-slate-400 mt-1">Try snapping a clearer selfie facing forward in brighter light.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo: any) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-xs"
            >
              <img
                src={photo.imageUrl}
                alt="Matched Event"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <button
                  onClick={() => setPreviewImg(photo.imageUrl)}
                  className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs font-semibold"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDownload(photo.imageUrl, photo.id)}
                  className="p-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Preview Zoom */}
      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImg} alt="Preview" className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

