"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetUserDashboardQuery } from "@/redux/features/user/userApi";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import { useGetAllCategoriesQuery } from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { getAvatarTheme } from "@/utils/avatarThemes";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  User,
  Calendar,
  Sparkles,
  Heart,
  Cake,
  Users,
  Briefcase,
  Camera,
  UtensilsCrossed,
  Package,
  HardDrive,
  QrCode,
  Pencil,
  Crown,
} from "lucide-react";
import toast from "react-hot-toast";
import EventoraLogo from "./EventoraLogo";
import QuickEditProfileSheet from "./QuickEditProfileSheet";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const isAuthenticated = Boolean(token && user);
  const { data: dashboardRes } = useGetUserDashboardQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: eventTypesRes } = useGetAllEventTypesQuery();
  const { data: serviceCategoriesRes } = useGetAllCategoriesQuery();
  const { data: packagesRes } = useGetAllPackagesQuery(undefined);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    dispatch(logout());
    await removeTokenCookie();
    toast.success("Successfully logged out!");
    window.location.href = "/login";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setSearchOpen(false);
    if (!q) {
      router.push("/events");
      return;
    }
    router.push(`/services?q=${encodeURIComponent(q)}`);
  };

  const navDropdowns = useMemo(() => {
    const eventTypes = eventTypesRes?.data || [];
    const serviceCategories = serviceCategoriesRes?.data || [];
    const packages = packagesRes?.data || [];

    const getEventIcon = (slug: string) => {
      const s = (slug || "").toLowerCase();
      if (s.includes("wedding")) return Heart;
      if (s.includes("birthday")) return Cake;
      if (s.includes("corporate")) return Briefcase;
      if (s.includes("get-together")) return Users;
      return Sparkles;
    };

    const getServiceIcon = (slug: string) => {
      const s = (slug || "").toLowerCase();
      if (s.includes("photo") || s.includes("video")) return Camera;
      if (s.includes("cater") || s.includes("food")) return UtensilsCrossed;
      if (s.includes("sound") || s.includes("venue")) return Calendar;
      return Sparkles;
    };

    return [
      {
        name: "Events",
        href: "/events",
        items: eventTypes.map((et: any) => ({
          label: et.name,
          href: `/events?type=${encodeURIComponent(et.slug)}`,
          icon: getEventIcon(et.slug),
        })),
      },
      {
        name: "Services",
        href: "/services",
        items: serviceCategories.map((cat: any) => ({
          label: cat.name,
          href: `/services?cat=${encodeURIComponent(cat.slug)}`,
          icon: getServiceIcon(cat.slug),
        })),
      },
      {
        name: "Packages",
        href: "/packages",
        items: [
          ...packages.map((pkg: any) => ({
            label: pkg.name,
            href: "/packages",
            icon: HardDrive,
          })),
          {
            label: "Food & Catering Menu",
            href: "/food",
            icon: UtensilsCrossed,
          },
        ],
      },
    ];
  }, [eventTypesRes, serviceCategoriesRes, packagesRes]);

  const avatarTheme = getAvatarTheme(user?.avatarColor);
  const storageUsedMB = Number(
    dashboardRes?.data?.stats?.storageUsedMB ?? user?.usedStorageMB ?? 0
  );
  const storageLimitMB = Number(
    dashboardRes?.data?.stats?.storageLimitMB ?? 50
  );
  const storagePercent = Math.min(
    100,
    Math.round((storageUsedMB / (storageLimitMB || 1)) * 100)
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_4px_24px_-6px_rgba(15,23,42,0.06)]">
        <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* 1. Left: Brand Logo */}
            <div className="flex items-center shrink-0">
              <EventoraLogo size="md" />
            </div>

            {/* 2. Middle: Desktop Navigation Items */}
            <nav
              className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-slate-700"
              ref={dropdownRef}
            >
              <Link
                href="/"
                className={`px-2 py-1.5 rounded-lg transition-colors hover:text-[#7C3AED] ${
                  pathname === "/"
                    ? "text-[#7C3AED] font-bold bg-purple-50/70"
                    : ""
                }`}
              >
                Home
              </Link>

              {navDropdowns.map((menu) => (
                <div key={menu.name} className="relative group">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === menu.name ? null : menu.name
                      )
                    }
                    className="flex items-center gap-1 py-2 px-1.5 text-slate-700 hover:text-[#7C3AED] transition-colors focus:outline-none"
                  >
                    <span>{menu.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-[#7C3AED]" />
                  </button>

                  {/* Compact Clean Dropdown Menu */}
                  <div className="absolute left-0 top-full pt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="rounded-2xl bg-white p-1.5 shadow-2xl shadow-slate-900/10 border border-slate-100 ring-1 ring-slate-900/5 space-y-0.5">
                      {menu.items.map((sub: any) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50/70 group/item transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover/item:bg-white border border-slate-100 flex items-center justify-center text-[#7C3AED] shrink-0 shadow-2xs transition-colors">
                              <SubIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-[#172554] group-hover/item:text-[#7C3AED] transition-colors truncate">
                              {sub.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/about"
                className={`px-2 py-1.5 rounded-lg transition-colors hover:text-[#7C3AED] ${
                  pathname === "/about"
                    ? "text-[#7C3AED] font-bold bg-purple-50/70"
                    : ""
                }`}
              >
                About
              </Link>

              <Link
                href="/blog"
                className={`px-2 py-1.5 rounded-lg transition-colors hover:text-[#7C3AED] ${
                  pathname?.startsWith("/blog")
                    ? "text-[#7C3AED] font-bold bg-purple-50/70"
                    : ""
                }`}
              >
                Blog
              </Link>

              <Link
                href="/guide"
                className={`px-2 py-1.5 rounded-lg transition-colors hover:text-[#7C3AED] ${
                  pathname === "/guide"
                    ? "text-[#7C3AED] font-bold bg-purple-50/70"
                    : ""
                }`}
              >
                Guide
              </Link>

              {/* Prominent AI Photo Finder Pill */}
              <Link
                href="/guest"
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  pathname?.startsWith("/guest")
                    ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm shadow-[#7C3AED]/25"
                    : "bg-gradient-to-r from-purple-50 to-amber-50/70 text-[#7C3AED] border-purple-200/80 hover:border-[#7C3AED]/50 hover:shadow-xs"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]" />
                <span>AI Photo Finder</span>
              </Link>
            </nav>

            {/* 3. Right: Search & Auth / Avatar Profile Menu */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Icon Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-[#7C3AED] hover:bg-purple-50 border border-transparent hover:border-purple-100 transition-all"
                title="Search Eventora"
              >
                <Search className="w-4 h-4" />
              </button>

              {isAuthenticated && user ? (
                /* Authenticated User Avatar Dropdown */
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                    className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border transition-all ${
                      profileMenuOpen
                        ? "bg-purple-50/90 border-[#7C3AED]/40 shadow-sm"
                        : "bg-slate-50/90 hover:bg-white border-slate-200/80 hover:border-[#7C3AED]/30 shadow-2xs"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full ${avatarTheme.gradient} text-white flex items-center justify-center font-extrabold text-xs shadow-sm ring-2 ring-white`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:flex flex-col items-start text-left leading-tight">
                      <span className="text-xs font-bold text-[#172554] max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {user.role === "SUPER_ADMIN" ? "Admin" : "Profile"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        profileMenuOpen ? "rotate-180 text-[#7C3AED]" : ""
                      }`}
                    />
                  </button>

                  {/* Avatar Profile Dropdown Popover */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2.5 w-80 rounded-2xl bg-white shadow-2xl shadow-slate-900/15 border border-slate-200/80 ring-1 ring-slate-900/5 overflow-hidden z-50 motion-preset-slide-down-sm motion-preset-fade motion-duration-200">
                      {/* User Identity Header */}
                      <div className="p-4 bg-gradient-to-br from-slate-50 via-purple-50/40 to-white border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-2xl ${avatarTheme.gradient} text-white flex items-center justify-center font-extrabold text-base shadow-md shrink-0`}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-extrabold text-[#172554] truncate">
                                {user.name}
                              </p>
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] text-[9px] font-extrabold shrink-0">
                                <Crown className="w-2.5 h-2.5 text-[#F5B942]" />
                                {user.role === "SUPER_ADMIN" ? "ADMIN" : "HOST"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {user.email}
                            </p>
                            {user.organization && (
                              <p className="text-[10px] font-semibold text-[#7C3AED] truncate mt-0.5">
                                {user.organization}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Mini Storage Bar */}
                        <div className="mt-3.5 pt-3 border-t border-slate-200/60">
                          <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                            <span className="text-slate-600 flex items-center gap-1">
                              <HardDrive className="w-3 h-3 text-[#7C3AED]" />
                              Cloud Storage
                            </span>
                            <span className="text-[#7C3AED] font-bold">
                              {storageUsedMB.toFixed(1)} / {storageLimitMB} MB
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#F5B942]"
                              style={{ width: `${storagePercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Edit Profile Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            setQuickEditOpen(true);
                          }}
                          className="mt-3 w-full py-2 px-3 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-[#7C3AED]/40 text-xs font-bold text-[#172554] flex items-center justify-center gap-1.5 shadow-2xs transition"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>Edit Profile Quickly</span>
                        </button>
                      </div>

                      {/* Navigation Links */}
                      <div className="p-2 space-y-0.5">
                        <Link
                          href={
                            user.role === "SUPER_ADMIN"
                              ? "/admin/profile"
                              : "/dashboard/profile"
                          }
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50/80 hover:text-[#7C3AED] transition"
                        >
                          <User className="w-4 h-4 text-[#7C3AED]" />
                          <span>Manage Profile</span>
                        </Link>

                        <Link
                          href={
                            user.role === "SUPER_ADMIN"
                              ? "/admin"
                              : "/dashboard"
                          }
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50/80 hover:text-[#7C3AED] transition"
                        >
                          {user.role === "SUPER_ADMIN" ? (
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                          ) : (
                            <LayoutDashboard className="w-4 h-4 text-[#7C3AED]" />
                          )}
                          <span>
                            {user.role === "SUPER_ADMIN"
                              ? "Admin Console"
                              : "Organizer Dashboard"}
                          </span>
                        </Link>

                        <Link
                          href={
                            user.role === "SUPER_ADMIN"
                              ? "/admin/packages"
                              : "/dashboard/storage"
                          }
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50/80 hover:text-[#7C3AED] transition"
                        >
                          <HardDrive className="w-4 h-4 text-[#7C3AED]" />
                          <span>Subscription & Storage</span>
                        </Link>

                        <Link
                          href="/guest"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50/80 hover:text-[#7C3AED] transition"
                        >
                          <QrCode className="w-4 h-4 text-[#7C3AED]" />
                          <span>AI Photo Scanner</span>
                        </Link>

                        {user.role === "SUPER_ADMIN" && (
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50/70 hover:bg-amber-100/80 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-600" />
                            <span>Host Events Hub</span>
                          </Link>
                        )}
                      </div>

                      {/* Divider + Logout */}
                      <div className="p-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest State */
                <div className="hidden sm:flex items-center gap-2.5">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#7C3AED] hover:bg-slate-100/80 transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7C3AED]/25 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-5 shadow-xl space-y-4 max-h-[82vh] overflow-y-auto motion-preset-slide-down-sm motion-preset-fade motion-duration-250">
            {isAuthenticated && user && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-slate-50 border border-purple-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl ${avatarTheme.gradient} text-white flex items-center justify-center font-extrabold text-sm shadow-sm`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-[#172554] truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={
                      user.role === "SUPER_ADMIN"
                        ? "/admin/profile"
                        : "/dashboard/profile"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-center text-xs font-bold text-[#172554]"
                  >
                    Manage Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setQuickEditOpen(true);
                    }}
                    className="py-2 px-3 rounded-xl bg-[#7C3AED] text-center text-xs font-bold text-white"
                  >
                    Quick Edit
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-semibold text-slate-800 hover:text-[#7C3AED] py-1.5"
              >
                Home
              </Link>
              <Link
                href="/guest"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-bold text-[#7C3AED] py-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#F5B942]" />
                <span>AI Photo Finder</span>
              </Link>
            </div>

            {navDropdowns.map((menu) => (
              <div key={menu.name} className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {menu.name}
                </div>
                <div className="pl-3 space-y-1 border-l-2 border-purple-100">
                  {menu.items.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-slate-600 hover:text-[#7C3AED] py-1"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-6 pt-1">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-slate-800 hover:text-[#7C3AED] py-1"
              >
                About
              </Link>
              <Link
                href="/guide"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-slate-800 hover:text-[#7C3AED] py-1"
              >
                Guide
              </Link>
            </div>

            {isAuthenticated && user ? (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  href={user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl bg-[#172554] text-white font-semibold text-sm"
                >
                  Go to{" "}
                  {user.role === "SUPER_ADMIN" ? "Admin Console" : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center py-2 text-sm text-red-600 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-[#7C3AED] text-white font-semibold text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Right-Side Sheet Drawer: Quick Edit Profile */}
      <QuickEditProfileSheet
        open={quickEditOpen}
        onOpenChange={setQuickEditOpen}
      />

      {/* Global Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/50 backdrop-blur-sm motion-preset-fade motion-duration-200"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden motion-preset-slide-down-md motion-preset-fade motion-duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100"
            >
              <Search className="w-5 h-5 text-[#7C3AED] shrink-0" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search weddings, venues, photographers, catering..."
                className="border-0 bg-transparent px-0 py-1 h-9 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 shadow-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="p-4 text-xs text-slate-500 bg-slate-50 flex flex-wrap items-center gap-2">
              <span>Popular:</span>
              <Link
                href="/packages"
                onClick={() => setSearchOpen(false)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[#7C3AED] font-semibold hover:border-[#7C3AED] transition"
              >
                Wedding Packages
              </Link>
              <Link
                href="/food"
                onClick={() => setSearchOpen(false)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[#7C3AED] font-semibold hover:border-[#7C3AED] transition"
              >
                Kacchi Biryani
              </Link>
              <Link
                href="/guest"
                onClick={() => setSearchOpen(false)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[#7C3AED] font-semibold hover:border-[#7C3AED] transition"
              >
                AI Face Photo Finder
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
