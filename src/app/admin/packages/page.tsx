"use client";

import { 
  useGetAllPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from "@/redux/features/package/packageApi";
import { useState, useEffect } from "react";
import { Settings, Plus, Sparkles, Check, CheckCircle2, HardDrive, DollarSign, Edit, Trash2, ArrowLeft, X, Layers, ListPlus } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import Input from "@/components/shared/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import toast from "react-hot-toast";
import Container from "@/components/shared/Container";
import { motion, AnimatePresence } from "framer-motion";

export default function ManagePackages() {
  const { data: packageResponse, isLoading, refetch } = useGetAllPackagesQuery(undefined);
  const [createPackage] = useCreatePackageMutation();
  const [updatePackage] = useUpdatePackageMutation();
  const [deletePackage] = useDeletePackageMutation();
  
  const [packages, setPackages] = useState<any[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const [planFormData, setPlanFormData] = useState({
    name: "",
    storageLimitMB: 2000,
    price: 19.99,
    description: "",
  });

  useEffect(() => {
    if (packageResponse?.data) {
      setPackages(packageResponse.data);
    }
  }, [packageResponse]);

  const handleCreateOrEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planFormData.name || !planFormData.storageLimitMB || !planFormData.price) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const descArray = planFormData.description
      ? planFormData.description.split(",").map((s) => s.trim())
      : ["High-speed matching comparison", "Guest Scanner links", "Secure cloud embeddings"];

    try {
      if (editingPlanId) {
        // Edit mode API call
        await updatePackage({
          id: editingPlanId,
          name: planFormData.name,
          storageLimitMB: Number(planFormData.storageLimitMB),
          price: Number(planFormData.price),
          description: descArray,
        }).unwrap();
        toast.success("Successfully modified SaaS subscription plan details!");
      } else {
        // Create mode API call
        await createPackage({
          name: planFormData.name,
          storageLimitMB: Number(planFormData.storageLimitMB),
          price: Number(planFormData.price),
          description: descArray,
        }).unwrap();
        toast.success("Successfully created new SaaS subscription plan!");
      }

      setModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to save package plan");
    }
  };

  const handleEditClick = (pkg: any) => {
    setEditingPlanId(pkg.id);
    setPlanFormData({
      name: pkg.name,
      storageLimitMB: pkg.storageLimitMB,
      price: pkg.price,
      description: Array.isArray(pkg.description) ? pkg.description.join(", ") : "",
    });
    setModalOpen(true);
  };

  const handleDeletePlan = async (pkgId: string, name: string) => {
    try {
      await deletePackage(pkgId).unwrap();
      toast.success(`Deleted SaaS subscription plan "${name}"`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete package plan");
    }
  };

  const resetForm = () => {
    setEditingPlanId(null);
    setPlanFormData({
      name: "",
      storageLimitMB: 2000,
      price: 19.99,
      description: "",
    });
  };

  return (
    <Container className="py-10 flex flex-col gap-10 animate-in fade-in duration-300">

      {/* Return Navigation */}
      <Link
        href="/admin"
        className="self-start inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-500 hover:text-[#d4af37] transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Admin Control Room
      </Link>

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#b76e79] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> SaaS Package Setup
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
            Manage <span className="text-rose-gradient font-black">Subscription Plans</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Define database storage sizes, adjust pricing options, and edit plan descriptors</p>
        </div>

        <Button onClick={() => { resetForm(); setModalOpen(true); }} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Create SaaS Plan
        </Button>
      </div>

      {/* Package Plans Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 flex-grow">
          <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <GlassCard
              key={pkg.id}
              className="flex flex-col justify-between p-8 border border-white/5 bg-[#0c0c10]/60 relative group"
              hoverEffect={true}
            >
              <div className="space-y-6">

                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-heading truncate pr-4">{pkg.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(pkg)}
                      className="p-1 rounded bg-white/5 hover:bg-[#d4af37]/15 text-gray-400 hover:text-[#d4af37] transition-all"
                      title="Edit Plan"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(pkg.id, pkg.name)}
                      className="p-1 rounded bg-white/5 hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Price Tag */}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-heading text-white">${pkg.price}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">one-time</span>
                </div>

                {/* Storage Metric */}
                <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                  <HardDrive className="w-4 h-4" />
                  Storage Size: {pkg.storageLimitMB >= 1000 ? `${(pkg.storageLimitMB / 1000).toFixed(0)} GB` : `${pkg.storageLimitMB} MB`}
                </div>

                {/* Features Checklist */}
                <ul className="space-y-3 pt-4 border-t border-white/5">
                  {(Array.isArray(pkg.description) ? pkg.description : []).map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-400">
                      <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Create / Edit Plan Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#08080b]/95 relative shadow-[0_0_50px_rgba(212,175,55,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Luxury Accent Glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-radial-gradient(circle, rgba(212,175,55,0.15)_0%, transparent_70%) blur-xl pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-center justify-between p-7 border-b border-white/5 bg-[#0a0a0d]/90 relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d4af37] animate-pulse" />
                  <h3 className="font-heading font-black text-sm uppercase tracking-widest text-gold-gradient">
                    {editingPlanId ? "Edit Subscription Plan" : "Create SaaS Plan"}
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateOrEditPlan} className="p-7 space-y-6 relative z-10">
                
                {/* Plan Name */}
                <div className="space-y-2">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#d4af37]/75" /> Subscription Plan Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Diamond Event Pool"
                      value={planFormData.name}
                      onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-[#050507] border border-white/5 hover:border-[#d4af37]/30 rounded-2xl font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/65 focus:ring-1 focus:ring-[#d4af37]/35 transition-all duration-300 pl-12"
                      required
                    />
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Storage Limit */}
                  <div className="space-y-2">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-[#d4af37]/75" /> Storage Limit (MB) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="2000"
                        value={planFormData.storageLimitMB}
                        onChange={(e) => setPlanFormData({ ...planFormData, storageLimitMB: Number(e.target.value) })}
                        className="w-full px-5 py-4 bg-[#050507] border border-white/5 hover:border-[#d4af37]/30 rounded-2xl font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/65 focus:ring-1 focus:ring-[#d4af37]/35 transition-all duration-300 pl-12"
                        required
                      />
                      <HardDrive className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                  </div>

                  {/* Pricing Rate */}
                  <div className="space-y-2">
                    <label className="font-heading text-[10px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[#d4af37]/75" /> Pricing Rate (USD) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="19.99"
                        value={planFormData.price}
                        onChange={(e) => setPlanFormData({ ...planFormData, price: Number(e.target.value) })}
                        className="w-full px-5 py-4 bg-[#050507] border border-white/5 hover:border-[#d4af37]/30 rounded-2xl font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/65 focus:ring-1 focus:ring-[#d4af37]/35 transition-all duration-300 pl-12"
                        required
                      />
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                    <ListPlus className="w-3.5 h-3.5 text-[#d4af37]/75" /> Features List (Comma Separated)
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="e.g. 5 GB Storage limit, Stream download ZIP pools, Neural matching matrix maps"
                      value={planFormData.description}
                      onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                      className="w-full px-5 py-4 bg-[#050507] border border-white/5 hover:border-[#d4af37]/30 rounded-2xl font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/65 focus:ring-1 focus:ring-[#d4af37]/35 transition-all duration-300 min-h-[100px] pl-12"
                    />
                    <ListPlus className="absolute left-4 top-6 w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1 pl-1">Separate features with commas to automatically compile them into luxury checklists.</p>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-6 border-t border-white/5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setModalOpen(false)}
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-2xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)]"
                  >
                    {editingPlanId ? "Update Plan" : "Create Plan"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
