"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useState } from "react";
import { Mail, Lock, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import EventoraLogo from "@/components/shared/EventoraLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in both email and password!");
      return;
    }

    try {
      const response = await loginUser(formData).unwrap();
      if (response.success) {
        toast.success("Welcome back! Redirecting...");
        if (response.data?.user?.role === "SUPER_ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid email or password.");
    }
  };

  const fillSuperAdmin = () => {
    setFormData({
      email: "superadmin@weddingai.com",
      password: "superadmin12345",
    });
    toast.success("Super Admin credentials autofilled!");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-eventora-mesh">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#7C3AED] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-8 shadow-2xl shadow-slate-900/8 motion-preset-slide-up-md motion-preset-fade motion-duration-500">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <EventoraLogo size="md" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Access your events, services, and AI photo galleries
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="pl-10 h-10 text-xs bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">Password</Label>
                <Link href="#" className="text-[11px] text-[#7C3AED] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 h-10 text-xs bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Admin Autofill helper */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={fillSuperAdmin}
              className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] text-xs font-semibold border border-purple-200 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Autofill Super Admin Credentials</span>
            </button>
          </div>

          <div className="text-center mt-6 text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-[#7C3AED] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
