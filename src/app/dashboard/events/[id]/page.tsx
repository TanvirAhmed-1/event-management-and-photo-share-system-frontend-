"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetEventByIdQuery } from "@/redux/features/event/eventApi";
import { useGetPhotosByEventQuery, useUploadPhotosMutation, useDeletePhotoMutation } from "@/redux/features/photo/photoApi";
import { useReprocessEventMutation } from "@/redux/features/ai/aiApi";
import { useAppSelector } from "@/redux/hook";
import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  Download,
  Trash2,
  Calendar,
  FileImage,
  ImageIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import FileUpload from "@/components/FileUpload";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Link from "next/link";

export default function EventDetail() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  const { data: eventResponse, isLoading: eventLoading, refetch: refetchEvent } = useGetEventByIdQuery(id);
  const { data: photosResponse, isLoading: photosLoading, refetch: refetchPhotos } = useGetPhotosByEventQuery(id);
  const [uploadPhotos, { isLoading: uploadLoading }] = useUploadPhotosMutation();
  const [deletePhoto] = useDeletePhotoMutation();
  const [reprocessEvent, { isLoading: reprocessLoading }] = useReprocessEventMutation();

  const [uploadOpen, setUploadOpen] = useState(false);

  const event = eventResponse?.data || null;
  const photos = photosResponse?.data || [];

  const handleReprocess = async () => {
    if (photos.length === 0) {
      toast.error("No photos available in this event pool!");
      return;
    }

    try {
      toast.loading("Scanning photos for faces with AI models...", { id: "reprocess-toast" });
      const res = await reprocessEvent(id).unwrap();
      if (res.success) {
        toast.success(
          `AI Face Scan finished! Scanned ${res.data.processedCount}/${res.data.totalPhotos} photos, detected ${res.data.totalFacesDetected} faces!`,
          { id: "reprocess-toast", duration: 5000 }
        );
        refetchPhotos();
        refetchEvent();
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to start AI Face Scan. Check that backend AI service is active.",
        { id: "reprocess-toast", duration: 5000 }
      );
    }
  };

  const handleUploadPhotos = async (files: File[]) => {
    const formData = new FormData();
    formData.append("eventId", id);
    files.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      toast.loading("Uploading and embedding photo coordinates...", { id: "upload-toast" });
      const res = await uploadPhotos(formData).unwrap();
      if (res.success) {
        toast.success(res?.message || "Photos uploaded successfully!", { id: "upload-toast" });
        setUploadOpen(false);
        refetchEvent();
        refetchPhotos();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to upload photos. Check storage quota.", { id: "upload-toast" });
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const confirmResult = await Swal.fire({
      title: "Delete Photo?",
      text: "Are you sure? Face embeddings for this photo will also be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7C3AED",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Delete",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deletePhoto(photoId).unwrap();
        toast.success("Photo deleted successfully!");
        refetchEvent();
        refetchPhotos();
      } catch (err: any) {
        toast.error("Failed to delete photo.");
      }
    }
  };

  const handleDownloadZip = async () => {
    if (photos.length === 0) {
      toast.error("No photos available to download!");
      return;
    }

    try {
      toast.loading("Preparing ZIP archive...", { id: "zip-toast" });
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${baseUrl}/photos/event/${id}/download-zip`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Download stream failed.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event?.title || "Eventora-Photos"}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("ZIP download started!", { id: "zip-toast" });
    } catch (err: any) {
      toast.error("Failed to stream ZIP.", { id: "zip-toast" });
    }
  };

  const totalEventSize = photos.reduce((acc: number, p: any) => acc + (p.sizeMB || 0), 0);

  return (
    <div className="w-full py-8 lg:py-12 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#7C3AED] transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Host Hub</span>
        </Link>

        {/* Event Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-[11px] font-bold border border-purple-200 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Event Photo Pool</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              {event?.title || "Event Gallery"}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
              <span>{photos.length} Total Photos</span>
              <span>•</span>
              <span>
                {totalEventSize >= 1000
                  ? `${(totalEventSize / 1000).toFixed(2)} GB`
                  : `${totalEventSize.toFixed(1)} MB`}{" "}
                Used
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setUploadOpen(!uploadOpen)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-xs"
            >
              <Upload className="w-4 h-4" />
              <span>{uploadOpen ? "Close Uploader" : "Upload Photos"}</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={photos.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP</span>
            </button>

            <button
              onClick={handleReprocess}
              disabled={photos.length === 0 || reprocessLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              <span>AI Face Scan</span>
            </button>
          </div>
        </div>

        {/* Upload Panel */}
        {uploadOpen && (
          <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-md">
            <h3 className="text-sm font-bold text-[#172554] mb-1">Upload Event Photos</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select or drop multiple photos. Detected faces will be embedded automatically for guest searching.
            </p>
            <FileUpload onUpload={handleUploadPhotos} isLoading={uploadLoading} />
          </div>
        )}

        {/* Photo Gallery Grid */}
        <div>
          <h2 className="text-lg font-bold text-[#172554] mb-4 flex items-center gap-2">
            <FileImage className="w-5 h-5 text-[#7C3AED]" />
            Uploaded Photos ({photos.length})
          </h2>

          {photosLoading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading gallery photos...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#172554]">No Photos Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Upload photos to enable AI face search for your guests.
              </p>
              <button
                onClick={() => setUploadOpen(true)}
                className="px-4 py-2 rounded-full bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition"
              >
                Upload First Photos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {photos.map((photo: any) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all"
                >
                  <img
                    src={photo.imageUrl}
                    alt="Event Snap"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="self-end p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center justify-between text-[10px] text-white font-semibold">
                      {photo.faces && photo.faces.length > 0 ? (
                        <span className="flex items-center gap-1 bg-emerald-500/80 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> {photo.faces.length} Faces
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-amber-500/80 px-2 py-0.5 rounded-full">
                          No Faces
                        </span>
                      )}
                      <span>{photo.sizeMB?.toFixed(1)} MB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
