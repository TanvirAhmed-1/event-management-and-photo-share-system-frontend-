"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Sparkles, ArrowRight, Check } from "lucide-react";
import { EventWizardState } from "./types";
import toast from "react-hot-toast";

interface StepLocationEventTypeProps {
  state: EventWizardState;
  setState: React.Dispatch<React.SetStateAction<EventWizardState>>;
  eventTypes: any[];
  onNext: () => void;
  onApplyPreset?: (preset: "wedding" | "birthday" | "corporate") => void;
}

const CITIES = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Cox's Bazar", "Khulna"];
const DHAKA_AREAS = ["Gulshan", "Banani", "Mirpur", "Dhanmondi", "Uttara", "Bashundhara", "Mohammadpur"];

export default function StepLocationEventType({
  state,
  setState,
  eventTypes,
  onNext,
  onApplyPreset,
}: StepLocationEventTypeProps) {
  const [detecting, setDetecting] = useState(false);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error("GPS geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const detectedCity = data?.address?.city || data?.address?.state_district || "Dhaka";
          const detectedArea = data?.address?.suburb || data?.address?.neighbourhood || "Gulshan";
          setState((prev) => ({
            ...prev,
            city: detectedCity.includes("Dhaka") ? "Dhaka" : detectedCity,
            area: detectedArea,
          }));
          toast.success(`Location detected: ${detectedArea}, ${detectedCity}`);
        } catch {
          setState((prev) => ({ ...prev, city: "Dhaka", area: "Gulshan" }));
          toast.success("Location set to Gulshan, Dhaka");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        toast.error("Unable to access GPS. Please select your city manually.");
        setDetecting(false);
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* Location Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#172554] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#7C3AED]" />
              1. Select Event Location
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose your city and area or auto-detect via GPS.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={detecting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] text-xs font-bold border border-purple-200 transition"
          >
            <Navigation className={`w-3.5 h-3.5 ${detecting ? "animate-spin" : ""}`} />
            <span>{detecting ? "Detecting GPS..." : "Auto-Detect via GPS"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">City *</label>
            <select
              value={state.city}
              onChange={(e) => setState((prev) => ({ ...prev, city: e.target.value }))}
              className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Area / Zone</label>
            <input
              type="text"
              list="area-suggestions"
              value={state.area}
              onChange={(e) => setState((prev) => ({ ...prev, area: e.target.value }))}
              placeholder="e.g. Mirpur, Gulshan, Banani"
              className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
            />
            <datalist id="area-suggestions">
              {DHAKA_AREAS.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      {/* Event Type Selection */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#172554] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F5B942]" />
              2. Choose Event Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select the occasion you are planning or load a pre-made template.
            </p>
          </div>

          {onApplyPreset && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">Quick Template:</span>
              <button
                type="button"
                onClick={() => onApplyPreset("wedding")}
                className="px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition"
              >
                Elegant Wedding
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset("birthday")}
                className="px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 text-[11px] font-bold transition"
              >
                Birthday Pack
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {eventTypes.map((et: any) => {
            const isSelected = state.eventTypeId === et.id;
            return (
              <button
                key={et.id}
                type="button"
                onClick={() =>
                  setState((prev) => ({
                    ...prev,
                    eventTypeId: et.id,
                    eventTypeName: et.name,
                    title: prev.title || `${et.name} Celebration`,
                  }))
                }
                className={`relative group text-left rounded-2xl overflow-hidden border-2 transition-all ${
                  isSelected
                    ? "border-[#7C3AED] ring-4 ring-[#7C3AED]/10 shadow-md"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="relative h-24 w-full bg-slate-100">
                  <img
                    src={
                      et.imageUrl ||
                      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={et.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <div className="text-xs font-bold text-[#172554]">{et.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {et.description || "Custom & curated options"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (!state.eventTypeId) {
                toast.error("Please select an event category first!");
                return;
              }
              onNext();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition"
          >
            <span>Continue to Event Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

