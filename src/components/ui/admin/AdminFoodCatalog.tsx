"use client";

import React, { useState } from "react";
import {
  useGetAllFoodItemsQuery,
  useGetAllFoodCategoriesQuery,
  useToggleActiveFoodItemMutation,
  useCreateFoodItemMutation,
  useDeleteFoodItemMutation,
} from "@/redux/features/food/foodApi";
import { Plus, Trash2, CheckCircle, XCircle, Search, Utensils } from "lucide-react";
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
      }).unwrap();
      toast.success("Food item added successfully!");
      setName("");
      setSlug("");
      setPricePerPerson("");
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
            <Utensils className="w-5 h-5 text-emerald-500" />
            Food & Catering Catalog
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dishes, biryani, meats, desserts, and per-person catering rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED]"
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
        <div className="py-12 text-center text-xs text-slate-400">Loading food items...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No food items found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Price / Person</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((f: any) => (
                <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#172554]">{f.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{f.category?.name || "General"}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.isVegetarian
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {f.isVegetarian ? "VEG" : "NON-VEG"}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#7C3AED]">
                    ৳{f.pricePerPerson?.toLocaleString()}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-[#172554] mb-4">Add Food Item</h4>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  placeholder="e.g. Mutton Kacchi Biryani"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price / Person (৳)</label>
                  <input
                    type="number"
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(e.target.value)}
                    placeholder="350"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                    required
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVegetarian}
                      onChange={(e) => setIsVegetarian(e.target.checked)}
                      className="rounded text-[#7C3AED]"
                    />
                    <span className="text-xs font-semibold text-slate-700">Is Vegetarian</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fragrant basmati rice cooked with tender mutton..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold"
                >
                  {isCreating ? "Saving..." : "Add Food Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

