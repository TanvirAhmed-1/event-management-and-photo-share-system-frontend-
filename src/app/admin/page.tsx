"use client";

import { useGetAllEventsQuery, useDeleteEventMutation, useToggleEventActiveAdminMutation } from "@/redux/features/event/eventApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useGetAllUsersAdminQuery, useToggleUserActiveAdminMutation, useUpdateUserPackageAdminMutation } from "@/redux/features/user/userApi";
import { useState } from "react";
import { Settings, ShieldAlert, HardDrive, Users, Calendar, Trash2, CheckCircle, RefreshCw, Cpu, Layers, Sparkles, Heart, Search, Lock, Unlock, AlertTriangle } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Container from "@/components/shared/Container";
import ReviewModal from "../dashboard/ReviewModal";

export default function AdminDashboard() {
  const { data: eventsResponse, isLoading: eventsLoading, refetch: refetchEvents } = useGetAllEventsQuery(undefined);
  const { data: usersResponse, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsersAdminQuery(undefined);
  const { data: packagesResponse, isLoading: packagesLoading } = useGetAllPackagesQuery(undefined);

  const [toggleUserActive, { isLoading: userToggling }] = useToggleUserActiveAdminMutation();
  const [toggleEventActive, { isLoading: eventToggling }] = useToggleEventActiveAdminMutation();
  const [updateUserPackage, { isLoading: packageUpdating }] = useUpdateUserPackageAdminMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");

  const events = eventsResponse?.data || [];
  const packages = packagesResponse?.data || [];
  const organizers = usersResponse?.data || [];

  const handleUpdateUserStorage = async (orgId: string, pkgId: string) => {
    try {
      await updateUserPackage({ id: orgId, packageId: pkgId }).unwrap();
      toast.success(`Successfully updated storage plan limit for organizer!`);
      refetchUsers();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to modify user storage limit.");
    }
  };

  const handleToggleUserActive = async (userId: string, name: string) => {
    try {
      const res = await toggleUserActive(userId).unwrap();
      toast.success(`${name}'s account status has been updated to ${res.data.isActive ? "ACTIVE" : "INACTIVE"}!`);
      refetchUsers();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update user status.");
    }
  };

  const handleToggleEventActive = async (eventId: string, title: string) => {
    try {
      const res = await toggleEventActive(eventId).unwrap();
      toast.success(`Wedding "${title}" has been set to ${res.data.isActive ? "ACTIVE" : "INACTIVE"}!`);
      refetchEvents();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to toggle wedding active status.");
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

  // Filters
  const filteredOrganizers = organizers.filter((org: any) => {
    const term = userSearch.toLowerCase();
    return (
      org.name.toLowerCase().includes(term) ||
      org.email.toLowerCase().includes(term) ||
      org.phone.toLowerCase().includes(term)
    );
  });

  const filteredEvents = events.filter((e: any) => {
    const term = eventSearch.toLowerCase();
    return (
      e.title.toLowerCase().includes(term) ||
      (e.user?.name || "").toLowerCase().includes(term) ||
      (e.user?.email || "").toLowerCase().includes(term)
    );
  });

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

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              refetchEvents();
              refetchUsers();
              toast.success("Refetched global system status!");
            }}
            className="self-start inline-flex items-center gap-1.5 px-4 py-2 text-[10px] rounded-full border border-white/5 hover:border-[#d4af37]/35 text-gray-400 hover:text-white bg-white/5 transition-all font-semibold uppercase tracking-wider active:scale-95 animate-pulse"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Synchronize Status
          </button>
          
          <button
            onClick={() => setReviewModalOpen(true)}
            className="self-start inline-flex items-center gap-1.5 px-4 py-2 text-[10px] rounded-full border border-white/5 hover:border-pink-500/35 text-gray-400 hover:text-white bg-pink-950/10 transition-all font-semibold uppercase tracking-wider active:scale-95 shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" /> Add Couple Review
          </button>
        </div>
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

      {/* User Storage & Status Override Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Organizer Storage Allocation Grid */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#b76e79]" /> Client Management & Status
            </h2>

            {/* User Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search registered clients..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0c0c10]/80 border border-white/5 hover:border-white/10 focus:border-[#d4af37]/35 focus:outline-none rounded-xl text-xs text-white placeholder-gray-500 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {usersLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
              </div>
            ) : filteredOrganizers.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-20 bg-[#0c0c10]/40 rounded-2xl border border-white/5">
                No clients found in the system matching search query.
              </div>
            ) : (
              filteredOrganizers.map((org: any) => {
                const storageLimit = org.package?.storageLimitMB || 0;
                const storageUsed = org.usedStorageMB || 0;
                const pctUsed = storageLimit > 0 ? Math.min(100, (storageUsed / storageLimit) * 100) : 0;

                return (
                  <GlassCard 
                    key={org.id} 
                    className={`p-6 border ${org.role === "SUPER_ADMIN" ? "border-purple-500/20 bg-purple-950/5" : "border-white/5 bg-[#0c0c10]/40"} flex flex-col gap-6`} 
                    hoverEffect={false}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Client Info */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-black text-white font-heading">{org.name}</h4>
                          {org.role === "SUPER_ADMIN" ? (
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold uppercase tracking-wider">Super Admin</span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              org.isActive 
                                ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                                : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                            }`}>
                              {org.isActive ? "ACTIVE PLAN" : "LOCKED / INACTIVE"}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">
                          Email: <span className="text-gray-200">{org.email}</span> | Phone: <span className="text-gray-200">{org.phone}</span>
                        </p>
                        <p className="text-[9px] text-gray-500 font-mono">
                          Registered: {new Date(org.createdAt).toLocaleDateString()} | Events: {org._count?.events || 0}
                        </p>
                      </div>

                      {/* Right: Active Status Toggle Switch (Not applicable to Super Admin itself) */}
                      {org.role !== "SUPER_ADMIN" && (
                        <div className="shrink-0 flex items-center gap-2">
                          <button
                            onClick={() => handleToggleUserActive(org.id, org.name)}
                            disabled={userToggling}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                              org.isActive 
                                ? "bg-green-950/40 border border-green-500/30 text-green-400 hover:bg-green-950" 
                                : "bg-amber-950/40 border border-amber-500/30 text-amber-400 hover:bg-amber-950"
                            }`}
                          >
                            {org.isActive ? (
                              <>
                                <Unlock className="w-3 h-3 text-green-400" />
                                Active (Click to Lock)
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-amber-400 animate-pulse" />
                                Locked (Click to Active)
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar & package select */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-white/5">
                      <div className="flex-grow max-w-md space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400">
                          <span>SaaS Storage Usage</span>
                          <span>{storageUsed.toFixed(1)} MB / {storageLimit >= 1000 ? `${(storageLimit / 1000).toFixed(0)} GB` : `${storageLimit} MB`} ({pctUsed.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${pctUsed > 80 ? "bg-red-500" : "bg-gold-gradient"
                              }`}
                            style={{ width: `${pctUsed}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Select package override */}
                      {org.role !== "SUPER_ADMIN" && (
                        <div className="shrink-0 flex flex-col gap-1 min-w-[150px]">
                          <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold">Override SaaS Subscription</span>
                          <select
                            className="w-full px-2 py-1.5 bg-[#0a0a0d] border border-white/5 rounded-lg text-[10px] text-[#d4af37] font-semibold focus:outline-none"
                            value={org.packageId || ""}
                            onChange={(e) => handleUpdateUserStorage(org.id, e.target.value)}
                            disabled={packageUpdating}
                          >
                            <option value="">No Active Plan</option>
                            {packages.map((pkg: any) => (
                              <option key={pkg.id} value={pkg.id}>
                                {pkg.name} ({pkg.storageLimitMB >= 1000 ? `${(pkg.storageLimitMB / 1000).toFixed(0)} GB` : `${pkg.storageLimitMB} MB`})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>
        </div>

        {/* Global Wedding Catalog Overviews */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#b76e79]" /> Global Catalogs
            </h2>
          </div>

          {/* Catalog Search */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalogs, hosts, email..."
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0c0c10]/80 border border-white/5 hover:border-white/10 focus:border-[#d4af37]/35 focus:outline-none rounded-xl text-xs text-white placeholder-gray-500 transition-all font-semibold"
            />
          </div>

          <div className="flex flex-col gap-4">
            {eventsLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-6 h-6 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-10 bg-[#0c0c10]/40 rounded-2xl border border-white/5">
                No active wedding pools found matching search.
              </div>
            ) : (
              filteredEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl bg-[#0c0c10]/60 border border-white/5 flex flex-col gap-3 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="truncate">
                      <h4 className="text-xs font-black text-white font-heading truncate">{event.title}</h4>
                      <span className="text-[9px] text-[#d4af37] font-semibold mt-0.5 block">{event._count?.photos ?? 0} photos mapped</span>
                      {event.user && (
                        <p className="text-[8px] text-gray-500 font-mono mt-0.5">
                          Host: {event.user.name} ({event.user.email})
                        </p>
                      )}
                    </div>

                    {/* Active Status Badge & Force Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleEventActive(event.id, event.title)}
                        disabled={eventToggling}
                        className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                          event.isActive 
                            ? "bg-green-950/40 border border-green-500/20 text-green-400 hover:bg-green-900/50" 
                            : "bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-900/50 animate-pulse"
                        }`}
                        title={event.isActive ? "Click to Deactivate Event" : "Click to Activate Event"}
                      >
                        {event.isActive ? "Active" : "Deactivated"}
                      </button>

                      <button
                        onClick={() => handleDeleteWeddingGlobal(event.id, event.title)}
                        className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/20 text-[#b76e79] hover:text-white hover:bg-red-700 transition-all hover:scale-105"
                        title="Force Delete Wedding Pool"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      
      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />

    </Container>
  );
}
