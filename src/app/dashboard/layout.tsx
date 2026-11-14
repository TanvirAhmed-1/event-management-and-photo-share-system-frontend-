"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetUserDashboardQuery } from "@/redux/features/user/userApi";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { getAvatarTheme } from "@/utils/avatarThemes";
import QuickEditProfileSheet from "@/components/shared/QuickEditProfileSheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Calendar,
  HardDrive,
  ScanFace,
  User,
  LogOut,
  Menu,
  Sparkles,
  Crown,
  ChevronRight,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Host dashboard shell with grouped left sidebar navigation, mobile Sheet drawer,
 * right top workspace bar, and child page outlet.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [quickEditOpen, setQuickEditOpen] = useState(false);

  const { data: dashboardRes } = useGetUserDashboardQuery(undefined, {
    skip: !token,
  });

  const dashboardStats = dashboardRes?.data?.stats;
  const packageInfo = dashboardRes?.data?.packageInfo;
  const storageUsedMB = Number(
    dashboardStats?.storageUsedMB ?? user?.usedStorageMB ?? 0
  );
  const storageLimitMB = Number(dashboardStats?.storageLimitMB ?? 50);
  const storagePercent = Math.min(
    100,
    Math.round((storageUsedMB / (storageLimitMB || 1)) * 100)
  );

  const displayName =
    user?.name || dashboardRes?.data?.profile?.name || "Eventora Host";
  const displayEmail =
    user?.email || dashboardRes?.data?.profile?.email || "host@eventora.com.bd";
  const avatarTheme = getAvatarTheme(user?.avatarColor);

  const navGroups = [
    {
      title: "Workspace",
      items: [
        {
          label: "Overview",
          href: "/dashboard",
          icon: LayoutDashboard,
          isActive: pathname === "/dashboard",
        },
        {
          label: "My Events & Galleries",
          href: "/dashboard/events",
          icon: Calendar,
          isActive:
            pathname === "/dashboard/events" ||
            pathname?.startsWith("/dashboard/events/"),
        },
        {
          label: "AI Guest Scanner",
          href: "/dashboard/scanner",
          icon: ScanFace,
          isActive: pathname === "/dashboard/scanner",
        },
      ],
    },
    {
      title: "Account & Billing",
      items: [
        {
          label: "Storage & Plans",
          href: "/dashboard/storage",
          icon: HardDrive,
          isActive: pathname === "/dashboard/storage",
        },
        {
          label: "Profile Settings",
          href: "/dashboard/profile",
          icon: User,
          isActive:
            pathname === "/dashboard/profile" || pathname === "/profile",
        },
      ],
    },
  ];

  const activeLabel =
    navGroups
      .flatMap((g) => g.items)
      .find((item) => item.isActive)?.label || "Workspace";

  const handleLogout = async () => {
    setMobileSheetOpen(false);
    dispatch(logout());
    await removeTokenCookie();
    toast.success("Successfully logged out!");
    window.location.href = "/login";
  };

  const renderSidebarBody = (onNavigate?: () => void) => (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 bg-white">
      <div className="space-y-5">
        {/* Interactive User Mini Profile Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/90 via-slate-50 to-amber-50/50 border border-slate-200/80 shadow-2xs">
          <div className="flex items-start justify-between gap-2">
            <Link
              href="/dashboard/profile"
              onClick={onNavigate}
              className="flex items-center gap-3 min-w-0 flex-1 group"
            >
              <div
                className={`w-11 h-11 rounded-xl ${avatarTheme.gradient} text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0`}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {displayEmail}
                </div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => {
                onNavigate?.();
                setQuickEditOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-purple-50 border border-slate-200 hover:border-[#7C3AED]/40 text-[10px] font-bold text-[#7C3AED] transition shrink-0"
              title="Quick edit profile"
            >
              <Pencil className="w-2.5 h-2.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-purple-200 text-[#7C3AED] text-[9px] font-extrabold">
              <Crown className="w-2.5 h-2.5 text-[#F5B942]" />
              <span>
                {user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "HOST PLANNER"}
              </span>
            </span>
            <Link
              href="/dashboard/profile"
              onClick={onNavigate}
              className="text-[10px] font-bold text-slate-500 hover:text-[#7C3AED]"
            >
              Manage →
            </Link>
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                      item.isActive
                        ? "bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-[#7C3AED]/20"
                        : "text-slate-600 hover:bg-purple-50/80 hover:text-[#7C3AED]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-[#7C3AED]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        item.isActive
                          ? "text-white/80"
                          : "text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Live Storage Card & Sign Out */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <Link
          href="/dashboard/storage"
          onClick={onNavigate}
          className="block p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-200/80 transition"
        >
          <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
            <span className="text-[#172554] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="truncate">
                {packageInfo?.name || "Cloud Storage"}
              </span>
            </span>
            <span className="text-[#7C3AED]">{storagePercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#F5B942] transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mt-1.5">
            <span>{storageUsedMB.toFixed(1)} MB used</span>
            <span>{storageLimitMB} MB limit</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 text-red-600 text-xs font-bold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Mobile Top Bar with Left Sheet Trigger */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/80 sticky top-20 z-30">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg ${avatarTheme.gradient} text-white flex items-center justify-center text-xs font-extrabold`}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-extrabold text-[#172554]">
              Host Workspace
            </div>
            <div className="text-[10px] text-slate-500">{activeLabel}</div>
          </div>
        </div>

        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger
            aria-label="Open dashboard menu"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 text-xs font-bold text-[#172554] transition"
          >
            <Menu className="w-4 h-4 text-[#7C3AED]" />
            <span>Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[85vw] sm:max-w-xs">
            <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-100">
              <SheetTitle className="text-sm">Host Navigation</SheetTitle>
              <SheetDescription className="text-[11px]">
                Switch between events, storage &amp; AI tools
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              {renderSidebarBody(() => setMobileSheetOpen(false))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sticky Left Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] border-r border-slate-200/80 bg-white overflow-y-auto">
        {renderSidebarBody()}
      </aside>

      {/* Right Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Workspace Status & Breadcrumb Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-3.5 bg-white/85 backdrop-blur-md border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">Host Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="font-extrabold text-[#172554]">{activeLabel}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200/80 text-[10px] font-extrabold">
              <Crown className="w-3 h-3 text-[#F5B942]" />
              {user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "HOST PLANNER"}
            </span>
            <Link
              href="/guest"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 text-[11px] font-bold text-[#172554] hover:text-[#7C3AED] transition"
            >
              <ScanFace className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>AI Scanner</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#7C3AED] text-white text-[11px] font-bold transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </Link>
          </div>
        </div>

        {/* Child Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 motion-preset-fade motion-duration-300">
          {children}
        </div>
      </div>

      <QuickEditProfileSheet
        open={quickEditOpen}
        onOpenChange={setQuickEditOpen}
      />
    </div>
  );
}
