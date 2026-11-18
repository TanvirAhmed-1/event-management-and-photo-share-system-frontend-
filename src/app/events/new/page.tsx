"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import { useGetAllServicesQuery } from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { useGetAllFoodItemsQuery, useGetAllFoodCategoriesQuery } from "@/redux/features/food/foodApi";
import { useCustomCreateEventMutation } from "@/redux/features/event/eventApi";
import { Sparkles, Check } from "lucide-react";
import toast from "react-hot-toast";

import { EventWizardState } from "@/components/ui/planner/types";
import EventCostSummary from "@/components/ui/planner/EventCostSummary";
import StepLocationEventType from "@/components/ui/planner/StepLocationEventType";
import StepCustomBuilder from "@/components/ui/planner/StepCustomBuilder";
import StepCheckoutConfirm from "@/components/ui/planner/StepCheckoutConfirm";

function EventPlannerContent() {
  const searchParams = useSearchParams();
  const { user, token } = useAppSelector((state) => state.auth);

  const { data: eventTypesRes } = useGetAllEventTypesQuery();
  const { data: servicesRes } = useGetAllServicesQuery();
  const { data: foodItemsRes } = useGetAllFoodItemsQuery();
  const { data: foodCatsRes } = useGetAllFoodCategoriesQuery();
  const [customCreateEvent, { isLoading: isSubmitting }] = useCustomCreateEventMutation();

  const eventTypes = (eventTypesRes?.data || []).filter((e: any) => e.isActive !== false);
  const services = servicesRes?.data || [];
  const foodItems = foodItemsRes?.data || [];
  const foodCategories = foodCatsRes?.data || [];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [confirmedInvoice, setConfirmedInvoice] = useState<any | null>(null);

  const [state, setState] = useState<EventWizardState>({
    city: searchParams.get("location") || "Dhaka",
    area: "",
    eventTypeId: searchParams.get("type") || "",
    eventTypeName: "",
    title: "",
    eventDate: searchParams.get("date") || "",
    eventTime: "Evening (6:00 PM - 11:00 PM)",
    venue: "",
    guestCount: Number(searchParams.get("guests")) || 100,
    selectedServices: [],
    selectedFoods: [],
    photographyTier: null,
    photographyHours: 4,
    customerName: user?.name || "",
    customerPhone: (user as any)?.phone || "",
    customerEmail: user?.email || "",
    paymentMethod: "BKASH",
    payAdvance: true,
    additionalRequirements: "",
  });

  // Pre-fill eventType from URL typeId or typeSlug
  useEffect(() => {
    if (eventTypes.length > 0 && !state.eventTypeId) {
      const slugParam = searchParams.get("typeSlug");
      const matched =
        eventTypes.find((e: any) => e.slug === slugParam) || eventTypes[0];
      if (matched) {
        setState((prev) => ({
          ...prev,
          eventTypeId: matched.id,
          eventTypeName: matched.name,
          title: `${matched.name} Celebration`,
        }));
      }
    } else if (eventTypes.length > 0 && state.eventTypeId && !state.eventTypeName) {
      const matched = eventTypes.find((e: any) => e.id === state.eventTypeId);
      if (matched) {
        setState((prev) => ({ ...prev, eventTypeName: matched.name }));
      }
    }
  }, [eventTypes, searchParams, state.eventTypeId, state.eventTypeName]);

  // Pre-fill user details when logged in
  useEffect(() => {
    if (user) {
      setState((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || "",
        customerEmail: prev.customerEmail || user.email || "",
        customerPhone: prev.customerPhone || (user as any)?.phone || "",
      }));
    }
  }, [user]);

  const handleApplyPreset = (preset: "wedding" | "birthday" | "corporate") => {
    const matchedType = eventTypes.find((e: any) => e.slug.includes(preset)) || eventTypes[0];
    const presetServices = services.slice(0, 3).map((s: any) => ({
      serviceId: s.id,
      name: s.name,
      basePrice: Number(s.basePrice),
      pricingModel: s.pricingModel,
      quantity: 1,
      isPhotography: s.name.toLowerCase().includes("photo"),
    }));
    const presetFoods = foodItems.slice(0, 2).map((f: any) => ({
      foodItemId: f.id,
      name: f.name,
      pricePerPerson: Number(f.pricePerPerson),
    }));

    setState((prev) => ({
      ...prev,
      eventTypeId: matchedType?.id || prev.eventTypeId,
      eventTypeName: matchedType?.name || prev.eventTypeName,
      title: `${preset.charAt(0).toUpperCase() + preset.slice(1)} Package`,
      selectedServices: presetServices,
      selectedFoods: presetFoods,
    }));
    toast.success(`Loaded ${preset} template! You can customize items in Step 2.`);
    setStep(2);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please sign in first to confirm your booking.");
      return;
    }

    try {
      const payload = {
        title: state.title || `${state.eventTypeName} — ${state.city}`,
        eventTypeId: state.eventTypeId,
        city: state.city,
        area: state.area,
        venue: state.venue,
        eventDate: state.eventDate,
        eventTime: state.eventTime,
        guestCount: state.guestCount,
        services: state.selectedServices.map((s) => ({
          serviceId: s.serviceId,
          quantity: s.quantity,
          hours: s.hours,
          includeAiAddon: !!s.includeAiAddon,
        })),
        foods: state.selectedFoods.map((f) => ({
          foodItemId: f.foodItemId,
        })),
        customerName: state.customerName,
        customerPhone: state.customerPhone,
        customerEmail: state.customerEmail,
        paymentMethod: state.paymentMethod,
        payAdvance: state.payAdvance,
        additionalRequirements: state.additionalRequirements,
      };

      const res = await customCreateEvent(payload).unwrap();
      if (res.success) {
        setConfirmedInvoice(res.data?.invoice);
        toast.success(`Booking Confirmed! ID: ${res.data?.bookingId}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to confirm booking. Check fields or date conflict.");
    }
  };

  const stepsList = [
    { num: 1, label: "Location & Category" },
    { num: 2, label: "Build Your Own Event" },
    { num: 3, label: "Checkout & Confirm" },
  ];

  return (
    <div className="w-full py-10 lg:py-14 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Stepper */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dynamic Event Customizer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Build Your Own Event
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {stepsList.map((st) => {
              const done = step > st.num || !!confirmedInvoice;
              const active = step === st.num && !confirmedInvoice;
              return (
                <button
                  key={st.num}
                  type="button"
                  disabled={!!confirmedInvoice || st.num > step}
                  onClick={() => setStep(st.num as 1 | 2 | 3)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    active
                      ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/20"
                      : done
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-white text-slate-400 border border-slate-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                    {done ? <Check className="w-3 h-3" /> : st.num}
                  </span>
                  <span className="hidden sm:inline">{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Layout: Wizard on Left (8 cols) + Sticky Summary on Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            {step === 1 && (
              <StepLocationEventType
                state={state}
                setState={setState}
                eventTypes={eventTypes}
                onNext={() => setStep(2)}
                onApplyPreset={handleApplyPreset}
              />
            )}

            {step === 2 && (
              <StepCustomBuilder
                state={state}
                setState={setState}
                services={services}
                foodItems={foodItems}
                foodCategories={foodCategories}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <StepCheckoutConfirm
                state={state}
                setState={setState}
                isLoggedIn={!!token}
                isSubmitting={isSubmitting}
                confirmedInvoice={confirmedInvoice}
                onBack={() => setStep(2)}
                onConfirm={handleConfirmBooking}
              />
            )}
          </div>

          <div className="lg:col-span-4">
            <EventCostSummary state={state} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewEventPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading Event Builder...</div>}>
      <EventPlannerContent />
    </Suspense>
  );
}

