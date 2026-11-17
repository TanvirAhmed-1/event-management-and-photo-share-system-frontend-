"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, ImagePlus, CheckCircle2 } from "lucide-react";
import {
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
} from "@/redux/features/upload/uploadApi";
import toast from "react-hot-toast";

interface CloudinaryImageUploadProps {
  multiple?: boolean;
  value?: string;
  values?: string[];
  onChange?: (url: string) => void;
  onChangeMany?: (urls: string[]) => void;
  label?: string;
  helperText?: string;
}

/**
 * Compact image uploader storing files directly in Cloudinary via `/upload/image` or `/upload/images`.
 */
export default function CloudinaryImageUpload({
  multiple = false,
  value = "",
  values = [],
  onChange,
  onChangeMany,
  helperText = "JPG, PNG, WEBP · Max 20MB",
}: CloudinaryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadSingle, { isLoading: isUploadingSingle }] =
    useUploadSingleImageMutation();
  const [uploadMultiple, { isLoading: isUploadingMultiple }] =
    useUploadMultipleImagesMutation();

  const isUploading = isUploadingSingle || isUploadingMultiple;
  const currentList = multiple ? values : value ? [value] : [];

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length === 0) {
      toast.error("Please select valid image files (JPG, PNG, WEBP).");
      return;
    }

    try {
      if (multiple) {
        const formData = new FormData();
        files.slice(0, 10).forEach((file) => formData.append("images", file));
        const res = await uploadMultiple(formData).unwrap();
        const uploadedUrls = res?.data?.urls || [];
        if (uploadedUrls.length > 0) {
          onChangeMany?.([...values, ...uploadedUrls]);
          toast.success(`${uploadedUrls.length} image(s) uploaded!`);
        }
      } else {
        const formData = new FormData();
        formData.append("image", files[0]);
        const res = await uploadSingle(formData).unwrap();
        const url = res?.data?.url;
        if (url) {
          onChange?.(url);
          toast.success("Image uploaded!");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Image upload failed");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemoveAt = (idx: number) => {
    if (multiple) {
      onChangeMany?.(values.filter((_, i) => i !== idx));
    } else {
      onChange?.("");
    }
  };

  return (
    <div className="space-y-2">
      {/* Compact Horizontal Upload Bar */}
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!isUploading) handleFiles(e.dataTransfer.files);
        }}
        className={`flex items-center justify-between gap-3 rounded-xl border border-dashed px-3 py-2 transition cursor-pointer ${
          isUploading
            ? "border-violet-300 bg-violet-50/40 cursor-wait"
            : "border-slate-300 hover:border-[#7C3AED] hover:bg-violet-50/30 bg-slate-50/70"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple={multiple}
          disabled={isUploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-violet-100 text-[#7C3AED] flex items-center justify-center shrink-0">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : currentList.length > 0 && multiple ? (
              <ImagePlus className="w-4 h-4" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#172554] truncate">
              {isUploading
                ? "Uploading image..."
                : multiple
                ? "Upload or drop photos"
                : currentList.length > 0
                ? "Replace cover photo"
                : "Upload cover photo"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{helperText}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-[#7C3AED] shrink-0 shadow-2xs">
          {isUploading ? "..." : "Browse"}
        </span>
      </div>

      {/* Compact Thumbnail Preview Strip */}
      {currentList.length > 0 && (
        <div
          className={
            multiple
              ? "flex flex-wrap gap-2"
              : "flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white"
          }
        >
          {currentList.map((url, idx) =>
            multiple ? (
              <div
                key={`${url}-${idx}`}
                className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group shrink-0"
              >
                <Image
                  src={url}
                  alt={`Uploaded ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAt(idx)}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-900/85 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  title="Remove image"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              <React.Fragment key={url}>
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                  <Image
                    src={url}
                    alt="Uploaded cover"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Image ready</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAt(idx)}
                  className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </React.Fragment>
            )
          )}
        </div>
      )}
    </div>
  );
}
