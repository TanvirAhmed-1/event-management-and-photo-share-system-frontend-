"use client";

import React, { useState, useEffect } from "react";
import {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} from "@/redux/features/settings/settingsApi";
import {
  Settings,
  CalendarCheck,
  AlertTriangle,
  ShieldCheck,
  Save,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { data: settingsRes, isLoading } = useGetPlatformSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdatePlatformSettingsMutation();

  const [maxEventsPerDay, setMaxEventsPerDay] = useState<number>(1);
  const [allowSameDateRequests, setAllowSameDateRequests] = useState<boolean>(true);
  const [warnAdminOnSameDate, setWarnAdminOnSameDate] = useState<boolean>(true);

  useEffect(() => {
    if (settingsRes?.data) {
      setMaxEventsPerDay(settingsRes.data.maxEventsPerDay);
      setAllowSameDateRequests(settingsRes.data.allowSameDateRequests);
      setWarnAdminOnSameDate(settingsRes.data.warnAdminOnSameDate);
    }
  }, [settingsRes]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        maxEventsPerDay: Number(maxEventsPerDay),
        allowSameDateRequests,
        warnAdminOnSameDate,
      }).unwrap();
      toast.success("Organizer capacity & date settings saved!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save settings");
    }
  };

  return (
    <div className="max-w-[920px] mx-auto space-y-6 motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-[11px] font-bold border border-purple-200 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>System &amp; Capacity Mode</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
          Event Date &amp; Organizer Capacity Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure how many events can be accepted per day, whether users can request busy dates, and same-date admin conflict alerts.
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 space-y-6 motion-preset-fade motion-loop-pulse">
          <div className="w-1/3 h-6 rounded bg-slate-200 animate-pulse" />
          <div className="w-full h-24 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="w-full h-24 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: Daily Event Limit */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 text-[#7C3AED] flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-extrabold text-[#172554]">
                  Maximum Events Accepted Per Day
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Set the standard daily capacity for your organizer team. When confirmed bookings reach this limit on a single date, conflict protection triggers automatically.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={maxEventsPerDay}
                    onChange={(e) => setMaxEventsPerDay(Math.max(1, Number(e.target.value)))}
                    className="w-24 text-center text-base font-extrabold h-11"
                  />

                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 5, 10].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setMaxEventsPerDay(preset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          maxEventsPerDay === preset
                            ? "bg-[#7C3AED] text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {preset} / day
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Same-Date Request Policy */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#172554]">
                    Allow Same-Date Event Requests
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                    When enabled, hosts can still submit booking requests on dates that already reached the daily limit (with an amber warning). Admin can then inspect the request and grant multiple-event access. When disabled, full dates are strictly blocked on the calendar.
                  </p>
                </div>
              </div>

              <Switch
                checked={allowSameDateRequests}
                onCheckedChange={setAllowSameDateRequests}
              />
            </div>
          </div>

          {/* Card 3: Admin Conflict Warnings */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#172554]">
                    Admin Same-Date Conflict Warnings
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                    Display live conflict alert banners and row badges in the Events Management console whenever multiple requests fall on the same date.
                  </p>
                </div>
              </div>

              <Switch
                checked={warnAdminOnSameDate}
                onCheckedChange={setWarnAdminOnSameDate}
              />
            </div>
          </div>

          {/* Active Policy Summary & Save Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 text-white shadow-lg">
            <div className="flex items-center gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-[#F5B942] shrink-0" />
              <span>
                Active Policy: <strong>{maxEventsPerDay} event(s)/day</strong> •{" "}
                {allowSameDateRequests
                  ? "Same-date requests queued for Admin review"
                  : "Same-date requests strictly blocked"}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-extrabold shadow-md shadow-[#7C3AED]/30 transition disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Capacity Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
