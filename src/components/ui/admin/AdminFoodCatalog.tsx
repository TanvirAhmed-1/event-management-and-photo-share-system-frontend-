"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  useGetAllFoodItemsQuery,
  useGetAllFoodCategoriesQuery,
  useToggleActiveFoodItemMutation,
  useCreateFoodItemMutation,
  useDeleteFoodItemMutation,
} from "@/redux/features/food/foodApi";
import { Plus, Trash2, CheckCircle, XCircle, Search, Utensils, ImageIcon } from "lucide-react";
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

export default function AdminFoodCatalog() {
  const { data: foodRes, isLoading, refetch } = useGetAllFoodItemsQuery();
  const { data: categoriesRes } = useGetAllFoodCategoriesQuery();
  const [toggleActive] = useToggleActiveFoodItemMutation();
  const [createFoodItem, { isLoading: isCreating }] = useCreateFoodItemMutation();
  const [deleteFoodItem] = useDeleteFoodItemMutation();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [description, setDescription] = useState("");

  const items = foodRes?.data || [];
  const categories = categoriesRes?.data || [];

  const handleToggle = async (id: string) => {
    try {
      await toggleActive(id).unwrap();
      toast.success("Food item status updated!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update food item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this food item?")) return;
    try {
      await deleteFoodItem(id).unwrap();
      toast.success("Food item deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete food item");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId || !pricePerPerson) {
      toast.error("Please fill in name, category, and price per person.");
      return;
    }
    try {
      await createFoodItem({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        categoryId,
        pricePerPerson: parseFloat(pricePerPerson),
        isVegetarian,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      }).unwrap();
      toast.success("Food item added successfully!");
      setName("");
      setSlug("");
      setPricePerPerson("");
      setImageUrl("");
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create food item");
    }
  };

  const filtered = items.filter((f: any) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.category?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#7C3AED]" />
            Food &amp; Catering Catalog
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authentic dishes, per-plate pricing, and dietary categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search dish, category..."
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
            <span>Add Food Item</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        /* Advanced Tailwind Motion Skeleton Table */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Dish Photo</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Person</th>
                <th className="py-3 px-4">Dietary</th>
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
                    <div className="w-28 h-4 rounded-md bg-slate-200 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-20 h-4 rounded-full bg-slate-200/80 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-16 h-4 rounded-md bg-slate-200 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-14 h-4 rounded-full bg-slate-200 animate-pulse" />
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
        <div className="py-12 text-center text-xs text-slate-400">No food items found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Dish Photo</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Person</th>
                <th className="py-3 px-4">Dietary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((f: any) => {
                const img =
                  (Array.isArray(f.images) && f.images[0]) ||
                  (typeof f.images === "string" ? f.images.split(" ")[0] : null) ||
                  f.coverImage;

                return (
                  <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                        {img ? (
                          <Image
                            src={img}
                            alt={f.name}
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
                      <span className="font-bold text-[#172554] block">{f.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{f.slug}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {f.category?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#172554]">
                      ৳{Number(f.pricePerPerson || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          f.isVegetarian
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {f.isVegetarian ? "VEG" : "NON-VEG"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggle(f.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          f.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {f.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{f.isActive ? "ACTIVE" : "INACTIVE"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete food item"
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

      {/* Create Food Right-Side Sheet */}
      <Sheet open={showModal} onOpenChange={setShowModal}>
        <SheetContent side="right" className="p-0">
          <SheetHeader>
            <SheetTitle>Add Dish / Food Item</SheetTitle>
            <SheetDescription>
              Add an authentic delicacy to the catering menu with cover photo and per-person pricing.
            </SheetDescription>
          </SheetHeader>

          <form
            id="admin-food-form"
            onSubmit={handleCreate}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs">Item Name *</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
                placeholder="e.g. Mutton Kacchi Biryani"
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
                <Label className="text-xs">Price / Person (৳) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={pricePerPerson}
                  onChange={(e) => setPricePerPerson(e.target.value)}
                  placeholder="120"
                  required
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Dietary</Label>
                <Select
                  value={isVegetarian ? "veg" : "non-veg"}
                  onValueChange={(val) => setIsVegetarian(val === "veg")}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Dietary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Dish Photo URL</Label>
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Description / Ingredients</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Slow-cooked tender mutton with aromatic basmati rice..."
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
              form="admin-food-form"
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition"
            >
              {isCreating ? "Saving..." : "Add Food Item"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
