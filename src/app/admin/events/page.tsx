import AdminEvents from "@/components/ui/admin/AdminEvents";

/**
 * Super Admin child route for inspecting platform events and bookings.
 */
export default function AdminEventsPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminEvents />
    </div>
  );
}
