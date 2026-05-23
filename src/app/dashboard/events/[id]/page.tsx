"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetEventByIdQuery } from "@/redux/features/event/eventApi";
import { useGetPhotosByEventQuery, useUploadPhotosMutation, useDeletePhotoMutation } from "@/redux/features/photo/photoApi";
import { useReprocessEventMutation } from "@/redux/features/ai/aiApi";
import { useAppSelector } from "@/redux/hook";
import { useState } from "react";
import { ArrowLeft, Upload, Download, Trash2, Calendar, FileImage, ImageIcon, ShieldCheck, Sparkles } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import GlassCard from "@/components/shared/GlassCard";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Container from "@/components/shared/Container";

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
      toast.loading("Invoking AI models & scanning all photos for faces...", { id: "reprocess-toast" });
      const res = await reprocessEvent(id).unwrap();
      if (res.success) {
        toast.success(
          `AI Scanning completed! Scanned ${res.data.processedCount}/${res.data.totalPhotos} photos, detected ${res.data.totalFacesDetected} faces in total!`,
          { id: "reprocess-toast", duration: 5000 }
        );
        refetchPhotos();
        refetchEvent();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.data?.message || "Failed to start AI Face Scan. Please verify that the Flask AI service is running on Port 5000.",
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
      toast.loading("Processing AI mappings and saving assets...", { id: "upload-toast" });
      const res = await uploadPhotos(formData).unwrap();
      if (res.success) {
        toast.success(res?.message || "Photos uploaded and mapped successfully!", { id: "upload-toast" });
        setUploadOpen(false);
        refetchEvent();
        refetchPhotos();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to upload photos. Storage limit exceeded or backend error.", { id: "upload-toast" });
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const confirmResult = await Swal.fire({
      title: "Delete Image?",
      text: "Are you sure you want to permanently delete this photo? Neural embeddings mapped to this photo will also be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b76e79",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Yes, delete",
      background: "#131315",
      color: "#f4f4f7",
    });

    if (confirmResult.isConfirmed) {
      try {
        toast.loading("Deleting image...", { id: "delete-toast" });
        const res = await deletePhoto(photoId).unwrap();
        toast.success("Image deleted successfully!", { id: "delete-toast" });
        refetchEvent();
        refetchPhotos();
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to delete image.", { id: "delete-toast" });
      }
    }
  };

  const handleDownloadZip = async () => {
    if (photos.length === 0) {
      toast.error("No photos available in this event pool!");
      return;
    }

    try {
      toast.loading("Streaming and preparing high-compression ZIP file...", { id: "zip-toast" });
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
      const response = await fetch(`${baseUrl}/photos/event/${id}/download-zip`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to stream ZIP archive");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${(event?.title || "event").replace(/\s+/g, "_")}_photos.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
      toast.success("ZIP downloaded successfully!", { id: "zip-toast" });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to stream ZIP archive.", { id: "zip-toast" });
    }
  };

  if (eventLoading) {
    return (
      <div className="flex-grow flex items-center justify-center py-32">
        <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-heading text-white">Event Pool Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">The wedding event you are looking for does not exist or you lack permission to view it.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-6">Back to Dashboard</Button>
      </div>
    );
  }

  const totalEventSize = photos.reduce((acc: number, p: any) => acc + p.sizeMB, 0);

  return (
    <Container className="py-10 flex flex-col gap-8 animate-in fade-in duration-300">

      {/* Return Navigation */}
      <button
        onClick={() => router.push("/dashboard")}
        className="self-start inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-500 hover:text-[#d4af37] transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Dashboard Overview
      </button>

      {/* Luxury Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Event Catalog Manager
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-xs text-gray-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#d4af37]/65" />
              Seeded: {new Date(event.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#d4af37]/65" />
              Photos Pool: {photos.length}
            </span>
            <span className="flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-[#d4af37]/65" />
              Catalog Weight: {totalEventSize >= 1000 ? `${(totalEventSize / 1000).toFixed(2)} GB` : `${totalEventSize.toFixed(1)} MB`}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <Button
            variant="secondary"
            onClick={() => setUploadOpen(!uploadOpen)}
            className="flex-grow sm:flex-grow-0"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadOpen ? "Close Uploader" : "Add Photos"}
          </Button>

          <Button
            onClick={handleDownloadZip}
            disabled={photos.length === 0}
            className="flex-grow sm:flex-grow-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Download ZIP
          </Button>

          <Button
            variant="secondary"
            onClick={handleReprocess}
            disabled={photos.length === 0 || reprocessLoading}
            className="flex-grow sm:flex-grow-0 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"
          >
            <Sparkles className="w-4 h-4 mr-2 text-[#d4af37] animate-pulse" />
            AI Face Scan
          </Button>
        </div>
      </div>

      {/* Expanding Upload Panel */}
      {uploadOpen && (
        <GlassCard className="border border-[#d4af37]/20 p-6 animate-in slide-in-from-top duration-300 bg-[#0a0a0d]/60" hoverEffect={false}>
          <div className="mb-4">
            <h3 className="font-heading font-black text-sm uppercase tracking-widest text-[#d4af37]">Photo Multi-Upload Pipeline</h3>
            <p className="text-[10px] text-gray-500 mt-1">Upload wedding photos. Our Flask AI server will scan faces in real-time to generate embedding coordinates.</p>
          </div>
          <FileUpload onUpload={handleUploadPhotos} isLoading={uploadLoading} />
        </GlassCard>
      )}

      {/* Photo Assets Grid */}
      <div className="flex-grow flex flex-col gap-6">
        <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white flex items-center gap-2">
          <FileImage className="w-5 h-5 text-[#d4af37]" /> Uploaded Assets ({photos.length})
        </h2>

        {photosLoading ? (
          <div className="flex justify-center items-center py-20 flex-grow">
            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
          </div>
        ) : photos.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10" hoverEffect={false}>
            <ImageIcon className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
            <h3 className="text-base font-bold font-heading text-white">Catalog is Empty</h3>
            <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
              No photos have been uploaded to this pool yet. Click the "Add Photos" button to start populating your catalog.
            </p>
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="w-4 h-4 mr-2" /> Add Photos Now
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {photos.map((photo: any) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-2xl bg-[#0c0c0f] border border-white/5 hover:border-[#d4af37]/20 transition-all duration-300 overflow-hidden"
              >
                <img
                  src={photo.imageUrl}
                  alt="Wedding snap"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Grid Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">

                  {/* Delete trigger */}
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="self-end p-2 rounded-lg bg-red-950/60 border border-red-500/20 text-red-400 hover:text-white transition-all hover:scale-110 hover:bg-red-700"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-gray-400 font-semibold truncate pr-2">
                    {photo.faces && photo.faces.length > 0 ? (
                      <span className="flex items-center gap-1 bg-emerald-950/50 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> {photo.faces.length} {photo.faces.length === 1 ? "Face" : "Faces"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-amber-950/50 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20" title="AI faces not processed or no face detected. Click 'AI Face Scan' to reprocess.">
                        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> No Faces
                      </span>
                    )}
                    <span>{photo.sizeMB.toFixed(2)} MB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </Container>
  );
}
