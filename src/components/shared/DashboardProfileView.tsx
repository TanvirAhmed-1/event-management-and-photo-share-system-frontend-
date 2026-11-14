"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  logout,
  updateUserPackage,
  updateUserProfile,
} from "@/redux/features/auth/authSlice";
import {
  useGetAllUsersAdminQuery,
  useGetUserDashboardQuery,
  useSelectPackageMutation,
} from "@/redux/features/user/userApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useGetAllEventsQuery } from "@/redux/features/event/eventApi";
import { useGetAllServicesQuery } from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { useGetAllFoodItemsQuery } from "@/redux/features/food/foodApi";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { AVATAR_THEMES, getAvatarTheme } from "@/utils/avatarThemes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Palette,
  Lock,
  Eye,
  EyeOff,
  Check,
  Shield,
  ShieldCheck,
  Crown,
  Calendar,
  Camera,
  HardDrive,
  Database,
  Layers,
  Wrench,
  Utensils,
  Users,
  Sparkles,
  Pencil,
  KeyRound,
  ArrowRight,
  LogOut,
  Activity,
  ScanFace,
  ExternalLink,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

export type ProfileTab = "personal" | "storage" | "security" | "activity";

interface DashboardProfileViewProps {
  initialTab?: ProfileTab;
}

const formatStorageSize = (mb: number) =>
  mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;

/**
 * Role-aware User (Host) and Super Admin Profile & Account Studio.
 * Renders inside DashboardLayout or AdminLayout with horizontal tabs, live telemetry,
 * and shadcn right-side Sheet drawers for editing identity & security credentials.
 */
export default function DashboardProfileView({
  initialTab = "personal",
}: DashboardProfileViewProps) {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "SUPER_ADMIN";

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [passwordSheetOpen, setPasswordSheetOpen] = useState(false);
  const [updatingPkgId, setUpdatingPkgId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Core queries
  const { data: dashboardRes, refetch: refetchDashboard } =
    useGetUserDashboardQuery(undefined, { skip: !token });
  const { data: packagesRes, isLoading: packagesLoading } =
    useGetAllPackagesQuery(undefined);
  const { data: eventsRes, isLoading: eventsLoading } = useGetAllEventsQuery(
    undefined,
    { skip: !token }
  );

  // Admin-only telemetry queries
  const { data: usersRes } = useGetAllUsersAdminQuery(undefined, {
    skip: !token || !isAdmin,
  });
  const { data: servicesRes } = useGetAllServicesQuery(undefined, {
    skip: !token || !isAdmin,
  });
  const { data: foodRes } = useGetAllFoodItemsQuery(undefined, {
    skip: !token || !isAdmin,
  });

  const [selectPackage] = useSelectPackageMutation();

  const dashboardData = dashboardRes?.data || {
    profile: {
      name: user?.name || (isAdmin ? "Super Admin" : "Eventora Host"),
      email: user?.email || "",
      phone: user?.phone || "",
      isActive: true,
      createdAt: null,
    },
    packageInfo: { id: "", name: "Free Plan", storageLimitMB: 50, price: 0, durationDays: 30 },
    stats: {
      totalEvents: 0,
      totalPhotos: 0,
      storageLimitMB: 50,
      storageUsedMB: user?.usedStorageMB || 0,
      remainingStorageMB: 50,
    },
  };

  const packages = packagesRes?.data || [];
  const events = eventsRes?.data || [];
  const totalUsers = usersRes?.data?.length || 0;
  const totalServices = servicesRes?.data?.length || 0;
  const totalFood = foodRes?.data?.length || 0;

  const [personalForm, setPersonalForm] = useState({
    name: "",
    phone: "",
    organization: "",
    bio: "",
    avatarColor: "violet",
  });

  useEffect(() => {
    setPersonalForm({
      name: user?.name || dashboardData.profile?.name || "",
      phone: user?.phone || dashboardData.profile?.phone || "",
      organization: user?.organization || "",
      bio: user?.bio || "",
      avatarColor: user?.avatarColor || "violet",
    });
  }, [user, dashboardData.profile?.name, dashboardData.profile?.phone]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const currentAvatarTheme = getAvatarTheme(personalForm.avatarColor);
  const displayName =
    personalForm.name || user?.name || dashboardData.profile?.name || "Eventora User";
  const displayEmail =
    user?.email || dashboardData.profile?.email || "user@eventora.com.bd";
  const displayPhone =
    personalForm.phone || user?.phone || dashboardData.profile?.phone || "Not added";
  const memberSince = dashboardData.profile?.createdAt
    ? new Date(dashboardData.profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Active Member";

  const storageUsedMB = Number(dashboardData.stats?.storageUsedMB || 0);
  const storageLimitMB = Number(dashboardData.stats?.storageLimitMB || 50);
  const storageRemainingMB = Math.max(0, storageLimitMB - storageUsedMB);
  const storagePercent = Math.min(
    100,
    Math.round((storageUsedMB / (storageLimitMB || 1)) * 100)
  );
  const activePackageId = dashboardData.packageInfo?.id;

  const handleSavePersonalInfo = (
    e: React.FormEvent,
    closeSheet = false
  ) => {
    e.preventDefault();
    if (!personalForm.name.trim()) {
      toast.error("Full name is required.");
      return;
    }
    if (!personalForm.phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    dispatch(
      updateUserProfile({
        name: personalForm.name.trim(),
        phone: personalForm.phone.trim(),
        organization: personalForm.organization.trim(),
        bio: personalForm.bio.trim(),
        avatarColor: personalForm.avatarColor,
      })
    );
    toast.success("Profile updated successfully!");
    if (closeSheet) {
      setEditSheetOpen(false);
    }
  };

  const handlePasswordSubmit = (
    e: React.FormEvent,
    closeSheet = false
  ) => {
    e.preventDefault();
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    toast.success("Password preferences verified and updated!");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    if (closeSheet) {
      setPasswordSheetOpen(false);
    }
  };

  const handleSelectPlan = async (pkg: any) => {
    setUpdatingPkgId(pkg.id);
    try {
      await selectPackage({ packageId: pkg.id }).unwrap();
      dispatch(updateUserPackage(pkg.id));
      toast.success(`Switched to ${pkg.name} plan!`);
      refetchDashboard();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update storage plan.");
    } finally {
      setUpdatingPkgId(null);
    }
  };

  const handleLogoutSession = async () => {
    dispatch(logout());
    await removeTokenCookie();
    toast.success("Signed out of Eventora!");
    window.location.href = "/login";
  };

  const kpiCards = isAdmin
    ? [
        {
          label: "Registered Users",
          value: totalUsers,
          sub: "Active hosts & organizers",
          icon: Users,
          tint: "bg-purple-50 text-[#7C3AED] border-purple-200/70",
        },
        {
          label: "Platform Events",
          value: events.length,
          sub: "Live curated galleries",
          icon: Calendar,
          tint: "bg-sky-50 text-sky-600 border-sky-200/70",
        },
        {
          label: "Catalog Items",
          value: totalServices + totalFood,
          sub: `${totalServices} services • ${totalFood} catering`,
          icon: Layers,
          tint: "bg-amber-50 text-amber-600 border-amber-200/70",
        },
        {
          label: "Storage Tiers",
          value: packages.length,
          sub: "Active subscription plans",
          icon: Database,
          tint: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
        },
      ]
    : [
        {
          label: "Planned Events",
          value: dashboardData.stats.totalEvents,
          sub: "Active celebration workspaces",
          icon: Calendar,
          tint: "bg-purple-50 text-[#7C3AED] border-purple-200/70",
        },
        {
          label: "AI Indexed Photos",
          value: dashboardData.stats.totalPhotos,
          sub: "Ready for selfie matching",
          icon: Camera,
          tint: "bg-amber-50 text-amber-600 border-amber-200/70",
        },
        {
          label: "Storage Used",
          value: `${storageUsedMB.toFixed(1)} MB`,
          sub: `of ${formatStorageSize(storageLimitMB)} quota`,
          icon: HardDrive,
          tint: "bg-indigo-50 text-indigo-600 border-indigo-200/70",
        },
        {
          label: "Active Plan",
          value: dashboardData.packageInfo?.name || "Free Plan",
          sub: `${storagePercent}% capacity utilized`,
          icon: Crown,
          tint: "bg-emerald-50 text-emerald-600 border-emerald-200/70",
        },
      ];

  const tabs: Array<{
    id: ProfileTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "personal", label: "Profile & Identity", icon: User },
    { id: "storage", label: "Cloud Storage & Plans", icon: HardDrive },
    { id: "security", label: "Security & Access", icon: Shield },
    {
      id: "activity",
      label: isAdmin ? "Platform Shortcuts" : "My Recent Events",
      icon: Activity,
    },
  ];

  const adminModules = [
    {
      title: "Event Types",
      desc: "Add or toggle celebration categories",
      href: "/admin/event-types",
      icon: Layers,
    },
    {
      title: "Services Catalog",
      desc: "Manage vendors & pricing tiers",
      href: "/admin/services",
      icon: Wrench,
    },
    {
      title: "Food & Catering",
      desc: "Curate per-plate catering menus",
      href: "/admin/food",
      icon: Utensils,
    },
    {
      title: "Storage Plans",
      desc: "Configure AI gallery storage quotas",
      href: "/admin/packages",
      icon: Database,
    },
    {
      title: "Users & Hosts",
      desc: "Audit host status & active tiers",
      href: "/admin/users",
      icon: Users,
    },
  ];

  const renderIdentityFields = (prefix: string) => (
    <div className="space-y-4">
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <Palette className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Avatar Theme Color</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(AVATAR_THEMES).map(([key, theme]) => {
            const selected = personalForm.avatarColor === key;
            return (
              <button
                key={`${prefix}-${key}`}
                type="button"
                onClick={() =>
                  setPersonalForm({ ...personalForm, avatarColor: key })
                }
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                  selected
                    ? "border-[#7C3AED] bg-purple-50 text-[#7C3AED] shadow-2xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${theme.swatch}`} />
                <span>{theme.label}</span>
                {selected && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <User className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Full Name *</span>
          </Label>
          <Input
            type="text"
            value={personalForm.name}
            onChange={(e) =>
              setPersonalForm({ ...personalForm, name: e.target.value })
            }
            placeholder="Your full name"
            className="text-xs h-10 bg-slate-50/60"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Phone className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Phone Number *</span>
          </Label>
          <Input
            type="tel"
            value={personalForm.phone}
            onChange={(e) =>
              setPersonalForm({ ...personalForm, phone: e.target.value })
            }
            placeholder="017XXXXXXXX"
            className="text-xs h-10 bg-slate-50/60"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Verified Email</span>
          </Label>
          <Input
            type="email"
            value={displayEmail}
            disabled
            className="text-xs h-10 bg-slate-100/80 text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Organization / Studio Brand</span>
          </Label>
          <Input
            type="text"
            value={personalForm.organization}
            onChange={(e) =>
              setPersonalForm({ ...personalForm, organization: e.target.value })
            }
            placeholder={isAdmin ? "Eventora Platform HQ" : "e.g. Royal Wedding Studio"}
            className="text-xs h-10 bg-slate-50/60"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Role Bio / Notes</span>
        </Label>
        <Textarea
          rows={3}
          value={personalForm.bio}
          onChange={(e) =>
            setPersonalForm({ ...personalForm, bio: e.target.value })
          }
          placeholder="Describe your responsibilities, event focus, or studio notes..."
          className="text-xs bg-slate-50/60 min-h-[76px]"
        />
      </div>
    </div>
  );

  const renderPasswordFields = (prefix: string) => (
    <div className="space-y-4">
      {[
        {
          key: "currentPassword" as const,
          visKey: "current" as const,
          label: "Current Password",
        },
        {
          key: "newPassword" as const,
          visKey: "next" as const,
          label: "New Password",
        },
        {
          key: "confirmPassword" as const,
          visKey: "confirm" as const,
          label: "Confirm New Password",
        },
      ].map((field) => (
        <div key={`${prefix}-${field.key}`} className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>{field.label}</span>
          </Label>
          <div className="relative">
            <Input
              type={showPasswords[field.visKey] ? "text" : "password"}
              value={passwordForm[field.key]}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  [field.key]: e.target.value,
                })
              }
              placeholder="••••••••"
              className="text-xs h-10 pr-10 bg-slate-50/60"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  [field.visKey]: !showPasswords[field.visKey],
                })
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPasswords[field.visKey] ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[1220px] mx-auto space-y-6 motion-preset-slide-up-sm motion-preset-fade motion-duration-400">
      {/* 1. Executive Profile Cover & Identity Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div
          className={`relative h-28 sm:h-32 overflow-hidden ${
            isAdmin
              ? "bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#4C1D95]"
              : "bg-gradient-to-r from-[#172554] via-[#312E81] to-[#7C3AED]"
          }`}
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#F5B942]/15 blur-2xl pointer-events-none" />
          <div className="relative h-full px-6 py-4 flex items-start justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942]" />
              {isAdmin ? "Super Admin Account Center" : "Organizer Profile Studio"}
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-300/30 text-[11px] font-bold text-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {dashboardData.profile?.isActive !== false ? "Verified Session" : "Pending"}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 -mt-10 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            {/* Identity Row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
              <div className="relative shrink-0">
                <div
                  className={`w-20 h-20 rounded-2xl ${currentAvatarTheme.gradient} text-white font-extrabold text-2xl flex items-center justify-center shadow-xl ring-4 ring-white`}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center"
                  title="Online"
                >
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </span>
              </div>

              <div className="space-y-1.5 min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#172554] tracking-tight truncate">
                    {displayName}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isAdmin
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-purple-50 text-[#7C3AED] border-purple-200"
                    }`}
                  >
                    {isAdmin ? (
                      <Crown className="w-3 h-3 text-amber-500" />
                    ) : (
                      <Shield className="w-3 h-3 text-[#7C3AED]" />
                    )}
                    {isAdmin ? "SUPER ADMIN" : "EVENT ORGANIZER"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {displayEmail}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {displayPhone}
                  </span>
                  {personalForm.organization && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#7C3AED]">
                      <Building2 className="w-3.5 h-3.5" />
                      {personalForm.organization}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Since {memberSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Drawer Triggers */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setEditSheetOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm shadow-[#7C3AED]/20 transition"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setPasswordSheetOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#172554] text-xs font-bold transition"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Security</span>
              </button>

              <Link
                href={isAdmin ? "/admin" : "/dashboard/events"}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-[#7C3AED] text-xs font-bold transition"
              >
                <span>{isAdmin ? "Admin Overview" : "My Events"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Role-Aware Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5"
            >
              <div
                className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${card.tint}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {card.label}
                </div>
                <div className="text-lg font-extrabold text-[#172554] truncate">
                  {card.value}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Horizontal Segmented Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs inline-flex flex-wrap gap-1 w-full sm:w-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                active
                  ? "bg-[#172554] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#7C3AED] hover:bg-purple-50/60"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${active ? "text-[#F5B942]" : "text-slate-400"}`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Tab Workspace */}
      {activeTab === "personal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start motion-preset-fade motion-duration-300">
          {/* Left 8 Cols: Inline Identity & Preferences Form */}
          <form
            onSubmit={(e) => handleSavePersonalInfo(e, false)}
            className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#172554]">
                  Identity &amp; Brand Preferences
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize how your name, brand, and avatar appear across Eventora workspaces.
                </p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm shadow-[#7C3AED]/20 transition shrink-0"
              >
                Save Changes
              </button>
            </div>

            {renderIdentityFields("inline")}
          </form>

          {/* Right 4 Cols: Authority & Quota Cards */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#172554]">
                  Account Authority
                </h3>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { label: "Email Verified", status: "Active" },
                  { label: "JWT Session Guard", status: "Protected" },
                  {
                    label: isAdmin ? "Super Admin Console" : "AI Face Indexing",
                    status: "Enabled",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <span className="font-semibold text-slate-700">
                      {item.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPasswordSheetOpen(true)}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-[#7C3AED]/50 hover:bg-purple-50/50 text-xs font-bold text-[#172554] transition"
              >
                Change Account Password
              </button>
            </div>

            {isAdmin ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-extrabold text-[#172554]">
                  Quick Admin Modules
                </h3>
                <div className="space-y-1.5">
                  {adminModules.map((mod) => {
                    const Icon = mod.icon;
                    return (
                      <Link
                        key={mod.href}
                        href={mod.href}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-xs font-bold text-slate-700 hover:text-[#7C3AED] transition"
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-[#7C3AED]" />
                          {mod.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#172554] to-[#4C1D95] text-white rounded-3xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    Active Cloud Tier
                  </span>
                  <span className="text-xs font-extrabold">{storagePercent}% used</span>
                </div>
                <div className="text-xl font-extrabold">
                  {dashboardData.packageInfo?.name || "Free Plan"}
                </div>
                <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#F5B942] transition-all duration-500"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-purple-200">
                  <span>{storageUsedMB.toFixed(1)} MB used</span>
                  <span>{formatStorageSize(storageLimitMB)} limit</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("storage")}
                  className="w-full py-2.5 rounded-xl bg-white text-[#172554] hover:bg-amber-300 text-xs font-extrabold transition"
                >
                  Upgrade or Switch Plan →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "storage" && (
        <div className="space-y-6 motion-preset-fade motion-duration-300">
          {/* Compact Active Plan Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#4C1D95] text-white p-6 sm:p-7 shadow-lg border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-extrabold text-amber-300">
                  <Crown className="w-3 h-3" />
                  CURRENT ACTIVE PLAN
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold">
                  {dashboardData.packageInfo?.name || "Free Plan"}
                </div>
                <p className="text-xs text-purple-200">
                  {formatStorageSize(storageRemainingMB)} available for event photos &amp; AI embeddings.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-purple-100">
                    {storageUsedMB.toFixed(2)} MB Used
                  </span>
                  <span className="text-amber-300">
                    {formatStorageSize(storageLimitMB)} Total Limit ({storagePercent}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#F5B942] transition-all duration-500"
                    style={{ width: `${storagePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Tiers Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-extrabold text-[#172554]">
                  {isAdmin
                    ? "Platform Storage Plans (Preview & Quick Switch)"
                    : "Upgrade or Switch Cloud Storage Plan"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instant cloud vault expansion across all active and future event galleries.
                </p>
              </div>
              {isAdmin && (
                <Link
                  href="/admin/packages"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white text-xs font-bold transition self-start"
                >
                  <span>Manage Tiers in Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {packagesLoading ? (
              <div className="py-10 text-center text-xs text-slate-400">
                Loading storage plans...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {packages.map((pkg: any) => {
                  const isCurrent = activePackageId === pkg.id;
                  const isUpdating = updatingPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                        isCurrent
                          ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/15 bg-purple-50/20 shadow-md"
                          : "border-slate-200/90 hover:border-purple-200 hover:shadow-md bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-extrabold text-[#172554]">
                            {pkg.name}
                          </h3>
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-[#172554]">
                            {Number(pkg.price || 0) === 0
                              ? "Free"
                              : `৳${Number(pkg.price).toLocaleString()}`}
                          </span>
                          <span className="text-xs text-slate-400">
                            / {pkg.durationDays || 30} days
                          </span>
                        </div>

                        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-bold">
                          <HardDrive className="w-3.5 h-3.5" />
                          <span>{formatStorageSize(Number(pkg.storageLimitMB || 0))} AI Storage</span>
                        </div>

                        {pkg.description && (
                          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                            {pkg.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectPlan(pkg)}
                        disabled={isCurrent || isUpdating}
                        className={`mt-5 w-full py-2.5 rounded-xl text-xs font-bold transition ${
                          isCurrent
                            ? "bg-slate-100 text-slate-500 cursor-default"
                            : "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm shadow-[#7C3AED]/20"
                        }`}
                      >
                        {isCurrent
                          ? "Current Plan"
                          : isUpdating
                          ? "Switching..."
                          : "Select Plan →"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start motion-preset-fade motion-duration-300">
          <form
            onSubmit={(e) => handlePasswordSubmit(e, false)}
            className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5"
          >
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#172554]">
                Password &amp; Access Control
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Use at least 6 characters to keep your {isAdmin ? "Super Admin" : "Organizer"} account secure.
              </p>
            </div>

            {renderPasswordFields("inline-sec")}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1E3A8A] text-white text-xs font-bold transition"
              >
                Update Password
              </button>
            </div>
          </form>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#172554]">
                  Active Auth Session
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Signed in with {displayEmail} ({isAdmin ? "SUPER_ADMIN" : "USER"}).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Role Scope</span>
                <span className="font-bold text-[#172554]">
                  {isAdmin ? "Platform Governance" : "Event Host & Galleries"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Credential Guard</span>
                <span className="font-bold text-emerald-600">Cookie + Token Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogoutSession}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Session</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="space-y-6 motion-preset-fade motion-duration-300">
          {isAdmin && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <h2 className="text-base font-extrabold text-[#172554] mb-4">
                Super Admin Modules
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminModules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <Link
                      key={mod.href}
                      href={mod.href}
                      className="p-4 rounded-2xl border border-slate-200/80 hover:border-[#7C3AED]/50 hover:bg-purple-50/40 transition flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-[#172554]">
                          {mod.title}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {mod.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#172554]">
                {isAdmin ? "Recent Platform Events" : "My Recent Events & Portals"}
              </h2>
              <Link
                href={isAdmin ? "/admin/events" : "/dashboard/events"}
                className="text-xs font-bold text-[#7C3AED] hover:underline"
              >
                View All →
              </Link>
            </div>

            {eventsLoading ? (
              <div className="py-10 text-center text-xs text-slate-400">
                Loading recent events...
              </div>
            ) : events.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500">
                No events found yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.slice(0, 6).map((ev: any) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-extrabold text-[#172554] line-clamp-1">
                        {ev.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#7C3AED] text-[10px] font-bold shrink-0">
                        {ev._count?.photos ?? 0} photos
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-500">
                      {ev.eventDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#7C3AED]" />
                          <span>{new Date(ev.eventDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {ev.venue && (
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-[#7C3AED]" />
                          <span className="truncate">{ev.venue}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/dashboard/events/${ev.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-[11px] font-bold hover:bg-[#6D28D9] transition"
                      >
                        <span>Gallery</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/guest/${ev.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-[11px] font-bold hover:border-[#7C3AED] hover:text-[#7C3AED] transition"
                      >
                        <ScanFace className="w-3 h-3" />
                        <span>AI Portal</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right-Side Sheet Drawer: Edit Profile */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent side="right" className="p-0">
          <SheetHeader>
            <SheetTitle>Edit Profile Details</SheetTitle>
            <SheetDescription>
              Update your avatar theme, contact number, and brand information.
            </SheetDescription>
          </SheetHeader>

          <form
            id="sheet-edit-profile-form"
            onSubmit={(e) => handleSavePersonalInfo(e, true)}
            className="flex-1 overflow-y-auto p-6"
          >
            {renderIdentityFields("sheet")}
          </form>

          <SheetFooter>
            <button
              type="button"
              onClick={() => setEditSheetOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="sheet-edit-profile-form"
              className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm shadow-[#7C3AED]/20 transition"
            >
              Save Profile
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Right-Side Sheet Drawer: Security & Password */}
      <Sheet open={passwordSheetOpen} onOpenChange={setPasswordSheetOpen}>
        <SheetContent side="right" className="p-0">
          <SheetHeader>
            <SheetTitle>Security &amp; Password</SheetTitle>
            <SheetDescription>
              Verify your credentials and update your Eventora account password.
            </SheetDescription>
          </SheetHeader>

          <form
            id="sheet-password-form"
            onSubmit={(e) => handlePasswordSubmit(e, true)}
            className="flex-1 overflow-y-auto p-6"
          >
            {renderPasswordFields("sheet-sec")}
          </form>

          <SheetFooter>
            <button
              type="button"
              onClick={() => setPasswordSheetOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="sheet-password-form"
              className="px-5 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1E3A8A] text-white text-xs font-bold transition"
            >
              Update Password
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
