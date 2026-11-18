"use client";

import React, { useState } from "react";
import {
  Calendar,
  Users,
  Utensils,
  Camera,
  Wrench,
  Check,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { EventWizardState } from "./types";
import { useCheckVendorAvailabilityQuery } from "@/redux/features/event/eventApi";
import toast from "react-hot-toast";

interface StepCustomBuilderProps {
  state: EventWizardState;
  setState: React.Dispatch<React.SetStateAction<EventWizardState>>;
  services: any[];
  foodItems: any[];
  foodCategories: any[];
  onBack: () => void;
  onNext: () => void;
}

export default function StepCustomBuilder({
  state,
  setState,
  services,
  foodItems,
  foodCategories,
  onBack,
  onNext,
}: StepCustomBuilderProps) {
  const [activeFoodCat, setActiveFoodCat] = useState<string>("all");

  // Live Date Availability Check via backend
  const { data: availabilityRes, isFetching: checkingAvailability } =
    useCheckVendorAvailabilityQuery(
      { date: state.eventDate },
      { skip: !state.eventDate }
    );

  const bookedServiceIds: string[] = availabilityRes?.data?.bookedServiceIds || [];

  const photographyServices = services.filter(
    (s) =>
      s.isActive !== false &&
      (s.name.toLowerCase().includes("photo") || s.name.toLowerCase().includes("video"))
  );
  const addonServices = services.filter(
    (s) =>
      s.isActive !== false &&
      !s.name.toLowerCase().includes("photo") &&
      !s.name.toLowerCase().includes("video")
  );

  const toggleService = (svc: any, isPhoto = false) => {
    if (bookedServiceIds.includes(svc.id)) {
      toast.error(`${svc.name} is already booked on ${state.eventDate}.`);
      return;
    }
    setState((prev) => {
      const exists = prev.selectedServices.some((s) => s.serviceId === svc.id);
      if (exists) {
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter((s) => s.serviceId !== svc.id),
        };
      }
      return {
        ...prev,
        selectedServices: [
          ...prev.selectedServices,
          {
            serviceId: svc.id,
            name: svc.name,
            basePrice: Number(svc.basePrice),
            pricingModel: svc.pricingModel,
            quantity: 1,
            hours: prev.photographyHours,
            isPhotography: isPhoto,
            includeAiAddon: isPhoto,
          },
        ],
      };
    });
  };

  const toggleFood = (item: any) => {
    setState((prev) => {
      const exists = prev.selectedFoods.some((f) => f.foodItemId === item.id);
      if (exists) {
        return {
          ...prev,
          selectedFoods: prev.selectedFoods.filter((f) => f.foodItemId !== item.id),
        };
      }
      return {
        ...prev,
        selectedFoods: [
          ...prev.selectedFoods,
          {
            foodItemId: item.id,
            name: item.name,
            pricePerPerson: Number(item.pricePerPerson),
            categoryName: item.category?.name,
          },
        ],
      };
    });
  };

  const filteredFood = foodItems.filter(
    (f) => f.isActive !== false && (activeFoodCat === "all" || f.categoryId === activeFoodCat)
  );

  const handleContinue = () => {
    if (!state.eventDate || !state.venue.trim()) {
      toast.error("Please enter Event Date and Venue Address!");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* 1. Date, Time, Venue & Guest Count */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-[#172554] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7C3AED]" />
            Date, Time, Venue & Guest Count
          </h2>
          {state.eventDate && (
            <div className="text-xs font-bold">
              {checkingAvailability ? (
                <span className="text-slate-400">Checking vendor availability...</span>
              ) : bookedServiceIds.length === 0 ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Vendors Available
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5" /> {bookedServiceIds.length} Service(s) Booked on Date
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Event Date *</label>
            <input
              type="date"
              value={state.eventDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setState((p) => ({ ...p, eventDate: e.target.value }))}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Time Slot</label>
            <select
              value={state.eventTime}
              onChange={(e) => setState((p) => ({ ...p, eventTime: e.target.value }))}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="Morning (10:00 AM - 3:00 PM)">Morning (10:00 AM - 3:00 PM)</option>
              <option value="Afternoon (2:00 PM - 6:00 PM)">Afternoon (2:00 PM - 6:00 PM)</option>
              <option value="Evening (6:00 PM - 11:00 PM)">Evening (6:00 PM - 11:00 PM)</option>
              <option value="Full Day (10:00 AM - 11:00 PM)">Full Day (10:00 AM - 11:00 PM)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#7C3AED]" /> Exact Guest Count *
            </label>
            <input
              type="number"
              min={10}
              value={state.guestCount}
              onChange={(e) => setState((p) => ({ ...p, guestCount: Math.max(1, Number(e.target.value)) }))}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Precise Venue / Event Address *</label>
          <input
            type="text"
            value={state.venue}
            onChange={(e) => setState((p) => ({ ...p, venue: e.target.value }))}
            placeholder="e.g. House 14, Road 11, Gulshan-1 / Convention Hall Name"
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
          />
        </div>
      </div>

      {/* 2. Food & Catering Module */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
        <div>
          <h2 className="text-lg font-extrabold text-[#172554] flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-500" />
            Food & Catering Menu ({state.guestCount} Guests)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit prices automatically multiply by {state.guestCount} guests.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFoodCat("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              activeFoodCat === "all" ? "bg-[#172554] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Dishes
          </button>
          {foodCategories.map((c: any) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveFoodCat(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                activeFoodCat === c.id ? "bg-[#172554] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredFood.map((item: any) => {
            const isSelected = state.selectedFoods.some((f) => f.foodItemId === item.id);
            const totalForGuests = Number(item.pricePerPerson) * state.guestCount;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleFood(item)}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                  isSelected
                    ? "border-[#7C3AED] bg-purple-50/50 ring-2 ring-[#7C3AED]/15"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <img
                  src={item.images?.[0] || "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200&auto=format&fit=crop"}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <div className="text-xs font-bold text-[#172554] truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-500">
                    ৳{item.pricePerPerson}/person • <span className="font-bold text-[#7C3AED]">৳{totalForGuests.toLocaleString()}</span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                    isSelected ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-slate-300"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Photography & Media + Additional Services */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-[#172554] flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#7C3AED]" />
            Photography, Media & Add-on Services
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select photography tiers and any additional services you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...photographyServices, ...addonServices].map((svc: any) => {
            const isPhoto =
              svc.name.toLowerCase().includes("photo") || svc.name.toLowerCase().includes("video");
            const isSelected = state.selectedServices.some((s) => s.serviceId === svc.id);
            const isBooked = bookedServiceIds.includes(svc.id);
            return (
              <button
                key={svc.id}
                type="button"
                disabled={isBooked}
                onClick={() => toggleService(svc, isPhoto)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition ${
                  isBooked
                    ? "border-red-200 bg-red-50/40 opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "border-[#7C3AED] bg-purple-50/50 ring-2 ring-[#7C3AED]/15"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-[#7C3AED]">
                  {isPhoto ? <Camera className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-xs font-bold text-[#172554] truncate">
                    {svc.name} {isBooked && <span className="text-red-600">(Booked)</span>}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ৳{Number(svc.basePrice).toLocaleString()} ({svc.pricingModel})
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                    isSelected ? "bg-[#7C3AED] border-[#7C3AED] text-white" : "border-slate-300"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition"
          >
            <span>Review & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

