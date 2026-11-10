"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useState, useEffect, Suspense } from "react";
import { User, Mail, Phone, Lock, ArrowLeft, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import EventoraLogo from "@/components/shared/EventoraLogo";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageIdParam = searchParams.get("packageId");

  const [registerUser, { isLoading: registerLoading }] = useRegisterMutation();
  const { data: packageResponse } = useGetAllPackagesQuery(undefined);

  const packages = packageResponse?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    packageId: "",
  });

  useEffect(() => {
    if (packages.length > 0) {
      if (packageIdParam) {
        const found = packages.find((p: any) => p.id === packageIdParam);
        if (found) {
          setFormData((prev) => ({ ...prev, packageId: found.id }));
          return;
        }
      }
      setFormData((prev) => ({ ...prev, packageId: packages[0].id }));
    }
  }, [packages, packageIdParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const response = await registerUser(formData).unwrap();
      if (response.success) {
        toast.success("Account created successfully! Redirecting...");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed. Email or phone may already exist.");
    }
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#7C3AED] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl shadow-slate-200/50">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <EventoraLogo size="md" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Start planning events and accessing AI photo share
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tanvir Ahmed"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tanvir@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01700000000"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
                required
              />
            </div>
          </div>

          {packages.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Storage Plan</label>
              <select
                name="packageId"
                value={formData.packageId}
                onChange={handleChange}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-[#7C3AED] focus:bg-white transition"
              >
                {packages.map((pkg: any) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.storageLimitMB >= 1000 ? `${(pkg.storageLimitMB / 1000).toFixed(0)} GB` : `${pkg.storageLimitMB} MB`} — {pkg.price === 0 ? "Free" : `৳${pkg.price}`})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={registerLoading}
            className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-1.5 mt-2"
          >
            <span>{registerLoading ? "Creating account..." : "Complete Registration"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#7C3AED] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-[#F8FAFC]">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
