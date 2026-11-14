"use client";

import { useState } from "react";
import {
  useGetUserDashboardQuery,
  useSelectPackageMutation,
} from "@/redux/features/user/userApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { updateUserPackage } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import {
  HardDrive,
  Database,
  Check,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Host dashboard child route displaying active cloud storage quota and selectable subscription plans.
 */
export default function DashboardStoragePage() {
  const dispatch = useAppDispatch();
  const { data: dashboardRes, refetch: refetchDashboard } =
    useGetUserDashboardQuery(undefined);
  const { data: packagesRes, isLoading: packagesLoading } =
    useGetAllPackagesQuery(undefined);
  const [selectPackage] = useSelectPackageMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const dashboardData = dashboardRes?.data || {
    packageInfo: { id: "", name: "Free Plan", storageLimitMB: 50, price: 0 },
    stats: {
      storageLimitMB: 50,
      storageUsedMB: 0,
      remainingStorageMB: 50,
    },
  };

  const packages = packagesRes?.data || [];
  const activePackageId = dashboardData.packageInfo?.id;
  const usedMB = Number(dashboardData.stats?.storageUsedMB || 0);
  const limitMB = Number(dashboardData.stats?.storageLimitMB || 50);
  const remainingMB = Math.max(0, limitMB - usedMB);
  const percentUsed = Math.min(100, Math.round((usedMB / (limitMB || 1)) * 100));

  const formatCapacity = (mb: number) =>
    mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;

  const handleSelectPlan = async (pkg: any) => {
    setUpdatingId(pkg.id);
    try {
      await selectPackage({ packageId: pkg.id }).unwrap();
      dispatch(updateUserPackage(pkg.id));
      toast.success(`Switched to ${pkg.name} plan!`);
      refetchDashboard();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update storage plan.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200 mb-2">
          <HardDrive className="w-3.5 h-3.5" />
          <span>Cloud Quota &amp; Billing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
          Storage &amp; Plans
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your high-resolution photo vault capacity and upgrade anytime as your events grow.
        </p>
      </div>

      {/* Current Usage Banner */}
      <div className="bg-gradient-to-br from-[#172554] via-[#1E1B4B] to-[#3B0764] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              Active Plan: {dashboardData.packageInfo?.name || "Starter Free"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              {formatCapacity(usedMB)}{" "}
              <span className="text-base font-normal text-purple-200">
                of {formatCapacity(limitMB)} used ({percentUsed}%)
              </span>
            </h2>
            <p className="text-xs text-purple-200/90 max-w-xl">
              {formatCapacity(remainingMB)} remaining for upcoming uploads and AI face embedding indexes.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-purple-100">Quota Health</span>
              <span className="text-amber-300">{percentUsed}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A78BFA] to-[#F5B942] transition-all duration-500"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-purple-200 mt-2">
              <span>{usedMB.toFixed(1)} MB used</span>
              <span>{limitMB} MB max</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-extrabold text-[#172554]">
            Available Storage Tiers
          </h3>
          <p className="text-xs text-slate-500">
            Instant activation across all existing and upcoming event galleries.
          </p>
        </div>

        {packagesLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading storage packages...
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-xs text-slate-500">
            No storage packages configured yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {packages.map((pkg: any) => {
              const isCurrent = activePackageId === pkg.id;
              const isUpdating = updatingId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className={`flex flex-col justify-between bg-white rounded-3xl border p-6 transition-all ${
                    isCurrent
                      ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/15 shadow-lg"
                      : "border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center border border-purple-100">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-[#172554]">
                            {pkg.name}
                          </h4>
                          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#7C3AED]" />
                            {pkg.durationDays || 30} days validity
                          </div>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <Check className="w-3 h-3" />
                          Current
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#172554]">
                        ৳{Number(pkg.price || 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        / {pkg.durationDays || 30}d
                      </span>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-[#172554]">
                      <HardDrive className="w-3.5 h-3.5 text-[#7C3AED]" />
                      {formatCapacity(pkg.storageLimitMB)} Cloud Storage
                    </div>

                    {pkg.description && (
                      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                        {pkg.description}
                      </p>
                    )}

                    <ul className="mt-4 space-y-2 text-xs text-slate-600">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>AI facial indexing included</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Unlimited guest selfie searches</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(pkg)}
                    disabled={isCurrent || isUpdating}
                    className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition ${
                      isCurrent
                        ? "bg-slate-100 text-slate-500 cursor-default"
                        : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm shadow-[#7C3AED]/20"
                    }`}
                  >
                    {isCurrent
                      ? "Active Plan"
                      : isUpdating
                      ? "Switching Plan..."
                      : "Select This Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
