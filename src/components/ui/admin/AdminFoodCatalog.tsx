"use client";

import React, { useMemo, useState } from "react";
import {
  useGetAllFoodItemsQuery,
  useGetAllFoodCategoriesQuery,
  useCreateFoodCategoryMutation,
  useToggleActiveFoodItemMutation,
  useCreateFoodItemMutation,
  useUpdateFoodItemMutation,
  useDeleteFoodItemMutation,
  FoodItem,
} from "@/redux/features/food/foodApi";
import { useAppSelector } from "@/redux/hook";
import {
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Utensils,
  Pencil,
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
import ImageOptionSelector from "./ImageOptionSelector";

const FOOD_PRESETS = [
  { label: "Kacchi Biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop" },
  { label: "Meat & Roast", url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop" },
  { label: "Desserts", url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop" },
];
import TableThumbnail from "@/components/shared/TableThumbnail";
import TablePagination, { paginateItems } from "@/components/shared/TablePagination";
import toast from "react-hot-toast";

const PRESET_DIETARY_LABELS = [
  "HALAL",
  "NON_VEG",
  "VEG",
  "SPICY",
  "CHEF_SPECIAL",
  "GLUTEN_FREE",
];

interface FoodFormState {
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  images: string[];
  pricePerPerson: string;
  dietaryLabels: string[];
  customDietary: string;
  minOrderQuantity: string;
  maxOrderQuantity: string;
  allowQuantityOverride: boolean;
  isActive: boolean;
}

const INITIAL_FORM: FoodFormState = {
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  images: [],
  pricePerPerson: "",
  dietaryLabels: ["HALAL"],
  customDietary: "",
  minOrderQuantity: "1",
  maxOrderQuantity: "",
  allowQuantityOverride: false,
  isActive: true,
};

const toIntOrNull = (val: string): number | null => {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const parsed = parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export default function AdminFoodCatalog() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthorized = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const {
    data: foodRes,
    isLoading,
    refetch,
  } = useGetAllFoodItemsQuery({ includeInactive: true });
  const { data: categoriesRes, refetch: refetchCategories } =
    useGetAllFoodCategoriesQuery({ includeInactive: true });

  const [toggleActive] = useToggleActiveFoodItemMutation();
  const [createFoodItem, { isLoading: isCreating }] = useCreateFoodItemMutation();
  const [updateFoodItem, { isLoading: isUpdating }] = useUpdateFoodItemMutation();
  const [deleteFoodItem] = useDeleteFoodItemMutation();
  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateFoodCategoryMutation();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [form, setForm] = useState<FoodFormState>(INITIAL_FORM);

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const items = foodRes?.data || [];
  const categories = categoriesRes?.data || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((f) => {
      const matchesQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q) ||
        (f.category?.name || "").toLowerCase().includes(q) ||
        (f.description || "").toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "ALL" || f.categoryId === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && f.isActive) ||
        (statusFilter === "INACTIVE" && !f.isActive);

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  const { paginatedItems: paginatedFood, safePage } = paginateItems(
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
          Only ADMIN and SUPER_ADMIN accounts can manage the Food &amp; Catering Catalog.
        </p>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(INITIAL_FORM);
    setShowNewCategory(false);
    setModalOpen(true);
  };

  const openEditModal = (f: FoodItem) => {
    setEditingItem(f);
    const existingLabels = Array.isArray(f.dietaryLabels) ? f.dietaryLabels : [];
    const customExtras = existingLabels.filter(
      (lbl) => !PRESET_DIETARY_LABELS.includes(lbl)
    );
    setForm({
      name: f.name || "",
      slug: f.slug || "",
      categoryId: f.categoryId || "",
      description: f.description || "",
      images: Array.isArray(f.images) ? f.images : [],
      pricePerPerson:
        f.pricePerPerson !== null && f.pricePerPerson !== undefined
          ? String(f.pricePerPerson)
          : "",
      dietaryLabels: existingLabels.filter((lbl) =>
        PRESET_DIETARY_LABELS.includes(lbl)
      ),
      customDietary: customExtras.join(", "),
      minOrderQuantity:
        f.minOrderQuantity !== undefined ? String(f.minOrderQuantity) : "1",
      maxOrderQuantity:
        f.maxOrderQuantity !== null && f.maxOrderQuantity !== undefined
          ? String(f.maxOrderQuantity)
          : "",
      allowQuantityOverride: Boolean(f.allowQuantityOverride),
      isActive: Boolean(f.isActive),
    });
    setShowNewCategory(false);
    setModalOpen(true);
  };

  const toggleDietaryLabel = (label: string) => {
    setForm((prev) => ({
      ...prev,
      dietaryLabels: prev.dietaryLabels.includes(label)
        ? prev.dietaryLabels.filter((l) => l !== label)
        : [...prev.dietaryLabels, label],
    }));
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
      toast.success("Food item status updated!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update food item");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteFoodItem(deleteTarget.id).unwrap();
      toast.success("Food item deleted successfully!");
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete food item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId || !form.pricePerPerson.trim()) {
      toast.error("Please fill in item name, category, and price per person.");
      return;
    }

    const customTags = form.customDietary
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const mergedDietary = Array.from(new Set([...form.dietaryLabels, ...customTags]));

    const payload: Record<string, any> = {
      name: form.name.trim(),
      slug:
        form.slug.trim() ||
        form.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      categoryId: form.categoryId,
      description: form.description.trim() || undefined,
      images: form.images.filter(Boolean),
      pricePerPerson: parseFloat(form.pricePerPerson),
      dietaryLabels: mergedDietary,
      minOrderQuantity: toIntOrNull(form.minOrderQuantity) ?? 1,
      maxOrderQuantity: toIntOrNull(form.maxOrderQuantity),
      allowQuantityOverride: form.allowQuantityOverride,
    };

    try {
      if (editingItem) {
        await updateFoodItem({
          id: editingItem.id,
          ...payload,
          isActive: form.isActive,
        }).unwrap();
        toast.success("Food item updated successfully!");
      } else {
        await createFoodItem(payload).unwrap();
        toast.success("Food item added successfully!");
      }
      setModalOpen(false);
      setEditingItem(null);
      setForm(INITIAL_FORM);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save food item");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#7C3AED]" />
            Food &amp; Catering Catalog
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authentic dishes, per-plate pricing, order limits, and dietary
            categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Food Item</span>
        </button>
      </div>

      {/* Horizontal Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search dish name, slug, category..."
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
                <TableHead>Dish</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price / Person</TableHead>
                <TableHead>Order Limits</TableHead>
                <TableHead>Dietary Labels</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-200 animate-pulse shrink-0" />
                        <div className="space-y-1.5">
                          <div className="w-28 h-3.5 rounded bg-slate-200 animate-pulse" />
                          <div className="w-20 h-2.5 rounded bg-slate-100 animate-pulse" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-5 rounded-full bg-slate-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-16 h-4 rounded bg-slate-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-24 h-4 rounded bg-slate-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-5 rounded-full bg-slate-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-16 h-5 rounded-full bg-slate-200 animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="w-14 h-6 rounded bg-slate-200 ml-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-slate-400">
                    No food items found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedFood.map((f) => {
                  const img =
                    (Array.isArray(f.images) && f.images[0]) || f.coverImage || null;
                  const labels = Array.isArray(f.dietaryLabels) ? f.dietaryLabels : [];

                  return (
                    <TableRow key={f.id}>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <TableThumbnail src={img} alt={f.name} />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[#172554] block truncate max-w-[200px]">
                              {f.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[200px]">
                              {f.slug}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          {f.category?.name || "Unassigned"}
                        </span>
                      </TableCell>

                      <TableCell className="font-bold text-[#172554]">
                        ৳{Number(f.pricePerPerson || 0).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                            Qty: {f.minOrderQuantity ?? 1}–{f.maxOrderQuantity ?? "∞"}
                          </span>
                          {f.allowQuantityOverride && (
                            <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 text-[10px] font-medium">
                              Flexible
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {labels.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {labels.map((lbl) => (
                              <span
                                key={lbl}
                                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  lbl === "VEG" || lbl === "HALAL"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-800"
                                }`}
                              >
                                {lbl}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleToggle(f.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                            f.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {f.isActive ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{f.isActive ? "ACTIVE" : "INACTIVE"}</span>
                        </button>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(f)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#7C3AED] hover:bg-violet-50 transition"
                            title="Edit food item"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({ id: f.id, name: f.name })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete food item"
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

      {/* Create / Edit Food Item Shadcn Modal (Dialog) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          onClose={() => setModalOpen(false)}
          className="max-w-xl max-h-[85vh] flex flex-col overflow-hidden p-0"
        >
          <DialogHeader className="px-5 pt-4 pb-3 mb-0 border-b border-slate-100 shrink-0">
            <DialogTitle>
              {editingItem
                ? `Edit Food Item: ${editingItem.name}`
                : "Add Dish / Food Item"}
            </DialogTitle>
            <DialogDescription>
              Configure dish details, upload photos, per-person pricing, order
              limits, and dietary labels.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 max-h-[calc(85vh-7.75rem)]">
            <form
              id="admin-food-form"
              onSubmit={handleSave}
              className="p-4 sm:p-5 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Item Name *</Label>
                  <Input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((prev) => ({
                        ...prev,
                        name: val,
                        slug:
                          !editingItem && !prev.slug
                            ? val
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")
                            : prev.slug,
                      }));
                    }}
                    placeholder="e.g. Mutton Kacchi Biryani"
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
                    placeholder="mutton-kacchi-biryani"
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Category *</Label>
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
                      placeholder="New food category name..."
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
                  value={form.categoryId}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, categoryId: v }))
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Price / Person (৳) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.pricePerPerson}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pricePerPerson: e.target.value,
                      }))
                    }
                    placeholder="120"
                    required
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Min Order Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.minOrderQuantity}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        minOrderQuantity: e.target.value,
                      }))
                    }
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Max Order Qty</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.maxOrderQuantity}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        maxOrderQuantity: e.target.value,
                      }))
                    }
                    placeholder="∞"
                    className="text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs">Dish Photos</Label>
                <CloudinaryImageUpload
                  multiple
                  values={form.images}
                  onChangeMany={(urls) =>
                    setForm((prev) => ({ ...prev, images: urls }))
                  }
                />
                <ImageOptionSelector
                  value={form.images[0] || ""}
                  onChange={(url) =>
                    setForm((prev) => ({
                      ...prev,
                      images: url ? [url, ...prev.images.slice(1)] : prev.images.slice(1),
                    }))
                  }
                  presets={FOOD_PRESETS}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Dietary Labels</Label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_DIETARY_LABELS.map((lbl) => {
                    const active = form.dietaryLabels.includes(lbl);
                    return (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => toggleDietaryLabel(lbl)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
                          active
                            ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:border-violet-300"
                        }`}
                      >
                        {lbl}
                      </button>
                    );
                  })}
                </div>
                <Input
                  type="text"
                  value={form.customDietary}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, customDietary: e.target.value }))
                  }
                  placeholder="Optional custom labels (comma-separated, e.g. DAIRY_FREE)"
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description / Ingredients</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Slow-cooked tender mutton with aromatic basmati rice..."
                  rows={3}
                  className="text-xs min-h-[76px]"
                />
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-[#172554]">
                      Allow Quantity Override
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Let planners customize plate count independently of guest count.
                    </p>
                  </div>
                  <Switch
                    checked={form.allowQuantityOverride}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        allowQuantityOverride: checked,
                      }))
                    }
                  />
                </div>

                {editingItem && (
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5">
                    <div>
                      <p className="text-xs font-semibold text-[#172554]">
                        Active Status
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Available in catering menus when enabled.
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
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              form="admin-food-form"
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : editingItem
                ? "Update Food Item"
                : "Add Food Item"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Food Item?"
        description={`Are you sure you want to delete "${deleteTarget?.name || ""}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
