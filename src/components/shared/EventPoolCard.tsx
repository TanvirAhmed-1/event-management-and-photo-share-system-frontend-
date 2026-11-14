"use client";

import Link from "next/link";
import {
  Camera,
  Copy,
  ExternalLink,
  Calendar,
  Trash2,
  MapPin,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

interface EventPoolCardProps {
  event: any;
  onDelete: (id: string, title: string) => void;
}

/**
 * Reusable card for displaying a host event pool with quick guest-link copy and gallery navigation.
 */
export default function EventPoolCard({ event, onDelete }: EventPoolCardProps) {
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/guest/${event.id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Guest scanner link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col justify-between bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden p-6 motion-preset-slide-up-sm motion-preset-fade motion-duration-400">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-[#172554] line-clamp-1">
            {event.title}
          </h3>
          <button
            onClick={() => onDelete(event.id, event.title)}
            className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition"
            title="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 space-y-1.5 text-xs text-slate-500">
          {event.eventDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{new Date(event.eventDate).toLocaleDateString()}</span>
            </div>
          )}
          {event.venue && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
          {event.guestCount && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>{event.guestCount} Guests</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#F5B942]" />
            <span className="font-semibold text-slate-700">
              {event._count?.photos ?? 0} photos uploaded
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
          title="Copy Guest Scanner Link"
        >
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          <span>Guest Link</span>
        </button>

        <Link
          href={`/dashboard/events/${event.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition shadow-xs"
        >
          <span>Manage Gallery</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
