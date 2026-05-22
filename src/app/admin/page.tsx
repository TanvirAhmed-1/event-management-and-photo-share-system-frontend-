"use client";

import { useGetAllEventsQuery, useDeleteEventMutation } from "@/redux/features/event/eventApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useSelectPackageMutation } from "@/redux/features/user/userApi";
import { useState } from "react";
import { Settings, ShieldAlert, HardDrive, Users, Calendar, Trash2, CheckCircle, RefreshCw, Cpu, Layers, Sparkles } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Container from "@/components/shared/Container";

export default function AdminDashboard() {
  const { data: eventsResponse, isLoading: eventsLoading, refetch: refetchEvents } = useGetAllEventsQuery(undefined);
  const { data: packagesResponse, isLoading: packagesLoading } = useGetAllPackagesQuery(undefined);
  const [selectPackage, { isLoading: packageUpdating }] = useSelectPackageMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const events = eventsResponse?.data || [];
  const packages = packagesResponse?.data || [];

  // Mock registered organizers database
  const [organizers, setOrganizers] = useState([
    { id: "org-1", name: "Sarah & David (Hosts)", email: "david.wedding@gmail.com", activePlan: "Gold Event Plan", storageLimitMB: 2000, storageUsedMB: 840 },
    { id: "org-2", name: "Liam & Sophia (Planners)", email: "liam.nuptials@planners.com", activePlan: "Free Trial", storageLimitMB: 50, storageUsedMB: 48 },
    { id: "org-3", name: "Elena & Marcus (Couples)", email: "elena.marcus@gmail.com", activePlan: "Elite Lifetime Plan", storageLimitMB: 20000, storageUsedMB: 1240 },
  ]);

  const handleUpdateUserStorage = async (orgId: string, pkgId: string, pkgName: string, pkgLimit: number) => {
    try {
      // Simulate backend user storage update, or call the base selectPackage API if needed
      setOrganizers((prev) =>
        prev.map((org) =>
          org.id === orgId
            ? { ...org, activePlan: pkgName, storageLimitMB: pkgLimit }
            : org
        )
      );

      toast.success(`Successfully updated storage plan limit for organizer!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to modify user storage limit.");
    }
  };

  const handleDeleteWeddingGlobal = async (eventId: string, name: string) => {
    const confirmResult = await Swal.fire({
      title: "Force Delete Wedding Pool?",
      text: `Are you sure you want to FORCE delete "${name}" from the system? This action bypasses couple controls, destroys the Cloudinary assets, and deletes the embeddings.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b76e79",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Force Delete",
      background: "#131315",
      color: "#f4f4f7",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteEvent(eventId).unwrap();
        toast.success("Wedding event pool force-deleted successfully!");
        refetchEvents();
      } catch (err: any) {
        console.error(err);
        toast.error(err?.data?.message || "Failed to force-delete wedding event.");
      }
    }
  };

  const totalGlobalPhotos = events.reduce((acc: number, e: any) => acc + (e._count?.photos || 0), 0);

  return (
    <Container className="py-10 flex flex-col gap-10 animate-in fade-in duration-300">

      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#b76e79] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Super Admin Control Room
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white mt-1">
            Global <span className="text-rose-gradient font-black">Metrics & Controls</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Oversee wedding pools, manage client storage caps, and override SaaS tiers</p>
        </div>

        <button
          onClick={() => {
            refetchEvents();
            toast.success("Refetched global system status!");
          }}
          className="self-start inline-flex items-center gap-1.5 px-4 py-2 text-[10px] rounded-full border border-white/5 hover:border-[#d4af37]/35 text-gray-400 hover:text-white bg-white/5 transition-all font-semibold uppercase tracking-wider active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Synchronize Status
        </button>
      </div>

      {/* Global Benchmarks Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border border-white/5" hoverEffect={true}>
          <Layers className="w-5 h-5 text-[#d4af37] mb-2" />
          <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{events.length}</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Active Wedding Pools</span>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border border-white/5" hoverEffect={true}>
          <Users className="w-5 h-5 text-purple-400 mb-2" />
          <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{organizers.length}</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Registered Clients</span>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border border-white/5" hoverEffect={true}>
          <HardDrive className="w-5 h-5 text-rose-400 mb-2" />
          <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{totalGlobalPhotos}</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Global Photo Assets</span>
        </GlassCard>

        <GlassCard className="flex flex-col items-center justify-center p-6 text-center border border-white/5" hoverEffect={true}>
          <Cpu className="w-5 h-5 text-green-400 mb-2" />
          <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">99.4%</span>
          <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Face Recognition Acc.</span>
        </GlassCard>
      </div>

      {/* User Storage Override Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Organizer Storage Allocation Grid */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#b76e79]" /> Client Storage Limits Control
          </h2>

          <div className="flex flex-col gap-4">
            {organizers.map((org) => {
              const pctUsed = Math.min(100, (org.storageUsedMB / org.storageLimitMB) * 100);
              return (
                <GlassCard key={org.id} className="p-6 border border-white/5 bg-[#0c0c10]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-6" hoverEffect={false}>
                  <div className="space-y-3 flex-grow max-w-md">
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">{org.name}</h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{org.email}</p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400">
                        <span>Used Storage Bar</span>
                        <span>{org.storageUsedMB} MB / {org.storageLimitMB >= 1000 ? `${(org.storageLimitMB / 1000).toFixed(0)} GB` : `${org.storageLimitMB} MB`} ({pctUsed.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${pctUsed > 80 ? "bg-red-500" : "bg-gold-gradient"
                            }`}
                          style={{ width: `${pctUsed}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions to alter plan */}
                  <div className="shrink-0 flex flex-col gap-2 min-w-[140px]">
                    <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Override SaaS Tier</span>
                    <select
                      className="w-full px-2 py-1.5 bg-[#0a0a0d] border border-white/5 rounded-lg text-[10px] text-[#d4af37] font-semibold focus:outline-none"
                      value={packages.find((p: any) => p.name === org.activePlan)?.id || ""}
                      onChange={(e) => {
                        const targetPkg = packages.find((p: any) => p.id === e.target.value);
                        if (targetPkg) {
                          handleUpdateUserStorage(org.id, targetPkg.id, targetPkg.name, targetPkg.storageLimitMB);
                        }
                      }}
                    >
                      <option value="">{org.activePlan}</option>
                      {packages.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} ({pkg.storageLimitMB >= 1000 ? `${(pkg.storageLimitMB / 1000).toFixed(0)} GB` : `${pkg.storageLimitMB} MB`})
                        </option>
                      ))}
                    </select>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Global Wedding Catalog Overviews */}
        <div className="flex flex-col gap-6">
          <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#b76e79]" /> Global Catalogs
          </h2>

          <div className="flex flex-col gap-4">
            {eventsLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-6 h-6 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-10 bg-[#0c0c10]/40 rounded-2xl border border-white/5">No active wedding pools.</div>
            ) : (
              events.map((event: any) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl bg-[#0c0c10]/60 border border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-white font-heading truncate">{event.title}</h4>
                    <span className="text-[9px] text-[#d4af37] font-semibold mt-0.5 block">{event._count?.photos ?? 0} photos mapped</span>
                  </div>

                  <button
                    onClick={() => handleDeleteWeddingGlobal(event.id, event.title)}
                    className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/20 text-[#b76e79] hover:text-white hover:bg-red-700 transition-all hover:scale-105"
                    title="Force Delete Wedding Pool"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </Container>
  );
}
