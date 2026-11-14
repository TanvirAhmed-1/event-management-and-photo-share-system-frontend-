import AdminFoodCatalog from "@/components/ui/admin/AdminFoodCatalog";

/**
 * Super Admin child route for managing food and catering menu packages.
 */
export default function AdminFoodPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <AdminFoodCatalog />
    </div>
  );
}
