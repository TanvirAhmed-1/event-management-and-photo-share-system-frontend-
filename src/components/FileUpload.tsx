"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  isLoading: boolean;
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      addFiles(filesArr);
    }
  };

  const addFiles = (files: File[]) => {
    // Filter for images only
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      toast.error("Only image files are allowed!");
    }

    const totalFiles = [...selectedFiles, ...imageFiles];
    if (totalFiles.length > 20) {
      toast.error("You can select a maximum of 20 files at once!");
      setSelectedFiles(totalFiles.slice(0, 20));
    } else {
      setSelectedFiles(totalFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArr = Array.from(e.dataTransfer.files);
      addFiles(filesArr);
    }
  };

  const removeFile = (idx: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first!");
      return;
    }
    
    try {
      await onUpload(selectedFiles);
      setSelectedFiles([]); // clear after successful upload
    } catch (error) {
      console.error("Upload handler failed:", error);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerSelect}
        className="w-full min-h-[180px] rounded-2xl border border-dashed border-[#d4af37]/20 hover:border-[#d4af37]/45 bg-[#0a0a0d]/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 hover:bg-[#d4af37]/5 group relative overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-radial-gradient(circle, rgba(212,175,55,0.03)_0%, transparent_70%) pointer-events-none"></div>

        <UploadCloud className="w-10 h-10 text-[#d4af37] animate-pulse group-hover:scale-110 transition-transform duration-300 mb-3" />
        
        <h4 className="font-heading font-bold text-sm text-white">Drag & drop your files here</h4>
        <p className="text-[10px] text-gray-500 mt-1 max-w-xs leading-normal">
          Supports JPEG, PNG, WEBP. Select up to <span className="text-[#d4af37] font-semibold">20 professional wedding images</span> (Max 10MB per image).
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
          disabled={isLoading}
        />
      </div>

      {/* Selected Files Preview Grid */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs text-gray-400 font-semibold border-b border-white/5 pb-2">
            <span>Selected Files ({selectedFiles.length} of 20)</span>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-[#b76e79] hover:underline"
              disabled={isLoading}
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {selectedFiles.map((file, idx) => {
              const fileUrl = URL.createObjectURL(file);
              return (
                <div
                  key={idx}
                  className="group relative aspect-square rounded-xl bg-[#0e0e12] border border-white/5 overflow-hidden flex items-center justify-center p-2"
                >
                  <img
                    src={fileUrl}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2 rounded-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      className="self-end p-1 rounded-md bg-red-950/40 border border-red-500/20 text-red-400 hover:text-white transition-all hover:bg-red-550"
                      disabled={isLoading}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    
                    <span className="text-[8px] text-gray-400 truncate w-full pr-2 text-left">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleUploadClick}
              isLoading={isLoading}
              size="md"
              className="w-full sm:w-auto"
            >
              Start Upload Queue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
