"use client";

import React, { useState } from "react";
import {
  useGetAllUsersAdminQuery,
  useToggleUserActiveAdminMutation,
  useUpdateUserPackageAdminMutation,
} from "@/redux/features/user/userApi";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { Users, Search, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const { data: usersRes, isLoading, refetch } = useGetAllUsersAdminQuery(undefined);
  const { data: packagesRes } = useGetAllPackagesQuery(undefined);
  const [toggleActive] = useToggleUserActiveAdminMutation();
  const [updatePackage] = useUpdateUserPackageAdminMutation();

  const [search, setSearch] = useState("");

  const users = usersRes?.data || [];
  const packages = packagesRes?.data || [];

  const handleToggle = async (userId: string, name: string) => {
    try {
      const res = await toggleActive(userId).unwrap();
      toast.success(`${name}'s status updated to ${res.data.isActive ? "ACTIVE" : "INACTIVE"}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle user status");
    }
  };

  const handlePackageChange = async (userId: string, packageId: string) => {
    try {
      await updatePackage({ id: userId, packageId }).unwrap();
      toast.success("User storage plan updated successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update package");
    }
  };

  const filtered = users.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Users & Organizers Management
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            View registered hosts, organizers, roles, and assign storage quotas.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED] w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading users...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Assigned Plan</th>
                <th className="py-3 px-4">Storage Usage</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#172554]">{u.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{u.phone}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-[#7C3AED]"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.packageId || ""}
                      onChange={(e) => handlePackageChange(u.id, e.target.value)}
                      className="text-xs p-1 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none focus:border-[#7C3AED]"
                    >
                      <option value="">No Active Plan</option>
                      {packages.map((pkg: any) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} ({pkg.storageLimitMB >= 1000 ? `${(pkg.storageLimitMB / 1000).toFixed(0)} GB` : `${pkg.storageLimitMB} MB`})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {(u.usedStorageMB || 0).toFixed(1)} MB /{" "}
                    {u.package?.storageLimitMB ? `${u.package.storageLimitMB} MB` : "—"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggle(u.id, u.name)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {u.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{u.isActive ? "ACTIVE" : "INACTIVE"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

