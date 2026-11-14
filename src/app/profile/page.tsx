"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import DashboardLayout from "@/app/dashboard/layout";
import AdminLayout from "@/app/admin/layout";
import DashboardProfileView, {
  ProfileTab,
} from "@/components/shared/DashboardProfileView";

function UnifiedProfileContent() {
  const searchParams = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const tabParam = searchParams.get("tab");

  const validTab: ProfileTab =
    tabParam === "storage" ||
    tabParam === "security" ||
    tabParam === "activity" ||
    tabParam === "personal"
      ? tabParam
      : "personal";

  const LayoutShell =
    user?.role === "SUPER_ADMIN" ? AdminLayout : DashboardLayout;

  return (
    <LayoutShell>
      <DashboardProfileView initialTab={validTab} />
    </LayoutShell>
  );
}

/**
 * Unified `/profile` route that mounts the role-appropriate Left Sidebar layout (Admin or Host).
 */
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-400">
          Loading profile workspace...
        </div>
      }
    >
      <UnifiedProfileContent />
    </Suspense>
  );
}
