"use client";

import React from "react";
import { EventWizardState } from "./types";
import { Calendar, MapPin, Users, Utensils, Camera, Wrench, Receipt } from "lucide-react";

interface EventCostSummaryProps {
  state: EventWizardState;
}

export function calculateCosts(state: EventWizardState) {
  const guestCount = Math.max(1, state.guestCount || 1);

  const foodCost = state.selectedFoods.reduce(
    (sum, f) => sum + f.pricePerPerson * guestCount,
    0
  );

  let photographyCost = 0;
  let addonsCost = 0;

  state.selectedServices.forEach((s) => {
    let line = s.basePrice * s.quantity;
    if (s.pricingModel === "PER_PERSON") line = s.basePrice * guestCount * s.quantity;
    else if (s.pricingModel === "PER_HOUR") line = s.basePrice * (s.hours || state.photographyHours || 4) * s.quantity;

    if (s.isPhotography || s.name.toLowerCase().includes("photo") || s.name.toLowerCase().includes("video")) {
      photographyCost += line;
    } else {
      addonsCost += line;
    }
  });

  const subtotal = foodCost + photographyCost + addonsCost;
  const vat = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + vat;
  const advanceAmount = state.payAdvance ? Math.round(grandTotal * 0.2) : 0;

  return { foodCost, photographyCost, addonsCost, subtotal, vat, grandTotal, advanceAmount };
}

export default function EventCostSummary({ state }: EventCostSummaryProps) {
  const { foodCost, photographyCost, addonsCost, subtotal, vat, grandTotal, advanceAmount } =
    calculateCosts(state);

  return (
    <aside className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-lg sticky top-24 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#172554]">Live Cost Summary</h3>
            <p className="text-[11px] text-slate-400">Real-time estimate</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
          {state.eventTypeName || "Custom Event"}
        </span>
      </div>

      {/* Quick Metadata */}
      <div className="space-y-2 text-xs text-slate-600 bg-slate-50 rounded-2xl p-3.5">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
          <span className="truncate font-medium">
            {state.area ? `${state.area}, ${state.city}` : state.city || "Select Location"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
          <span className="font-medium">
            {state.eventDate || "Date not selected"} {state.eventTime ? `• ${state.eventTime}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
          <span className="font-bold text-[#172554]">{state.guestCount} Guests</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Utensils className="w-3.5 h-3.5 text-emerald-500" />
            Food & Catering ({state.selectedFoods.length})
          </span>
          <span className="font-bold text-[#172554]">৳{foodCost.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Camera className="w-3.5 h-3.5 text-[#7C3AED]" />
            Photography & Media
          </span>
          <span className="font-bold text-[#172554]">৳{photographyCost.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
            Add-on Services ({state.selectedServices.length})
          </span>
          <span className="font-bold text-[#172554]">৳{addonsCost.toLocaleString()}</span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-500">
          <span>Subtotal</span>
          <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-slate-500">
          <span>VAT (5%)</span>
          <span className="font-semibold">৳{vat.toLocaleString()}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Estimated
          </span>
          <span className="text-2xl font-extrabold text-[#7C3AED]">
            ৳{grandTotal.toLocaleString()}
          </span>
        </div>
        {state.payAdvance && grandTotal > 0 && (
          <div className="mt-2 flex items-center justify-between text-[11px] bg-purple-50 text-[#7C3AED] px-3 py-1.5 rounded-xl font-bold">
            <span>20% Advance Deposit</span>
            <span>৳{advanceAmount.toLocaleString()}</span>
          </div>
        )}
      </div>
    </aside>
  );
}

