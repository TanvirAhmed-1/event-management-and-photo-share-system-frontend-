"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux/hook";
import { useGetAllEventsQuery } from "@/redux/features/event/eventApi";
import { useGetAllUsersAdminQuery } from "@/redux/features/user/userApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useGetAllServicesQuery } from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { useGetAllFoodItemsQuery } from "@/redux/features/food/foodApi";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import {
  ShieldCheck,
  Layers,
  Wrench,
  Utensils,
  Database,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";

import AdminStats from "@/components/ui/admin/AdminStats";
import AdminUsers from "@/components/ui/admin/AdminUsers";
import AdminEvents from "@/components/ui/admin/AdminEvents";

/**
 * Super Admin overview dashboard showing live KPIs, quick module links, and recent events/users.
 */
export default function AdminDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const { data: eventsRes } = useGetAllEventsQuery(undefined);
  const { data: usersRes } = useGetAllUsersAdminQuery(undefined);
  const { data: packagesRes } = useGetAllPackagesQuery(undefined);
  const { data: servicesRes } = useGetAllServicesQuery();
  const { data: foodRes } = useGetAllFoodItemsQuery();
  const { data: eventTypesRes } = useGetAllEventTypesQuery();

  const modules = [
    {
      title: "Event Types",
      description: "Manage wedding, birthday, corporate & gala categories.",
      href: "/admin/event-types",
      count: `${eventTypesRes?.data?.length || 0} categories`,
      icon: Layers,
      accent: "bg-purple-50 text-[#7C3AED] border-purple-200/80",
    },
    {
      title: "Services Catalog",
      description: "Photography, decoration, sound, and venue packages.",
      href: "/admin/services",
      count: `${servicesRes?.data?.length || 0} services`,
      icon: Wrench,
      accent: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
    },
    {
      title: "Food & Catering",
      description: "Buffet courses, banquet per-plate menus & veg tags.",
      href: "/admin/food",
      count: `${foodRes?.data?.length || 0} menu items`,
      icon: Utensils,
      accent: "bg-amber-50 text-amber-600 border-amber-200/80",
    },
    {
      title: "Storage Plans",
      description: "Cloud storage tiers and AI gallery quotas for hosts.",
      href: "/admin/packages",
      count: `${packagesRes?.data?.length || 0} active plans`,
      icon: Database,
      accent: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
    },
    {
      title: "Platform Events",
      description: "Inspect host event galleries and guest portals.",
      href: "/admin/events",
      count: `${eventsRes?.data?.length || 0} events`,
      icon: Calendar,
      accent: "bg-sky-50 text-sky-600 border-sky-200/80",
    },
    {
      title: "Users & Hosts",
      description: "Audit registered accounts, statuses & assigned plans.",
      href: "/admin/users",
      count: `${usersRes?.data?.length || 0} accounts`,
      icon: Users,
      accent: "bg-rose-50 text-rose-600 border-rose-200/80",
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
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
          <span className="text-xs font-semibold text-slate-500">
            Logged in as:
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#172554] shadow-xs">
            {user?.name || "Admin"} ({user?.role || "SUPER_ADMIN"})
          </span>
        </div>
      </div>

      {/* Statistics Overview Bar */}
      <AdminStats
        userCount={usersRes?.data?.length || 0}
        eventCount={eventsRes?.data?.length || 0}
        serviceCount={servicesRes?.data?.length || 0}
        foodCount={foodRes?.data?.length || 0}
        packageCount={packagesRes?.data?.length || 0}
      />

      {/* Quick Module Cards */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-[#172554]">
            Management Modules
          </h2>
          <p className="text-xs text-slate-500">
            Jump directly to any catalog, quota, or moderation section from the left sidebar or cards below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#7C3AED]/50 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${mod.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600">
                    {mod.count}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition">
                      {mod.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#7C3AED] group-hover:translate-x-0.5 transition" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Live Operations Overview */}
      <div className="space-y-8">
        <AdminEvents />
        <AdminUsers />
      </div>
    </div>
  );
}
