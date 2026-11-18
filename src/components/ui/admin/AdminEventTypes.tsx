"use client";

import React, { useMemo, useState } from "react";
import {
  useGetAllEventTypesQuery,
  useToggleActiveEventTypeMutation,
  useCreateEventTypeMutation,
  useUpdateEventTypeMutation,
  useDeleteEventTypeMutation,
  EventType,
} from "@/redux/features/eventType/eventTypeApi";
import { useAppSelector } from "@/redux/hook";
import {
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Layers,
  Pencil,
  ShieldAlert,
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
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import CloudinaryImageUpload from "@/components/shared/CloudinaryImageUpload";
import ImageOptionSelector from "./ImageOptionSelector";

const EVENT_TYPE_PRESETS = [
  { label: "Wedding", url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop" },
  { label: "Birthday", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop" },
  { label: "Corporate", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop" },
];
import TableThumbnail from "@/components/shared/TableThumbnail";
import TablePagination, { paginateItems } from "@/components/shared/TablePagination";
import toast from "react-hot-toast";

interface EventTypeFormState {
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  minGuests: string;
  maxGuests: string;
  defaultGuests: string;
  displayOrder: string;
  allowServiceSelection: boolean;
  allowFoodSelection: boolean;
  isActive: boolean;
}

const INITIAL_FORM: EventTypeFormState = {
  name: "",
  slug: "",
  imageUrl: "",
  description: "",
  minGuests: "1",
  maxGuests: "",
  defaultGuests: "",
  displayOrder: "0",
  allowServiceSelection: true,
  allowFoodSelection: true,
  isActive: true,
};

const toIntOrNull = (val: string): number | null => {
  const trimmed = val.trim();
  if (!trimmed) return null;
  const parsed = parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

export default function AdminEventTypes() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthorized = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetAllEventTypesQuery({ includeInactive: true });
  const [toggleActive] = useToggleActiveEventTypeMutation();
  const [createEventType, { isLoading: isCreating }] = useCreateEventTypeMutation();
  const [updateEventType, { isLoading: isUpdating }] = useUpdateEventTypeMutation();
  const [deleteEventType] = useDeleteEventTypeMutation();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventType | null>(null);
  const [form, setForm] = useState<EventTypeFormState>(INITIAL_FORM);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const eventTypes = response?.data || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return eventTypes.filter(
      (et) =>
        !q ||
        et.name.toLowerCase().includes(q) ||
        et.slug.toLowerCase().includes(q) ||
        (et.description || "").toLowerCase().includes(q)
    );
  }, [eventTypes, search]);

  const { paginatedItems: paginatedEventTypes, safePage } = paginateItems(
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
          Only ADMIN and SUPER_ADMIN accounts can manage Event Types.
        </p>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(INITIAL_FORM);
    setModalOpen(true);
  };

  const openEditModal = (et: EventType) => {
    setEditingItem(et);
    setForm({
      name: et.name || "",
      slug: et.slug || "",
      imageUrl: et.imageUrl || et.coverImage || "",
      description: et.description || "",
      minGuests: et.minGuests !== undefined ? String(et.minGuests) : "1",
      maxGuests:
        et.maxGuests !== null && et.maxGuests !== undefined ? String(et.maxGuests) : "",
      defaultGuests:
        et.defaultGuests !== null && et.defaultGuests !== undefined
          ? String(et.defaultGuests)
          : "",
      displayOrder:
        et.displayOrder !== undefined ? String(et.displayOrder) : "0",
      allowServiceSelection: et.allowServiceSelection ?? true,
      allowFoodSelection: et.allowFoodSelection ?? true,
      isActive: Boolean(et.isActive),
    });
    setModalOpen(true);
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleActive(id).unwrap();
      toast.success("Event type status updated!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteEventType(deleteTarget.id).unwrap();
      toast.success("Event type deleted successfully!");
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete event type");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Please fill in name and slug");
      return;
    }

    const payload: Record<string, any> = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || undefined,
      imageUrl: form.imageUrl.trim() || null,
      minGuests: toIntOrNull(form.minGuests) ?? 1,
      maxGuests: toIntOrNull(form.maxGuests),
      defaultGuests: toIntOrNull(form.defaultGuests),
      displayOrder: toIntOrNull(form.displayOrder) ?? 0,
      allowServiceSelection: form.allowServiceSelection,
      allowFoodSelection: form.allowFoodSelection,
    };

    try {
      if (editingItem) {
        await updateEventType({
          id: editingItem.id,
          ...payload,
          isActive: form.isActive,
        }).unwrap();
        toast.success("Event type updated successfully!");
      } else {
        await createEventType(payload).unwrap();
        toast.success("Event type created successfully!");
      }
      setModalOpen(false);
      setEditingItem(null);
      setForm(INITIAL_FORM);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save event type");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7C3AED]" />
            Event Types Management
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic event categories available on Eventora with cover
            photography, guest limits, and planner options.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search event type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 w-56"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event Type</span>
          </button>
        </div>
      </div>

      {/* Shadcn Table */}
      <div className="rounded-xl border border-slate-200/80 overflow-hidden">
        <Table className="text-xs">
            <TableHeader className="bg-slate-50/90">
              <TableRow className="hover:bg-slate-50/90">
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Guests &amp; Options</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="w-11 h-11 rounded-xl bg-slate-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-24 h-4 rounded-md bg-slate-200 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-20 h-3 rounded-md bg-slate-200/70 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-48 h-3 rounded-md bg-slate-200/60 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-28 h-4 rounded-md bg-slate-200/60 animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="w-16 h-5 rounded-full bg-slate-200 animate-pulse" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="w-14 h-6 rounded-md bg-slate-200 ml-auto animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-slate-400">
                    No event types found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEventTypes.map((et) => {
                  const thumb = et.imageUrl || et.coverImage;
                  return (
                    <TableRow key={et.id}>
                      <TableCell className="py-2.5">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                          <TableThumbnail src={thumb} alt={et.name} />
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-[#172554]">
                        {et.name}
                      </TableCell>
                      <TableCell className="font-mono text-slate-500">
                        {et.slug}
                      </TableCell>
                      <TableCell className="text-slate-500 max-w-xs truncate">
                        {et.description || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                            Guests: {et.minGuests ?? 1}–{et.maxGuests ?? "∞"}
                          </span>
                          {et.allowServiceSelection && (
                            <span className="px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 text-[10px] font-medium">
                              Services
                            </span>
                          )}
                          {et.allowFoodSelection && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium">
                              Food
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleToggle(et.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                            et.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {et.isActive ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{et.isActive ? "ACTIVE" : "INACTIVE"}</span>
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(et)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#7C3AED] hover:bg-violet-50 transition"
                            title="Edit event type"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({ id: et.id, name: et.name })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete event type"
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

      {/* Create / Edit Event Type Shadcn Modal (Dialog) */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          onClose={() => setModalOpen(false)}
          className="max-w-xl max-h-[85vh] flex flex-col overflow-hidden p-0"
        >
          <DialogHeader className="px-5 pt-4 pb-3 mb-0 border-b border-slate-100 shrink-0">
            <DialogTitle>
              {editingItem
                ? `Edit Event Type: ${editingItem.name}`
                : "Create New Event Type"}
            </DialogTitle>
            <DialogDescription>
              Configure celebration category details, upload a cover photo,
              set guest limits, and manage planner selection permissions.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 max-h-[calc(85vh-7.75rem)]">
            <form
              id="admin-event-type-form"
              onSubmit={handleSave}
              className="p-4 sm:p-5 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Name *</Label>
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
                    placeholder="e.g. Mehendi Night"
                    required
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Slug *</Label>
                  <Input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="e.g. mehendi-night"
                    required
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs">Cover Photo</Label>
                <CloudinaryImageUpload
                  value={form.imageUrl}
                  onChange={(url) =>
                    setForm((prev) => ({ ...prev, imageUrl: url }))
                  }
                />
                <ImageOptionSelector
                  value={form.imageUrl}
                  onChange={(url) =>
                    setForm((prev) => ({ ...prev, imageUrl: url }))
                  }
                  presets={EVENT_TYPE_PRESETS}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Detailed summary of this celebration category..."
                  rows={3}
                  className="text-xs min-h-[76px]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <Label className="text-[11px]">Min Guests</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.minGuests}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, minGuests: e.target.value }))
                    }
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Max Guests</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.maxGuests}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, maxGuests: e.target.value }))
                    }
                    placeholder="∞"
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Default Guests</Label>
                  <Input
                    type="number"
                    min="1"
                    value={form.defaultGuests}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, defaultGuests: e.target.value }))
                    }
                    placeholder="Optional"
                    className="text-xs h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Display Order</Label>
                  <Input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, displayOrder: e.target.value }))
                    }
                    className="text-xs h-8"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-[#172554]">
                      Allow Service Selection
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Let planners attach catalog services to this event type.
                    </p>
                  </div>
                  <Switch
                    checked={form.allowServiceSelection}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({
                        ...prev,
                        allowServiceSelection: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <div>
                    <p className="text-xs font-semibold text-[#172554]">
                      Allow Food &amp; Catering Selection
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Let planners add menu items &amp; catering packages.
                    </p>
                  </div>
                  <Switch
                    checked={form.allowFoodSelection}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({ ...prev, allowFoodSelection: checked }))
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
                        Visible across storefront &amp; planner forms when enabled.
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
              form="admin-event-type-form"
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : editingItem
                ? "Update Event Type"
                : "Create Event Type"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Event Type?"
        description={`Are you sure you want to delete "${deleteTarget?.name || ""}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
