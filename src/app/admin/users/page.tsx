import AdminUsers from "@/components/ui/admin/AdminUsers";

/**
 * Super Admin child route for managing organizer accounts and active status.
 */
export default function AdminUsersPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminUsers />
    </div>
  );
}
