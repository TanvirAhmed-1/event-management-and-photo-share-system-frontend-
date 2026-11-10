"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { useGetAllEventsQuery } from "@/redux/features/event/eventApi";
import { useGetAllUsersAdminQuery } from "@/redux/features/user/userApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useGetAllServicesQuery } from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { useGetAllFoodItemsQuery } from "@/redux/features/food/foodApi";
import { ShieldCheck, Layers, Wrench, Utensils, Database, Users, Calendar } from "lucide-react";
import Link from "next/link";

import AdminStats from "@/components/ui/admin/AdminStats";
import AdminEventTypes from "@/components/ui/admin/AdminEventTypes";
import AdminServices from "@/components/ui/admin/AdminServices";
import AdminFoodCatalog from "@/components/ui/admin/AdminFoodCatalog";
import AdminPackages from "@/components/ui/admin/AdminPackages";
import AdminUsers from "@/components/ui/admin/AdminUsers";
import AdminEvents from "@/components/ui/admin/AdminEvents";

export default function AdminDashboardPage() {
  const { user, token } = useAppSelector((state) => state.auth);

  const { data: eventsRes } = useGetAllEventsQuery(undefined);
  const { data: usersRes } = useGetAllUsersAdminQuery(undefined);
  const { data: packagesRes } = useGetAllPackagesQuery(undefined);
  const { data: servicesRes } = useGetAllServicesQuery();
  const { data: foodRes } = useGetAllFoodItemsQuery();

  const [activeTab, setActiveTab] = useState<
    "event-types" | "services" | "food" | "packages" | "events" | "users"
  >("event-types");

  const tabs = [
    { id: "event-types", label: "Event Types", icon: Layers },
    { id: "services", label: "Services Catalog", icon: Wrench },
    { id: "food", label: "Food & Catering", icon: Utensils },
    { id: "packages", label: "Storage Plans", icon: Database },
    { id: "events", label: "Platform Events", icon: Calendar },
    { id: "users", label: "Users & Hosts", icon: Users },
  ];

  if (!token || user?.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#172554]">Super Admin Access Required</h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 mb-6">
          Please log in with Super Admin credentials to access the Eventora management console.
        </p>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-[#7C3AED]/20"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-8 lg:py-12 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-[11px] font-bold border border-purple-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Management Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Eventora Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Govern categories, services, catering menus, photo quotas, and platform bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Logged in as:</span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#172554] shadow-xs">
              {user.name} ({user.role})
            </span>
          </div>
        </div>

        {/* 1. Statistics Overview Bar */}
        <AdminStats
          userCount={usersRes?.data?.length || 0}
          eventCount={eventsRes?.data?.length || 0}
          serviceCount={servicesRes?.data?.length || 0}
          foodCount={foodRes?.data?.length || 0}
          packageCount={packagesRes?.data?.length || 0}
        />

        {/* 2. Module Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#172554] text-white shadow-md shadow-[#172554]/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#F5B942]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Tab Contents */}
        <div>
          {activeTab === "event-types" && <AdminEventTypes />}
          {activeTab === "services" && <AdminServices />}
          {activeTab === "food" && <AdminFoodCatalog />}
          {activeTab === "packages" && <AdminPackages />}
          {activeTab === "events" && <AdminEvents />}
          {activeTab === "users" && <AdminUsers />}
        </div>
      </div>
    </div>
  );
}
