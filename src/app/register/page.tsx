"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useState, useEffect, Suspense } from "react";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import EventoraLogo from "@/components/shared/EventoraLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    confirmPassword: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await registerUser(payload).unwrap();
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
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 shadow-2xl shadow-slate-900/8 motion-preset-slide-up-md motion-preset-fade motion-duration-500">
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
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Full Name *</Label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tanvir Ahmed"
                className="pl-10 h-10 text-xs bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Email *</Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tanvir@example.com"
                  className="pl-10 h-10 text-xs bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Phone Number *</Label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01700000000"
                  className="pl-10 h-10 text-xs bg-slate-50/50"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Password *</Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="pl-10 h-10 text-xs bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Confirm Password *</Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="pl-10 h-10 text-xs bg-slate-50/50"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={registerLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-1.5 mt-2"
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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-eventora-mesh">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
