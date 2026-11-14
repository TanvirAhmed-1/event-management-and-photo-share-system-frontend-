"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateUserProfile } from "@/redux/features/auth/authSlice";
import { AVATAR_THEMES, getAvatarTheme } from "@/utils/avatarThemes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Building2, Check, Palette, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface QuickEditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Shared right-side shadcn Sheet drawer for quickly updating avatar theme, name, phone, and organization.
 */
export default function QuickEditProfileSheet({
  open,
  onOpenChange,
}: QuickEditProfileSheetProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    organization: "",
    avatarColor: "violet",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        organization: user.organization || "",
        avatarColor: user.avatarColor || "violet",
      });
    }
  }, [user, open]);

  if (!user) return null;

  const fullProfileHref =
    user.role === "SUPER_ADMIN" ? "/admin/profile" : "/dashboard/profile";
  const theme = getAvatarTheme(form.avatarColor);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    dispatch(
      updateUserProfile({
        name: form.name.trim(),
        phone: form.phone.trim(),
        organization: form.organization.trim(),
        avatarColor: form.avatarColor,
      })
    );
    toast.success("Profile updated!");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        <SheetHeader className="bg-gradient-to-r from-[#172554] to-[#4C1D95] text-white border-b border-white/10">
          <div className="flex items-center gap-3 pr-6">
            <div
              className={`w-11 h-11 rounded-xl ${theme.gradient} text-white flex items-center justify-center font-extrabold text-sm ring-2 ring-white/30 shrink-0`}
            >
              {(form.name || user.name).charAt(0).toUpperCase()}
            </div>
            <div>
              <SheetTitle className="text-base text-white">
                Quick Edit Profile
              </SheetTitle>
              <SheetDescription className="text-[11px] text-purple-200">
                Update your avatar theme &amp; display details
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          id="shared-quick-edit-profile-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <Palette className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Avatar Theme</span>
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {Object.entries(AVATAR_THEMES).map(([key, itemTheme]) => {
                const selected = form.avatarColor === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, avatarColor: key }))
                    }
                    title={itemTheme.label}
                    className={`w-8 h-8 rounded-full ${itemTheme.swatch} flex items-center justify-center text-white transition-transform ${
                      selected
                        ? "ring-2 ring-offset-2 ring-[#7C3AED] scale-110"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Full Name *
            </Label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="pl-10 h-10 text-xs bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="pl-10 h-10 text-xs bg-slate-50/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">
              Organization / Studio Brand
            </Label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                value={form.organization}
                onChange={(e) =>
                  setForm({ ...form, organization: e.target.value })
                }
                placeholder="e.g. Royal Wedding Planners"
                className="pl-10 h-10 text-xs bg-slate-50/50"
              />
            </div>
          </div>

          <div className="pt-2">
            <Link
              href={fullProfileHref}
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center text-xs font-bold text-[#7C3AED] hover:underline"
            >
              Open Full Profile Settings →
            </Link>
          </div>
        </form>

        <SheetFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="shared-quick-edit-profile-form"
            className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition"
          >
            Save Changes
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
