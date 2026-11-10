"use client";

import { useParams } from "next/navigation";
import { useSearchFaceMutation } from "@/redux/features/ai/aiApi";
import { useState, useRef } from "react";
import { Camera, Upload, RefreshCw, Sparkles, CameraOff, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import MatchedPhotosGrid from "@/components/ui/guest/MatchedPhotosGrid";

export default function GuestScanner() {
  const { eventId } = useParams() as { eventId: string };
  const [searchFace, { isLoading: matchingLoading }] = useSearchFaceMutation();

  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [matchedPhotos, setMatchedPhotos] = useState<any[]>([]);
  const [hasScanned, setHasScanned] = useState(false);

  // Web Camera States
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setPreviewSrc(null);
    setSelfieFile(null);
    setMatchedPhotos([]);
    setHasScanned(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch {
      toast.error("Unable to access camera. Please upload an image instead.");
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
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
            setSelfieFile(file);
            setPreviewSrc(URL.createObjectURL(blob));
            stopCamera();
            toast.success("Selfie captured!");
          }
        }, "image/jpeg", 0.9);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelfieFile(file);
      setPreviewSrc(URL.createObjectURL(file));
      setMatchedPhotos([]);
      setHasScanned(false);
      stopCamera();
    }
  };

  const handleScanFace = async () => {
    if (!selfieFile) {
      toast.error("Please capture or upload a selfie first!");
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
        if (res.data?.length > 0) {
          toast.success(`Matched! Found ${res.data.length} photos.`);
        } else {
          toast.success("Scan completed. No matches found in this event pool.");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "AI Matching failed. Try with better lighting.");
    }
  };

  return (
    <div className="w-full py-8 lg:py-14 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 space-y-8">
        <Link
          href="/guest"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#7C3AED] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Galleries</span>
        </Link>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Face Match Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Find Your Event Photos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture or upload a selfie. Eventora's facial recognition will instantly locate every photo of you!
          </p>
        </div>

        {/* 2-Column Interface: Camera / Upload on left + Matched Photos on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Selfie Input */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-[#172554]">1. Your Selfie</h3>

            {/* Camera / Preview Area */}
            <div className="relative aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
              {cameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
              ) : previewSrc ? (
                <img src={previewSrc} alt="Selfie Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">Take a selfie or choose an image from your device</p>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            <div className="grid grid-cols-2 gap-3">
              {cameraActive ? (
                <>
                  <button
                    onClick={captureSelfie}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap Photo</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <CameraOff className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={startCamera}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4 text-[#7C3AED]" />
                  <span>Use Camera</span>
                </button>
              )}

              <label className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-4 h-4 text-[#7C3AED]" />
                <span>Upload File</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Scan Action */}
            <button
              onClick={handleScanFace}
              disabled={!selfieFile || matchingLoading}
              className="w-full py-3 px-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-[#7C3AED]/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {matchingLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Event Photos...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F5B942]" />
                  <span>Match My Face Now</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Matched Photos Grid */}
          <MatchedPhotosGrid
            photos={matchedPhotos}
            hasScanned={hasScanned}
            isLoading={matchingLoading}
          />
        </div>
      </div>
    </div>
  );
}
