"use client";

import React, { useMemo, useState } from "react";
import {
  useGetAllServicesQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useToggleActiveServiceMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useCreateServicePackageMutation,
  useDeleteServicePackageMutation,
  ServiceItem,
  ServicePackageItem,
} from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useAppSelector } from "@/redux/hook";
import {
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Wrench,
  Pencil,
  Package,
  Sparkles,
  Store,
  ShieldAlert,
  FolderPlus,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import CloudinaryImageUpload from "@/components/shared/CloudinaryImageUpload";
import TableThumbnail from "@/components/shared/TableThumbnail";
import TablePagination, { paginateItems } from "@/components/shared/TablePagination";
import toast from "react-hot-toast";

type PricingModel = ServiceItem["pricingModel"];
type AiPhotoMode = NonNullable<ServiceItem["aiPhotoShareMode"]>;

const PRICING_MODELS: PricingModel[] = [
  "FIXED",
  "PER_PERSON",
  "PER_HOUR",
  "PER_DAY",
  "PER_UNIT",
  "CUSTOM_QUOTATION",
];

const AI_MODES: AiPhotoMode[] = ["NONE", "INCLUDED", "ADDON"];

interface ServiceFormState {
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  images: string[];
  pricingModel: PricingModel;
  basePrice: string;
  unitLabel: string;
  minQuantity: string;
  maxQuantity: string;
  minHours: string;
  maxHours: string;
  minDays: string;
  maxDays: string;
  isVendorBased: boolean;
  aiPhotoShareMode: AiPhotoMode;
  aiAddonPrice: string;
  defaultStoragePlanId: string;
  isActive: boolean;
}

const INITIAL_FORM: ServiceFormState = {
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  images: [],
  pricingModel: "FIXED",
  basePrice: "",
  unitLabel: "",
  minQuantity: "1",
  maxQuantity: "",
  minHours: "",
  maxHours: "",
  minDays: "",
  maxDays: "",
  isVendorBased: false,
  aiPhotoShareMode: "NONE",
  aiAddonPrice: "",
  defaultStoragePlanId: "",
  isActive: true,
};

const toIntOrNull = (val: string): number | null => {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const parsed = parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const toFloatOrNull = (val: string): number | null => {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const parsed = parseFloat(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
};

export default function AdminServices() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthorized = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const {
    data: servicesRes,
    isLoading,
    refetch,
  } = useGetAllServicesQuery({ includeInactive: true });
  const { data: categoriesRes, refetch: refetchCategories } =
    useGetAllCategoriesQuery({ includeInactive: true });
  const { data: storagePlansRes } = useGetAllPackagesQuery(undefined);

  const [toggleActive] = useToggleActiveServiceMutation();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();
  const [createServicePackage, { isLoading: isCreatingPkg }] =
    useCreateServicePackageMutation();
  const [deleteServicePackage] = useDeleteServicePackageMutation();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState<ServiceFormState>(INITIAL_FORM);

  // Inline quick category creation inside Service Sheet
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Service delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Service Packages management sheet
  const [pkgSheetService, setPkgSheetService] = useState<ServiceItem | null>(null);
  const [pkgName, setPkgName] = useState("");
  const [pkgPricingModel, setPkgPricingModel] = useState<PricingModel>("FIXED");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgDescription, setPkgDescription] = useState("");
  const [pkgFeaturesText, setPkgFeaturesText] = useState("");
  const [deletePkgTarget, setDeletePkgTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeletingPkg, setIsDeletingPkg] = useState(false);

  const services = servicesRes?.data || [];
  const categories = categoriesRes?.data || [];
  const storagePlans = storagePlansRes?.data || [];

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        (s.category?.name || "").toLowerCase().includes(q) ||
        (s.description || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "ALL" || s.categoryId === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && s.isActive) ||
        (statusFilter === "INACTIVE" && !s.isActive);

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [services, search, categoryFilter, statusFilter]);

  const { paginatedItems: paginatedServices, safePage } = paginateItems(
    filtered,
    currentPage
  );

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#172554]">
          Admin or Super Admin Access Only
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Only ADMIN and SUPER_ADMIN accounts can manage Event Services.
        </p>
      </div>
    );
  }

  const openCreateSheet = () => {
    setEditingService(null);
    setForm(INITIAL_FORM);
    setShowNewCategory(false);
    setSheetOpen(true);
  };

  const openEditSheet = (s: ServiceItem) => {
    setEditingService(s);
    setForm({
      name: s.name || "",
      slug: s.slug || "",
      categoryId: s.categoryId || "",
      description: s.description || "",
      images: Array.isArray(s.images) ? s.images : [],
      pricingModel: s.pricingModel || "FIXED",
      basePrice:
        s.basePrice !== null && s.basePrice !== undefined ? String(s.basePrice) : "",
      unitLabel: s.unitLabel || "",
      minQuantity:
        s.minQuantity !== null && s.minQuantity !== undefined
          ? String(s.minQuantity)
          : "1",
      maxQuantity:
        s.maxQuantity !== null && s.maxQuantity !== undefined
          ? String(s.maxQuantity)
          : "",
      minHours:
        s.minHours !== null && s.minHours !== undefined ? String(s.minHours) : "",
      maxHours:
        s.maxHours !== null && s.maxHours !== undefined ? String(s.maxHours) : "",
      minDays: s.minDays !== null && s.minDays !== undefined ? String(s.minDays) : "",
      maxDays: s.maxDays !== null && s.maxDays !== undefined ? String(s.maxDays) : "",
      isVendorBased: Boolean(s.isVendorBased),
      aiPhotoShareMode: s.aiPhotoShareMode || "NONE",
      aiAddonPrice:
        s.aiAddonPrice !== null && s.aiAddonPrice !== undefined
          ? String(s.aiAddonPrice)
          : "",
      defaultStoragePlanId: s.defaultStoragePlanId || "",
      isActive: Boolean(s.isActive),
    });
    setShowNewCategory(false);
    setSheetOpen(true);
  };

  const handleCreateQuickCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (trimmed.length < 2) {
      toast.error("Category name must be at least 2 characters.");
      return;
    }
    try {
      const res = await createCategory({ name: trimmed }).unwrap();
      toast.success(`Category "${trimmed}" created!`);
      setNewCategoryName("");
      setShowNewCategory(false);
      await refetchCategories();
      if (res?.data?.id) {
        setForm((prev) => ({ ...prev, categoryId: res.data.id }));
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleActive(id).unwrap();
      toast.success("Service status updated!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update service");
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Service name is required.");
      return;
    }
    if (form.pricingModel !== "CUSTOM_QUOTATION" && !form.basePrice.trim()) {
      toast.error("Base price is required for this pricing model.");
      return;
    }

    const images = form.images.filter(Boolean);

    const payload: Record<string, any> = {
      name: form.name.trim(),
      slug:
        form.slug.trim() ||
        form.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      categoryId: form.categoryId || null,
      description: form.description.trim() || undefined,
      images,
      pricingModel: form.pricingModel,
      basePrice: toFloatOrNull(form.basePrice),
      unitLabel: form.unitLabel.trim() || null,
      minQuantity: toIntOrNull(form.minQuantity) ?? 1,
      maxQuantity: toIntOrNull(form.maxQuantity),
      minHours: toIntOrNull(form.minHours),
      maxHours: toIntOrNull(form.maxHours),
      minDays: toIntOrNull(form.minDays),
      maxDays: toIntOrNull(form.maxDays),
      isVendorBased: form.isVendorBased,
      aiPhotoShareMode: form.aiPhotoShareMode,
      aiAddonPrice:
        form.aiPhotoShareMode === "ADDON" ? toFloatOrNull(form.aiAddonPrice) : null,
      defaultStoragePlanId: form.defaultStoragePlanId || null,
    };

    try {
      if (editingService) {
        await updateService({
          id: editingService.id,
          ...payload,
          isActive: form.isActive,
        }).unwrap();
        toast.success("Service updated successfully!");
      } else {
        await createService(payload).unwrap();
        toast.success("Service created successfully!");
      }
      setSheetOpen(false);
      setEditingService(null);
      setForm(INITIAL_FORM);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save service");
    }
  };

  const confirmDeleteService = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteService(deleteTarget.id).unwrap();
      toast.success("Service deleted successfully!");
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  // Service Packages handlers
  const activePkgService = pkgSheetService
    ? services.find((s) => s.id === pkgSheetService.id) || pkgSheetService
    : null;

  const handleAddServicePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePkgService) return;
    if (!pkgName.trim()) {
      toast.error("Package name is required.");
      return;
    }
    const features = pkgFeaturesText
      .split(/[\n,]+/)
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      await createServicePackage({
        serviceId: activePkgService.id,
        name: pkgName.trim(),
        description: pkgDescription.trim() || undefined,
        pricingModel: pkgPricingModel,
        price: toFloatOrNull(pkgPrice),
        features,
      }).unwrap();
      toast.success("Service package added!");
      setPkgName("");
      setPkgPrice("");
      setPkgDescription("");
      setPkgFeaturesText("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add package");
    }
  };

  const confirmDeletePackage = async () => {
    if (!deletePkgTarget) return;
    setIsDeletingPkg(true);
    try {
      await deleteServicePackage(deletePkgTarget.id).unwrap();
      toast.success("Service package deleted!");
      setDeletePkgTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete package");
    } finally {
      setIsDeletingPkg(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#7C3AED]" />
            Event Services Management
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, configure pricing, limits, AI Photo Share, and packages for all
            event services.
          </p>
        </div>

        <button
          onClick={openCreateSheet}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Horizontal Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search service name, slug, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-white w-full"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            className="w-full sm:w-44 shrink-0"
          >
            <SelectTrigger className="h-9 text-xs bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "ALL" | "ACTIVE" | "INACTIVE")}
            className="w-full sm:w-36 shrink-0"
          >
            <SelectTrigger className="h-9 text-xs bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Shadcn Table */}
      <div className="rounded-xl border border-slate-200/80 overflow-hidden">
        <Table className="text-xs">
          <TableHeader className="bg-slate-50/90">
            <TableRow className="hover:bg-slate-50/90">
              <TableHead className="w-[260px]">Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Pricing & Unit</TableHead>
              <TableHead>Limits & Options</TableHead>
              <TableHead>Packages</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-200 animate-pulse shrink-0" />
                      <div className="space-y-1.5">
                        <div className="w-32 h-3.5 rounded bg-slate-200 animate-pulse" />
                        <div className="w-20 h-2.5 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-20 h-5 rounded-full bg-slate-200 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-4 rounded bg-slate-200 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="w-28 h-4 rounded bg-slate-200 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-5 rounded bg-slate-200 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-6 rounded-full bg-slate-200 animate-pulse" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="w-20 h-7 rounded bg-slate-200 ml-auto animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-slate-400">
                  No services found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedServices.map((s) => {
                const img =
                  (Array.isArray(s.images) && s.images[0]) || s.coverImage || null;
                const pkgCount = s.packages?.length || 0;
                const eventCount = s._count?.eventTypes || 0;

                return (
                  <TableRow key={s.id}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <TableThumbnail src={img} alt={s.name} />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-[#172554] block truncate max-w-[200px]">
                            {s.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[200px]">
                            {s.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {s.category?.name || "Unassigned"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-[#172554]">
                        {s.pricingModel === "CUSTOM_QUOTATION"
                          ? "Custom Quote"
                          : `৳${Number(s.basePrice || 0).toLocaleString()}`}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {s.pricingModel}
                        {s.unitLabel ? ` · ${s.unitLabel}` : ""}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                          Qty: {s.minQuantity ?? 1}–{s.maxQuantity ?? "∞"}
                        </span>
                        {(s.minHours || s.maxHours) && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px]">
                            Hrs: {s.minHours ?? 0}–{s.maxHours ?? "∞"}
                          </span>
                        )}
                        {(s.minDays || s.maxDays) && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px]">
                            Days: {s.minDays ?? 0}–{s.maxDays ?? "∞"}
                          </span>
                        )}
                        {s.isVendorBased && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium">
                            <Store className="w-2.5 h-2.5" />
                            Vendor
                          </span>
                        )}
                        {s.aiPhotoShareMode && s.aiPhotoShareMode !== "NONE" && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 text-[10px] font-medium">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI: {s.aiPhotoShareMode}
                            {s.aiPhotoShareMode === "ADDON" && s.aiAddonPrice
                              ? ` (৳${Number(s.aiAddonPrice).toLocaleString()})`
                              : ""}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setPkgSheetService(s)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 hover:text-violet-700 text-[11px] font-semibold transition"
                        title="Manage Service Packages"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>{pkgCount} pkg</span>
                      </button>
                      {eventCount > 0 && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {eventCount} event type{eventCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleToggle(s.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                          s.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {s.isActive ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{s.isActive ? "ACTIVE" : "INACTIVE"}</span>
                      </button>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditSheet(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#7C3AED] hover:bg-violet-50 transition"
                          title="Edit service"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ id: s.id, name: s.name })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={safePage}
        totalItems={filtered.length}
        onPageChange={setCurrentPage}
      />

      {/* Create / Edit Service Shadcn Modal (Dialog) */}
      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent
          onClose={() => setSheetOpen(false)}
          className="max-w-2xl max-h-[85vh] flex flex-col overflow-hidden p-0"
        >
          <DialogHeader className="px-5 pt-4 pb-3 mb-0 border-b border-slate-100 shrink-0">
            <DialogTitle>
              {editingService ? `Edit Service: ${editingService.name}` : "Add Event Service"}
            </DialogTitle>
            <DialogDescription>
              Configure service details, upload photos, pricing model,
              limits, vendor &amp; AI Photo Share options.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 max-h-[calc(85vh-7.75rem)]">
            <form
              id="admin-service-form"
              onSubmit={handleSaveService}
              className="p-4 sm:p-5 space-y-3.5"
            >
            {/* Basic Info */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Basic Information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Service Name *</Label>
                  <Input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        name: val,
                        slug:
                          !editingService && !prev.slug
                            ? val
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")
                            : prev.slug,
                      }));
                    }}
                    placeholder="e.g. Drone Videography"
                    required
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Slug</Label>
                  <Input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="drone-videography"
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Service Category</Label>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory((v) => !v)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7C3AED] hover:underline"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>{showNewCategory ? "Cancel" : "+ New Category"}</span>
                  </button>
                </div>

                {showNewCategory && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-violet-50/70 border border-violet-200">
                    <Input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name..."
                      className="h-8 text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleCreateQuickCategory}
                      disabled={isCreatingCategory}
                      className="px-3 h-8 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shrink-0 disabled:opacity-50"
                    >
                      {isCreatingCategory ? "..." : "Create"}
                    </button>
                  </div>
                )}

                <Select
                  value={form.categoryId || "NONE"}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, categoryId: v === "NONE" ? "" : v }))
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Unassigned</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Deliverables, equipment specs, turnaround time..."
                  rows={3}
                  className="text-xs min-h-[72px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Service Photos</Label>
                <CloudinaryImageUpload
                  multiple
                  values={form.images}
                  onChangeMany={(urls) =>
                    setForm((prev) => ({ ...prev, images: urls }))
                  }
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pricing & Units
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Pricing Model *</Label>
                  <Select
                    value={form.pricingModel}
                    onValueChange={(v) =>
                      setForm((prev) => ({ ...prev, pricingModel: v as PricingModel }))
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Base Price (৳) {form.pricingModel !== "CUSTOM_QUOTATION" ? "*" : ""}
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.basePrice}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, basePrice: e.target.value }))
                    }
                    placeholder="5000"
                    required={form.pricingModel !== "CUSTOM_QUOTATION"}
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Unit Label</Label>
                  <Input
                    type="text"
                    value={form.unitLabel}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, unitLabel: e.target.value }))
                    }
                    placeholder="e.g. per camera"
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </div>

            {/* Quantity / Hours / Days Limits */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quantity & Duration Limits
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Min Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.minQuantity}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, minQuantity: e.target.value }))
                    }
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Max Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.maxQuantity}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, maxQuantity: e.target.value }))
                    }
                    placeholder="∞"
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Min Hours</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.minHours}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, minHours: e.target.value }))
                    }
                    placeholder="Optional"
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Max Hours</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.maxHours}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, maxHours: e.target.value }))
                    }
                    placeholder="Optional"
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Min Days</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.minDays}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, minDays: e.target.value }))
                    }
                    placeholder="Optional"
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Max Days</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.maxDays}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, maxDays: e.target.value }))
                    }
                    placeholder="Optional"
                    className="text-xs h-8"
                  />
                </div>
              </div>
            </div>

            {/* AI Photo Share, Vendor & Status */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                AI Photo Share & Vendor Options
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">AI Photo Share Mode</Label>
                  <Select
                    value={form.aiPhotoShareMode}
                    onValueChange={(v) =>
                      setForm((prev) => ({
                        ...prev,
                        aiPhotoShareMode: v as AiPhotoMode,
                      }))
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {form.aiPhotoShareMode === "ADDON" ? (
                  <div className="space-y-1.5">
                    <Label className="text-xs">AI Addon Price (৳)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.aiAddonPrice}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, aiAddonPrice: e.target.value }))
                      }
                      placeholder="1500"
                      className="text-xs h-9"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Default Storage Plan</Label>
                    <Select
                      value={form.defaultStoragePlanId || "NONE"}
                      onValueChange={(v) =>
                        setForm((prev) => ({
                          ...prev,
                          defaultStoragePlanId: v === "NONE" ? "" : v,
                        }))
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">None</SelectItem>
                        {storagePlans.map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.storageLimitMB} MB)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-[#172554]">Vendor Based</p>
                  <p className="text-[10px] text-slate-500">
                    Require or allow selecting an external vendor for this service.
                  </p>
                </div>
                <Switch
                  checked={form.isVendorBased}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isVendorBased: checked }))
                  }
                />
              </div>

              {editingService && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-[#172554]">Active Status</p>
                    <p className="text-[10px] text-slate-500">
                      Visible to planners when enabled.
                    </p>
                  </div>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>
              )}
            </div>
          </form>
          </ScrollArea>

          <DialogFooter className="mt-0 px-5 py-3 bg-slate-50/70 shrink-0">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              form="admin-service-form"
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : editingService
                ? "Update Service"
                : "Create Service"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Service Packages Shadcn Modal (Dialog) */}
      <Dialog
        open={Boolean(activePkgService)}
        onOpenChange={(open) => !open && setPkgSheetService(null)}
      >
        <DialogContent
          onClose={() => setPkgSheetService(null)}
          className="max-w-xl max-h-[85vh] flex flex-col overflow-hidden p-0"
        >
          <DialogHeader className="px-5 pt-4 pb-3 mb-0 border-b border-slate-100 shrink-0">
            <DialogTitle>Packages — {activePkgService?.name}</DialogTitle>
            <DialogDescription>
              Add or remove tiered packages (e.g. Basic, Standard, Royal) under this
              service.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 max-h-[calc(85vh-5rem)]">
            <div className="p-4 sm:p-5 space-y-4">
            {/* Existing packages list */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Existing Packages ({activePkgService?.packages?.length || 0})
              </p>

              {!activePkgService?.packages || activePkgService.packages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  No packages added to this service yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {activePkgService.packages.map((pkg: ServicePackageItem) => (
                    <div
                      key={pkg.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50/50"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#172554]">
                            {pkg.name}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-50 text-violet-700">
                            {pkg.pricingModel}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#7C3AED] mt-0.5">
                          {pkg.price !== null && pkg.price !== undefined
                            ? `৳${Number(pkg.price).toLocaleString()}`
                            : "Custom Quote"}
                        </p>
                        {pkg.description && (
                          <p className="text-[11px] text-slate-500 mt-1">
                            {pkg.description}
                          </p>
                        )}
                        {pkg.features?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {pkg.features.map((f, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setDeletePkgTarget({ id: pkg.id, name: pkg.name })
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                        title="Delete package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add new package form */}
            <form
              onSubmit={handleAddServicePackage}
              className="space-y-3 pt-4 border-t border-slate-100"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Add New Package
              </p>

              <div className="space-y-1.5">
                <Label className="text-xs">Package Name *</Label>
                <Input
                  type="text"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="e.g. Royal Cinematic Tier"
                  required
                  className="text-xs h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Pricing Model</Label>
                  <Select
                    value={pkgPricingModel}
                    onValueChange={(v) => setPkgPricingModel(v as PricingModel)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICING_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Price (৳)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(e.target.value)}
                    placeholder="15000"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Input
                  type="text"
                  value={pkgDescription}
                  onChange={(e) => setPkgDescription(e.target.value)}
                  placeholder="Short package summary"
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Features (comma or newline separated)</Label>
                <Textarea
                  value={pkgFeaturesText}
                  onChange={(e) => setPkgFeaturesText(e.target.value)}
                  placeholder="4K Drone, 2 Photographers, Same-day teaser"
                  rows={2}
                  className="text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingPkg}
                className="w-full py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold disabled:opacity-50 transition"
              >
                {isCreatingPkg ? "Adding..." : "Add Package"}
              </button>
            </form>
          </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Service Confirmation */}
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Event Service?"
        description={`Are you sure you want to delete "${deleteTarget?.name || ""}"? Any unassigned package links will also be removed.`}
        isLoading={isDeleting}
        onConfirm={confirmDeleteService}
      />

      {/* Delete Service Package Confirmation */}
      <DeleteConfirmDialog
        open={Boolean(deletePkgTarget)}
        onOpenChange={(open) => !open && setDeletePkgTarget(null)}
        title="Delete Service Package?"
        description={`Are you sure you want to delete package "${deletePkgTarget?.name || ""}"?`}
        isLoading={isDeletingPkg}
        onConfirm={confirmDeletePackage}
      />
    </div>
  );
}
