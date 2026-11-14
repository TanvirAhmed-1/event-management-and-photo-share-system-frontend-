"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  useGetAllEventTypesQuery,
  useToggleActiveEventTypeMutation,
  useCreateEventTypeMutation,
  useDeleteEventTypeMutation,
} from "@/redux/features/eventType/eventTypeApi";
import { Plus, Trash2, CheckCircle, XCircle, Search, Layers, ImageIcon } from "lucide-react";
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

export default function AdminEventTypes() {
  const { data: response, isLoading, refetch } = useGetAllEventTypesQuery();
  const [toggleActive] = useToggleActiveEventTypeMutation();
  const [createEventType, { isLoading: isCreating }] = useCreateEventTypeMutation();
  const [deleteEventType] = useDeleteEventTypeMutation();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const eventTypes = response?.data || [];

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleActive(id).unwrap();
      toast.success(`Event type status updated!`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event type?")) return;
    try {
      await deleteEventType(id).unwrap();
      toast.success("Event type deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete event type");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Please fill in name and slug");
      return;
    }
    try {
      await createEventType({ name, slug, description, imageUrl: imageUrl || undefined }).unwrap();
      toast.success("Event type created successfully!");
      setName("");
      setSlug("");
      setImageUrl("");
      setDescription("");
      setShowModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create event type");
    }
  };

  const filtered = eventTypes.filter((et: any) =>
    et.name.toLowerCase().includes(search.toLowerCase()) ||
    et.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7C3AED]" />
            Event Types Management
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic event categories available on Eventora with real photography.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event Type</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        /* Advanced Tailwind Motion Table Skeleton */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
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
                    <div className="w-24 h-4 rounded-md bg-slate-200 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-20 h-3 rounded-md bg-slate-200/70 animate-pulse" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-48 h-3 rounded-md bg-slate-200/60 animate-pulse" />
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
        <div className="py-12 text-center text-xs text-slate-400">No event types found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((et: any) => (
                <tr key={et.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                      {et.imageUrl ? (
                        <Image
                          src={et.imageUrl}
                          alt={et.name}
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
                  <td className="py-3 px-4 font-bold text-[#172554]">{et.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{et.slug}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {et.description || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggle(et.id, et.isActive)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        et.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {et.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{et.isActive ? "ACTIVE" : "INACTIVE"}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(et.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete event type"
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

      {/* Create Event Type Right-Side Sheet */}
      <Sheet open={showModal} onOpenChange={setShowModal}>
        <SheetContent side="right" className="p-0">
          <SheetHeader>
            <SheetTitle>Create New Event Type</SheetTitle>
            <SheetDescription>
              Add a celebration category that hosts can choose with photo cover.
            </SheetDescription>
          </SheetHeader>

          <form
            id="admin-event-type-form"
            onSubmit={handleCreate}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs">Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }
                }}
                placeholder="e.g. Mehendi Night"
                required
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Slug</Label>
              <Input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. mehendi-night"
                required
                className="text-xs h-9 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Cover Photo URL</Label>
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
                placeholder="Detailed summary of this celebration tier..."
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
              form="admin-event-type-form"
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition"
            >
              {isCreating ? "Saving..." : "Create Event Type"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
