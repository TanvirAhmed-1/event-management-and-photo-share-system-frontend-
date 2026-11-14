import AdminEventTypes from "@/components/ui/admin/AdminEventTypes";

/**
 * Super Admin child route for managing dynamic event type categories.
 */
export default function AdminEventTypesPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminEventTypes />
    </div>
  );
}
