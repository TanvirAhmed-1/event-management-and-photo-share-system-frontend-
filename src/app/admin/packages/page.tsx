import AdminPackages from "@/components/ui/admin/AdminPackages";

/**
 * Super Admin child route for managing cloud storage tiers and quotas.
 */
export default function AdminPackagesPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminPackages />
    </div>
  );
}
