"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Layers,
  Wrench,
  Utensils,
  Database,
  Calendar,
  Users,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  Globe,
  ChevronRight,
  Crown,
  Pencil,
  Settings,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Super Admin layout with sticky dark grouped sidebar, mobile left Sheet drawer,
 * right top console status bar, and right child page outlet.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [quickEditOpen, setQuickEditOpen] = useState(false);

  const isAuthorizedAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  if (!token || !isAuthorizedAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#F8FAFC]">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#172554]">
          Admin Access Required
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 mb-6">
          Please log in with Admin or Super Admin credentials to access the Eventora management console.
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

  const displayName = user?.name || "Super Admin";
  const displayEmail = user?.email || "admin@eventora.com.bd";
  const avatarTheme = getAvatarTheme(user?.avatarColor);

  const navGroups = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          isActive: pathname === "/admin",
        },
      ],
    },
    {
      title: "Catalogs",
      items: [
        {
          label: "Event Types",
          href: "/admin/event-types",
          icon: Layers,
          isActive: pathname === "/admin/event-types",
        },
        {
          label: "Services Catalog",
          href: "/admin/services",
          icon: Wrench,
          isActive: pathname === "/admin/services",
        },
        {
          label: "Food & Catering",
          href: "/admin/food",
          icon: Utensils,
          isActive: pathname === "/admin/food",
        },
        {
          label: "Storage Plans",
          href: "/admin/packages",
          icon: Database,
          isActive: pathname === "/admin/packages",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          label: "Platform Events",
          href: "/admin/events",
          icon: Calendar,
          isActive: pathname === "/admin/events",
        },
        {
          label: "Users & Hosts",
          href: "/admin/users",
          icon: Users,
          isActive: pathname === "/admin/users",
        },
        {
          label: "Blog & SEO",
          href: "/admin/blogs",
          icon: BookOpen,
          isActive: pathname === "/admin/blogs",
        },
      ],
    },
    {
      title: "Account & System",
      items: [
        {
          label: "Capacity Settings",
          href: "/admin/settings",
          icon: Settings,
          isActive: pathname === "/admin/settings",
        },
        {
          label: "Admin Profile",
          href: "/admin/profile",
          icon: User,
          isActive: pathname === "/admin/profile" || pathname === "/profile",
        },
      ],
    },
  ];

  const activeLabel =
    navGroups
      .flatMap((g) => g.items)
      .find((item) => item.isActive)?.label || "Overview";

  const handleLogout = async () => {
    setMobileSheetOpen(false);
    dispatch(logout());
    await removeTokenCookie();
    toast.success("Successfully logged out!");
    window.location.href = "/login";
  };

  const renderSidebarBody = (onNavigate?: () => void) => (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 bg-[#0F172A] text-white">
      <div className="space-y-5">
        {/* Interactive Admin Profile Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800">
          <div className="flex items-start justify-between gap-2">
            <Link
              href="/admin/profile"
              onClick={onNavigate}
              className="flex items-center gap-3 min-w-0 flex-1 group"
            >
              <div
                className={`w-11 h-11 rounded-xl ${avatarTheme.gradient} text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0`}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-white group-hover:text-amber-300 transition truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
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
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-[#7C3AED] border border-slate-700 text-[10px] font-bold text-slate-200 transition shrink-0"
              title="Quick edit admin profile"
            >
              <Pencil className="w-2.5 h-2.5" />
              <span>Edit</span>
            </button>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[9px] font-extrabold">
              <Crown className="w-2.5 h-2.5" />
              <span>{user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN"}</span>
            </span>
            <Link
              href="/admin/profile"
              onClick={onNavigate}
              className="text-[10px] font-bold text-slate-400 hover:text-amber-300"
            >
              Settings →
            </Link>
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-3 pb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
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
                        ? "bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-md shadow-[#7C3AED]/25"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.isActive
                            ? "text-[#F5B942]"
                            : "text-slate-400 group-hover:text-purple-300"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        item.isActive
                          ? "text-white/80"
                          : "text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800">
        <Link
          href="/"
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition"
        >
          <Globe className="w-4 h-4 text-[#F5B942]" />
          <span>Back to Storefront</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold transition"
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
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0F172A] text-white border-b border-slate-800 sticky top-20 z-30">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg ${avatarTheme.gradient} text-white flex items-center justify-center text-xs font-extrabold`}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-extrabold text-white">
              Admin Console
            </div>
            <div className="text-[10px] text-slate-400">{activeLabel}</div>
          </div>
        </div>

        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger
            aria-label="Open admin menu"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
          >
            <Menu className="w-4 h-4 text-[#F5B942]" />
            <span>Menu</span>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 overflow-hidden w-[85vw] sm:max-w-xs bg-[#0F172A] border-slate-800 text-white [&>button]:text-slate-300 [&>button]:hover:bg-slate-800"
          >
            <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-800 bg-[#0F172A]">
              <SheetTitle className="text-sm text-white">
                Admin Navigation
              </SheetTitle>
              <SheetDescription className="text-[11px] text-slate-400">
                Manage catalogs, storage plans, events &amp; hosts
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 min-h-0">
              {renderSidebarBody(() => setMobileSheetOpen(false))}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sticky Left Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:shrink-0 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] border-r border-slate-800 bg-[#0F172A] overflow-hidden">
        <ScrollArea className="h-full">
          {renderSidebarBody()}
        </ScrollArea>
      </aside>

      {/* Right Content Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Admin Status & Breadcrumb Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-3.5 bg-white/85 backdrop-blur-md border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-400">Admin Console</span>
            <span className="text-slate-300">/</span>
            <span className="font-extrabold text-[#172554]">{activeLabel}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold">
              <Crown className="w-3 h-3 text-amber-500" />
              {user?.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "ADMIN"}
            </span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-[#172554] transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/profile"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#7C3AED] text-white text-[11px] font-bold transition"
            >
              <User className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>Admin Profile</span>
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
