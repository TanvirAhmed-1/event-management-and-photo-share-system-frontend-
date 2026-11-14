"use client";

import React, { useState } from "react";
import {
  useGetAllPackagesQuery,
  useCreatePackageMutation,
  useDeletePackageMutation,
} from "@/redux/features/package/packageApi";
import { Plus, Trash2, Database, HardDrive, Check } from "lucide-react";
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
import toast from "react-hot-toast";

export default function AdminPackages() {
  const { data: response, isLoading, refetch } = useGetAllPackagesQuery(undefined);
  const [createPackage, { isLoading: isCreating }] = useCreatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [storageLimitMB, setStorageLimitMB] = useState("");
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [description, setDescription] = useState("");

  const packages = response?.data || [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this storage plan?")) return;
    try {
      await deletePackage(id).unwrap();
      toast.success("Storage plan deleted!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete plan");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !storageLimitMB || price === "") {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await createPackage({
        name,
        storageLimitMB: parseFloat(storageLimitMB),
        price: parseFloat(price),
        durationDays: parseInt(durationDays) || 30,
        description: description ? description.split("\n").filter(Boolean) : ["AI Facial Recognition", "ZIP Download Stream"],
      }).unwrap();
      toast.success("Storage plan created successfully!");
      setName("");
      setStorageLimitMB("");
      setPrice("");
      setDescription("");
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create plan");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            AI Photo Storage & Delivery Plans
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure photo storage quotas, AI face-scan tiers, and add-on pricing.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Storage Plan</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading storage plans...</div>
      ) : packages.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No storage plans created yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packages.map((pkg: any) => (
            <div
              key={pkg.id}
              className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#172554]">{pkg.name}</h4>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#7C3AED]">
                    {pkg.price === 0 ? "Free" : `৳${pkg.price}`}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ {pkg.durationDays} days</span>
                </div>

                <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>
                    {pkg.storageLimitMB >= 1000
                      ? `${(pkg.storageLimitMB / 1000).toFixed(0)} GB Storage`
                      : `${pkg.storageLimitMB} MB Storage`}
                  </span>
                </div>

                {/* Features list */}
                {pkg.description && Array.isArray(pkg.description) && (
                  <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                    {pkg.description.map((item: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Storage Plan Right-Side Sheet */}
      <Sheet open={showModal} onOpenChange={setShowModal}>
        <SheetContent side="right" className="p-0">
          <SheetHeader>
            <SheetTitle>Create Storage Plan</SheetTitle>
            <SheetDescription>
              Define a cloud photo quota and billing duration tier for event organizers.
            </SheetDescription>
          </SheetHeader>

          <form
            id="admin-package-form"
            onSubmit={handleCreate}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs">Plan Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Diamond Event 50GB"
                className="text-xs h-9"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Storage Limit (MB)</Label>
                <Input
                  type="number"
                  value={storageLimitMB}
                  onChange={(e) => setStorageLimitMB(e.target.value)}
                  placeholder="5000"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Price (৳)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="49"
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Validity (Days)</Label>
              <Input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="30"
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Features (One per line)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  "5 GB High-Speed Storage\nFacial Match Scanning\nOne-Click ZIP Stream"
                }
                rows={4}
                className="text-xs min-h-[96px]"
              />
            </div>
          </form>

          <SheetFooter>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="admin-package-form"
              disabled={isCreating}
              className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm"
            >
              {isCreating ? "Saving..." : "Create Plan"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

