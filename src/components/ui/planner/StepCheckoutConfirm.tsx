"use client";

import React from "react";
import {
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Printer,
  ExternalLink,
  Lock,
} from "lucide-react";
import { EventWizardState } from "./types";
import { calculateCosts } from "./EventCostSummary";
import Link from "next/link";

interface StepCheckoutConfirmProps {
  state: EventWizardState;
  setState: React.Dispatch<React.SetStateAction<EventWizardState>>;
  isLoggedIn: boolean;
  isSubmitting: boolean;
  confirmedInvoice: any | null;
  onBack: () => void;
  onConfirm: (e: React.FormEvent) => void;
}

export default function StepCheckoutConfirm({
  state,
  setState,
  isLoggedIn,
  isSubmitting,
  confirmedInvoice,
  onBack,
  onConfirm,
}: StepCheckoutConfirmProps) {
  const { grandTotal, advanceAmount } = calculateCosts(state);

  // If booking is confirmed, show Invoice & Unique Booking ID
  if (confirmedInvoice) {
    return (
      <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-xl space-y-6">
        <div className="text-center space-y-3 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="inline-block px-3.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-extrabold border border-purple-200">
            Booking ID: {confirmedInvoice.bookingId}
          </div>
          <h2 className="text-2xl font-extrabold text-[#172554]">
            Event Booking Confirmed!
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your custom event has been saved to our system. Present your Booking ID for support or manage your AI photo gallery from your dashboard.
          </p>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 rounded-2xl p-5">
          <div>
            <span className="text-slate-400 font-semibold block">Event Title</span>
            <span className="font-bold text-[#172554]">{confirmedInvoice.eventTitle}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Date & Time</span>
            <span className="font-bold text-[#172554]">
              {new Date(confirmedInvoice.eventDate).toLocaleDateString()} • {confirmedInvoice.eventTime}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Venue</span>
            <span className="font-bold text-[#172554]">{confirmedInvoice.venue}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block">Guest Count</span>
            <span className="font-bold text-[#172554]">{confirmedInvoice.guestCount} Guests</span>
          </div>
        </div>

        <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
          <div className="flex justify-between text-slate-600">
            <span>Services & Photography</span>
            <span className="font-bold">৳{Number(confirmedInvoice.servicesTotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Food & Catering</span>
            <span className="font-bold">৳{Number(confirmedInvoice.foodTotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>VAT (5%)</span>
            <span className="font-bold">৳{Number(confirmedInvoice.vat).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-[#172554] pt-2 border-t border-slate-100">
            <span>Total Confirmed</span>
            <span>৳{Number(confirmedInvoice.grandTotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-emerald-600">
            <span>Advance Paid ({confirmedInvoice.paymentMethod})</span>
            <span>৳{Number(confirmedInvoice.advancePaid).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-amber-700">
            <span>Balance Due on Event</span>
            <span>৳{Number(confirmedInvoice.dueAmount).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20"
          >
            <span>Go to My Dashboard</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onConfirm}
      className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div>
        <h2 className="text-lg font-extrabold text-[#172554] flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#7C3AED]" />
          Checkout & Booking Confirmation
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide your contact details and choose a payment method to lock your date.
        </p>
      </div>

      {!isLoggedIn && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Please sign in to save this booking to your account. Your selections are preserved!</span>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-[#172554] text-white text-xs font-bold whitespace-nowrap text-center"
          >
            Sign In Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={state.customerName}
            onChange={(e) => setState((p) => ({ ...p, customerName: e.target.value }))}
            placeholder="Tanvir Ahmed"
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            value={state.customerPhone}
            onChange={(e) => setState((p) => ({ ...p, customerPhone: e.target.value }))}
            placeholder="017XXXXXXXX"
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
        <input
          type="email"
          value={state.customerEmail}
          onChange={(e) => setState((p) => ({ ...p, customerEmail: e.target.value }))}
          placeholder="you@example.com"
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Additional Notes / Special Requests</label>
        <textarea
          rows={2}
          value={state.additionalRequirements}
          onChange={(e) => setState((p) => ({ ...p, additionalRequirements: e.target.value }))}
          placeholder="Stage color theme, dietary notes, or arrival instructions..."
          className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
        />
      </div>

      {/* Payment Option */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-bold text-[#172554]">Payment Gateway / Option</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "BKASH", label: "bKash Payment", desc: "Instant mobile wallet" },
            { id: "SSLCOMMERZ", label: "SSLCommerz", desc: "Cards, Nagad, Rocket" },
            { id: "CASH", label: "Confirm & Pay Later", desc: "Pay at venue/office" },
          ].map((pm) => {
            const active = state.paymentMethod === pm.id;
            return (
              <button
                key={pm.id}
                type="button"
                onClick={() =>
                  setState((p) => ({
                    ...p,
                    paymentMethod: pm.id as any,
                    payAdvance: pm.id !== "CASH",
                  }))
                }
                className={`p-3.5 rounded-2xl border text-left transition ${
                  active
                    ? "border-[#7C3AED] bg-purple-50/60 ring-2 ring-[#7C3AED]/15"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-[#172554]">{pm.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{pm.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !isLoggedIn}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4 text-[#F5B942]" />
          <span>
            {isSubmitting
              ? "Confirming Booking..."
              : state.payAdvance
              ? `Pay ৳${advanceAmount.toLocaleString()} & Confirm`
              : `Confirm Booking (৳${grandTotal.toLocaleString()})`}
          </span>
        </button>
      </div>
    </form>
  );
}

