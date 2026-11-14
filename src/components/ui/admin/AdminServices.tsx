"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  useGetAllServicesQuery,
  useGetAllCategoriesQuery,
  useToggleActiveServiceMutation,
  useCreateServiceMutation,
  useDeleteServiceMutation,
} from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { Plus, Trash2, CheckCircle, XCircle, Search, Wrench, ImageIcon } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function AdminServices() {
  const { data: servicesRes, isLoading, refetch } = useGetAllServicesQuery();
  const { data: categoriesRes } = useGetAllCategoriesQuery();
  const [toggleActive] = useToggleActiveServiceMutation();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [pricingModel, setPricingModel] = useState<any>("FIXED");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const services = servicesRes?.data || [];
  const categories = categoriesRes?.data || [];

  const handleToggle = async (id: string) => {
    try {
      await toggleActive(id).unwrap();
      toast.success("Service status updated!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id).unwrap();
      toast.success("Service deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete service");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !basePrice) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await createService({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        categoryId,
        basePrice: parseFloat(basePrice),
        pricingModel,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      }).unwrap();
      toast.success("Service added successfully!");
      setName("");
      setSlug("");
      setBasePrice("");
      setImageUrl("");
      setDescription("");
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create service");
    }
  };

  const filtered = services.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.category?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#7C3AED]" />
            Services Catalog
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage photography, videography, stage decoration, and lighting services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search service, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 w-56"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        /* Advanced Tailwind Motion Skeleton Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing Model</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="motion-preset-fade motion-loop-pulse">
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-32 h-4 rounded-md bg-slate-200 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-20 h-4 rounded-full bg-slate-200/80 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-16 h-3 rounded-md bg-slate-200/70 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-16 h-4 rounded-md bg-slate-200 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-16 h-5 rounded-full bg-slate-200 animate-pulse" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="w-6 h-6 rounded-md bg-slate-200 ml-auto animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No services found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing Model</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s: any) => {
                const img =
                  (Array.isArray(s.images) && s.images[0]) ||
                  (typeof s.images === "string" ? s.images.split(" ")[0] : null) ||
                  s.coverImage;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                        {img ? (
                          <Image
                            src={img}
                            alt={s.name}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#172554] block">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{s.slug}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {s.category?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{s.pricingModel}</td>
                    <td className="py-3 px-4 font-bold text-[#172554]">
                      ৳{Number(s.basePrice || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggle(s.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          s.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {s.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{s.isActive ? "ACTIVE" : "INACTIVE"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Service Right-Side Sheet */}
      <Sheet open={showModal} onOpenChange={setShowModal}>
        <SheetContent side="right" className="p-0">
          <SheetHeader>
            <SheetTitle>Add Catalog Service</SheetTitle>
            <SheetDescription>
              Register a service with photo and pricing available to all event planners.
            </SheetDescription>
          </SheetHeader>

          <form
            id="admin-service-form"
            onSubmit={handleCreate}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs">Service Name *</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
                placeholder="e.g. Drone Videography"
                required
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Pricing Model *</Label>
                <Select value={pricingModel} onValueChange={setPricingModel}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Pricing model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIXED">FIXED</SelectItem>
                    <SelectItem value="PER_PERSON">PER_PERSON</SelectItem>
                    <SelectItem value="PER_HOUR">PER_HOUR</SelectItem>
                    <SelectItem value="PER_DAY">PER_DAY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Base Price (৳) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="5000"
                  required
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Service Photo URL</Label>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deliverables, camera specs, turnaround time..."
                rows={3}
                className="text-xs min-h-[76px]"
              />
            </div>
          </form>

          <SheetFooter>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              form="admin-service-form"
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition"
            >
              {isCreating ? "Saving..." : "Add Service"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
