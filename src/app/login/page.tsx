"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useState } from "react";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/shared/GlassCard";
import Input from "@/components/shared/Input";
import Container from "@/components/shared/Container";
import Button from "@/components/ui/Button";

type FormDataType = {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const response = await loginUser(formData).unwrap();
      if (response.success) {
        toast.success("Welcome back! Redirecting...");
        // Re-route to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error(err?.data?.message || "Incorrect email or password.");
    }
  };

  return (
    <Container className="flex-grow flex items-center justify-center py-24 sm:py-32">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-radial-gradient(circle, rgba(212,175,55,0.04)_0%, transparent_70%) blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-500 hover:text-[#d4af37] transition-all mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <GlassCard className="p-8 border border-[#d4af37]/10" hoverEffect={false}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black font-heading tracking-tight text-white mb-2 uppercase">
              Sign In
            </h2>
            <p className="text-xs text-gray-400">
              Access your luxury event photo catalog
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4" size="lg" isLoading={isLoading}>
              Sign In
              <LogIn className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-500">
              Don't have an event pool yet?{" "}
              <Link href="/register" className="text-[#d4af37] hover:underline font-semibold">
                Sign Up Now
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </Container>
  );
}
