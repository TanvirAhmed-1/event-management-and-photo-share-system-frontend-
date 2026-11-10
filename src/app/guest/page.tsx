"use client";

import React, { useState } from "react";
import { useGetAllEventsQuery } from "@/redux/features/event/eventApi";
import { Camera, Sparkles, ArrowRight, Search, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function GuestPortalPage() {
  const router = useRouter();
  const { data: eventsRes, isLoading } = useGetAllEventsQuery(undefined);
  const [eventCode, setEventCode] = useState("");

  const events = eventsRes?.data || [];

  const handleGoToEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode.trim()) {
      toast.error("Please enter an Event ID or Code");
      return;
    }
    router.push(`/guest/${eventCode.trim()}`);
  };

  return (
    <div className="w-full py-12 lg:py-20 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Facial Recognition Photo Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            Find Your Event Photos Instantly
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Upload or snap a quick selfie. Our AI scans thousands of event photos and instantly shows every picture you appear in!
          </p>

          {/* Enter Event Code Form */}
          <form onSubmit={handleGoToEvent} className="mt-8 flex items-center max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/10">
            <input
              type="text"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
              placeholder="Enter Event ID or Event Code..."
              className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shrink-0 transition shadow-xs flex items-center gap-1.5"
            >
              <span>Scan Face</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Available Live Event Pools */}
        <div>
          <h2 className="text-lg font-bold text-[#172554] mb-4 text-center sm:text-left">
            Active Event Galleries Available for Search
          </h2>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading active event galleries...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 text-xs text-slate-500">
              No active events yet. As soon as an organizer creates an event pool, it will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {events.map((ev: any) => (
                <Link
                  key={ev.id}
                  href={`/guest/${ev.id}`}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] text-[10px] font-bold">
                        {ev._count?.photos ?? 0} photos
                      </span>
                      <Camera className="w-4 h-4 text-slate-400 group-hover:text-[#7C3AED] transition-colors" />
                    </div>

                    <h3 className="text-sm font-bold text-[#172554] group-hover:text-[#7C3AED] transition-colors mt-3 line-clamp-1">
                      {ev.title}
                    </h3>

                    <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                      {ev.eventDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#7C3AED]" />
                          <span>{new Date(ev.eventDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {ev.venue && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#7C3AED]" />
                          <span className="truncate">{ev.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#7C3AED]">
                    <span>Search My Photos</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

