"use client";

import { useParams } from "next/navigation";
import { useSearchFaceMutation } from "@/redux/features/ai/aiApi";
import { useState, useRef } from "react";
import { Camera, Upload, RefreshCw, Download, Sparkles, AlertCircle, Play, Image as ImageIcon, CameraOff, Eye } from "lucide-react";
import FaceScanner from "@/components/FaceScanner";
import GlassCard from "@/components/shared/GlassCard";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";

export default function GuestScanner() {
  const { eventId } = useParams() as { eventId: string };
  const [searchFace, { isLoading: matchingLoading }] = useSearchFaceMutation();

  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [matchedPhotos, setMatchedPhotos] = useState<any[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [isPackageExpired, setIsPackageExpired] = useState(false);
  const [scannedEventTitle, setScannedEventTitle] = useState("");

  // Web Camera States
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Modal Image Preview Zoom
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const startCamera = async () => {
    setPreviewSrc(null);
    setSelfieFile(null);
    setMatchedPhotos([]);
    setHasScanned(false);
    setIsPackageExpired(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to access front camera. Please upload a selfie file instead.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 480;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // mirror-flip snap
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_selfie.jpg", { type: "image/jpeg" });
            const url = URL.createObjectURL(blob);
            setSelfieFile(file);
            setPreviewSrc(url);
            stopCamera();
            toast.success("Selfie captured successfully!");
          }
        }, "image/jpeg", 0.9);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed!");
        return;
      }
      setSelfieFile(file);
      setPreviewSrc(URL.createObjectURL(file));
      setMatchedPhotos([]);
      setHasScanned(false);
      setIsPackageExpired(false);
      stopCamera();
    }
  };

  const handleScanFace = async () => {
    if (!selfieFile) {
      toast.error("Please upload or capture a selfie first!");
      return;
    }

    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("selfie", selfieFile);

    try {
      const res = await searchFace(formData).unwrap();
      if (res.success) {
        setMatchedPhotos(res.data || []);
        setHasScanned(true);
        setIsPackageExpired(!!res.packageExpired);
        if (res.eventTitle) {
          setScannedEventTitle(res.eventTitle);
        }

        if (res.packageExpired) {
          toast.error("This event's package is inactive! Please ask the organizer to upgrade.", { duration: 6000 });
        } else if (res.data?.length > 0) {
          toast.success(`Match completed! Found ${res.data.length} photos.`);
        } else {
          toast.success("Scanning completed, but no matched photos found in this event pool.");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "AI Matching failed. Try capturing in better lighting.");
    }
  };

  const handleDownloadSingle = async (url: string, id: string) => {
    try {
      toast.loading("Downloading photo...", { id: "dl-toast" });
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `wedding_photo_${id.slice(0, 5)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Photo downloaded!", { id: "dl-toast" });
    } catch (err) {
      console.error(err);
      toast.error("Download failed.", { id: "dl-toast" });
    }
  };

  return (
    <Container className="py-10 flex flex-col gap-10 relative z-10 animate-in fade-in duration-300">

      {/* Title Header */}
      <div className="text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Guest Face Scanner Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-1">
          Find Your <span className="text-gold-gradient">Wedding Photos</span>
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
          Snap a selfie or upload an image. Our neural mappings instantly find every professional shot containing your face.
        </p>
      </div>

      {/* Expiry Warning Banner */}
      {isPackageExpired && (
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-3xl p-6 flex items-center gap-4 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden animate-in slide-in-from-top duration-300">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
            <AlertCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="font-heading font-black text-sm uppercase text-white tracking-wide">
              Wedding Event Package Inactive
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              This wedding event pool ({scannedEventTitle || "ShareMyPhoto Event"}) is currently running on an inactive or expired package. Guests can still scan selfies to find matched photos, but the host/organizer will need to renew or upgrade their plan to manage catalogs or upload additional photos.
            </p>
          </div>
        </div>
      )}

      {/* Main Action Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Upload & Capture Panel */}
        <GlassCard className="p-6 border border-[#d4af37]/10 bg-[#0a0a0d]/50" hoverEffect={false}>
          <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-6">
            1. Target Face Interface
          </h3>

          <div className="space-y-6">

            {/* Camera Viewfinder */}
            {cameraActive && (
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />

                {/* Visual guideline overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-44 h-44 rounded-full border-2 border-dashed border-[#d4af37]/40 relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] uppercase font-bold tracking-widest text-[#d4af37] bg-black/60 px-2 py-0.5 rounded-full">
                      Align Face
                    </div>
                  </div>
                </div>

                {/* Viewfinder Controls */}
                <div className="absolute bottom-4 inset-x-4 flex justify-between gap-4">
                  <Button variant="danger" size="sm" onClick={stopCamera} className="w-full">
                    <CameraOff className="w-4 h-4 mr-2" /> Stop
                  </Button>
                  <Button variant="primary" size="sm" onClick={captureSelfie} className="w-full">
                    Snap Face
                  </Button>
                </div>
              </div>
            )}

            {/* Selfie Preview Display */}
            {previewSrc && !cameraActive && !matchingLoading && (
              <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-[#d4af37]/20 bg-[#060608]">
                <img
                  src={previewSrc}
                  alt="Selfie Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setPreviewSrc(null);
                    setSelfieFile(null);
                    setMatchedPhotos([]);
                    setHasScanned(false);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/65 text-gray-400 hover:text-white border border-white/5"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action Selection */}
            {!cameraActive && !previewSrc && !matchingLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Camera Trigger */}
                <button
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/5 hover:border-[#d4af37]/35 bg-[#0e0e12]/60 hover:bg-[#d4af37]/5 transition-all text-center group cursor-pointer"
                >
                  <Camera className="w-7 h-7 text-[#d4af37] group-hover:scale-110 transition-transform" />
                  <span className="font-heading font-semibold text-xs uppercase tracking-wider text-white">Use Camera</span>
                </button>

                {/* File picker dropzone */}
                <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-white/5 hover:border-[#d4af37]/35 bg-[#0e0e12]/60 hover:bg-[#d4af37]/5 transition-all text-center group cursor-pointer">
                  <Upload className="w-7 h-7 text-[#d4af37] group-hover:scale-110 transition-transform" />
                  <span className="font-heading font-semibold text-xs uppercase tracking-wider text-white">Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Run Face Scanner trigger */}
            {previewSrc && !matchingLoading && (
              <Button
                onClick={handleScanFace}
                className="w-full mt-4"
                size="lg"
              >
                Scan Wedding Catalog
              </Button>
            )}
          </div>
        </GlassCard>

        {/* Scan / Match Screen Output Panel */}
        <div className="w-full">
          {matchingLoading ? (
            <FaceScanner imageSrc={previewSrc || ""} />
          ) : (
            <GlassCard className="p-6 border border-white/5 bg-[#0a0a0d]/50 min-h-[300px] flex flex-col justify-between" hoverEffect={false}>
              <div>
                <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white mb-6">
                  2. Mapped Photo Results
                </h3>

                {hasScanned ? (
                  matchedPhotos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <AlertCircle className="w-10 h-10 text-gray-500 mb-4 animate-bounce" />
                      <h4 className="font-heading font-bold text-sm text-white mb-1">No Matches Located</h4>
                      <p className="text-[10px] text-gray-500 max-w-xs leading-normal">
                        Our neural model scanned all catalog embeddings but located no matches. Try scanning again with different angles, clear lighting, or glasses off.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {matchedPhotos.map((photo: any) => (
                        <div
                          key={photo.id}
                          className="group relative aspect-square rounded-xl bg-[#131316] overflow-hidden border border-white/5"
                        >
                          <img
                            src={photo.imageUrl}
                            alt="Matched Wedding Snap"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                            <button
                              onClick={() => setPreviewModalImg(photo.imageUrl)}
                              className="p-2 rounded-lg bg-black/60 border border-white/10 text-gray-300 hover:text-white transition-all hover:scale-105"
                              title="Zoom Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadSingle(photo.imageUrl, photo.id)}
                              className="p-2 rounded-lg bg-[#d4af37] text-black transition-all hover:scale-105 hover:shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                              title="Download Photo"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ImageIcon className="w-10 h-10 text-gray-600 mb-4" />
                    <h4 className="font-heading font-bold text-xs text-gray-500 uppercase tracking-widest">Awaiting Scanner Input</h4>
                    <p className="text-[10px] text-gray-600 mt-1 max-w-[220px] leading-normal">
                      Scan your face details on the left panels to instantly display your wedding photo matches here.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Image Zoom Preview Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewModalImg(null)}>
          <div className="relative max-w-3xl w-full max-h-[85vh] rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewModalImg}
              alt="Zoomed Snap"
              className="w-full h-auto object-contain max-h-[85vh] mx-auto rounded-lg"
            />
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 bg-black/65 hover:bg-black/90 text-white font-bold px-3 py-1.5 rounded-full text-xs border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}
