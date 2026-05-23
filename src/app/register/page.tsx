"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useState, useEffect, Suspense } from "react";
import { User, Mail, Phone, Lock, Sparkles, ArrowLeft, ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/shared/GlassCard";
import Input from "@/components/shared/Input";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

// Static mock packages fallback moved outside the component body.
// This ensures that the array reference is permanent and stable across all renders,
// preventing infinite rendering triggers in useEffect.
const MOCK_PACKAGES = [
  {
    id: "free-mock",
    name: "Free Trial",
    price: 0,
    storageLimitMB: 50,
    description: ["50 MB secure storage", "Instant facial matches", "Multi-upload up to 10 files", "Single downloads only"],
  },
  {
    id: "gold-mock",
    name: "Gold Event Plan",
    price: 19.99,
    storageLimitMB: 2000,
    description: ["2 GB premium storage", "Saves up to 1,000 photos", "Fast ZIP stream downloads", "Pre-processing embeddings", "Guest Selfie Scanner access"],
  },
  {
    id: "premium-mock",
    name: "Elite Lifetime Plan",
    price: 49.99,
    storageLimitMB: 20000,
    description: ["20 GB lifetime storage", "Uncapped high-res uploads", "Super-fast priority processing", "ZIP stream multi-downloads", "Lifetime dashboard metrics", "Premium support"],
  },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageIdParam = searchParams.get("packageId");

  const [registerUser, { isLoading: registerLoading }] = useRegisterMutation();
  const { data: packageResponse, isLoading: packagesLoading } = useGetAllPackagesQuery(undefined);

  const packages = packageResponse?.data && packageResponse.data.length > 0 ? packageResponse.data : MOCK_PACKAGES;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    packageId: "",
  });

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Pre-select package from URL parameter or set standard default
  useEffect(() => {
    if (packages.length > 0 && !hasInitialized) {
      if (packageIdParam) {
        const found = packages.find((p: any) => p.id === packageIdParam);
        if (found) {
          setFormData((prev) => ({ ...prev, packageId: found.id }));
          setSelectedPackageId(found.id);
          setHasInitialized(true);
          return;
        }
      }
      // If no valid param, default the selection radio but do NOT skip the package select view
      const freePlan = packages.find((p: any) => p.name.toLowerCase().includes("free") || p.id.includes("free"));
      if (freePlan) {
        setFormData((prev) => ({ ...prev, packageId: freePlan.id }));
      } else {
        setFormData((prev) => ({ ...prev, packageId: packages[0].id }));
      }
      setHasInitialized(true);
    }
  }, [packages, packageIdParam, hasInitialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.packageId) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const response = await registerUser(formData).unwrap();
      if (response.success) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      toast.error(err?.data?.message || "Registration failed. Please check your credentials.");
    }
  };

  const activePackage = packages.find((p: any) => p.id === selectedPackageId);

  return (
    <div className="relative overflow-hidden w-full">
      <AnimatePresence mode="wait">
        {!selectedPackageId ? (
          /* STEP 1: Package Selection Screen */
          <motion.div
            key="package-selector"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-8 pb-10 border border-[#d4af37]/10" hoverEffect={false}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black font-heading tracking-tight text-white mb-2 uppercase">
                  Select Your Plan
                </h2>
                <p className="text-xs text-gray-400">
                  Choose a database package to initialize your wedding photo pool
                </p>
              </div>

              {packagesLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {packages.map((pkg: any) => {
                    const isSelected = formData.packageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setFormData((prev) => ({ ...prev, packageId: pkg.id }))}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-start justify-between gap-4 group ${
                          isSelected
                            ? "bg-gold-dark-gradient/30 border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.12)] scale-[1.01]"
                            : "bg-[#0c0c10]/60 border-white/5 hover:border-white/10 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wide">
                              {pkg.name}
                            </h3>
                            {(pkg.name.toLowerCase().includes("gold") || pkg.id.includes("gold")) && (
                              <span className="bg-[#d4af37]/15 text-[#d4af37] font-semibold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#d4af37]/20">
                                Best Value
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#d4af37] mt-1.5 font-semibold uppercase tracking-wider">
                            Allocation: {pkg.storageLimitMB >= 1000 ? `${(pkg.storageLimitMB / 1000).toFixed(0)} GB` : `${pkg.storageLimitMB} MB`} Secure Storage
                          </p>

                          {/* Detailed features bullet list */}
                          <ul className="mt-3.5 space-y-2 border-t border-white/5 pt-3 text-[10px] text-gray-400 font-medium">
                            {(Array.isArray(pkg.description) ? pkg.description : []).map((feature: string, fIdx: number) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                                <span className="leading-tight">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 pt-0.5">
                          <div className="text-right">
                            <div className="text-base font-extrabold text-white font-heading">${pkg.price}</div>
                            <div className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">
                              one-time
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? "border-[#d4af37] bg-[#d4af37] text-black" : "border-white/10"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Button
                onClick={() => {
                  if (formData.packageId) {
                    setSelectedPackageId(formData.packageId);
                  } else {
                    toast.error("Please select a package first!");
                  }
                }}
                className="w-full mt-4 uppercase text-[10px] tracking-wider font-bold"
                size="lg"
                disabled={packagesLoading}
              >
                Continue to Registration
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </GlassCard>
          </motion.div>
        ) : (
          /* STEP 2: Main Sign Up Form */
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-8 pb-10 border border-[#d4af37]/10" hoverEffect={false}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black font-heading tracking-tight text-white mb-2 uppercase">
                  Create Account
                </h2>
                <p className="text-xs text-gray-400">
                  Initialize your luxury AI photo database
                </p>
              </div>

              {/* Dynamic Package Summary Panel */}
              <div className="mb-6 p-4 rounded-xl bg-gold-dark-gradient/20 border border-[#d4af37]/15 flex items-center justify-between">
                <div>
                  <span className="text-[8px] uppercase tracking-widest font-extrabold text-[#d4af37]">Selected Plan</span>
                  <h4 className="text-xs font-bold text-white font-heading uppercase tracking-wide mt-0.5">
                    {activePackage?.name || "Selected Package"}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#d4af37] font-heading">${activePackage?.price}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPackageId(null)}
                    className="text-[9px] uppercase font-black tracking-wider text-gray-400 hover:text-white underline transition-all cursor-pointer"
                  >
                    Change Plan
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="e.g. 01700000000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  className="w-full mt-4 uppercase text-[10px] tracking-wider font-bold"
                  size="lg"
                  isLoading={registerLoading}
                >
                  Initialize Plan & Sign Up
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="text-center mt-8 pt-6 border-t border-white/5">
                <p className="text-xs text-gray-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#d4af37] hover:underline font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import Container from "@/components/shared/Container";

export default function Register() {
  return (
    <Container className="flex-grow flex items-center justify-center py-24 sm:py-32">
      {/* Background glows */}
      <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-radial-gradient(circle, rgba(183,110,121,0.04)_0%, transparent_70%) blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-500 hover:text-[#d4af37] transition-all mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <Suspense
          fallback={
            <GlassCard className="p-8 border border-[#d4af37]/10" hoverEffect={false}>
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
              </div>
            </GlassCard>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </Container>
  );
}
