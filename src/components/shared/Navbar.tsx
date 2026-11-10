"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  ArrowRight,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import EventoraLogo from "./EventoraLogo";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    await removeTokenCookie();
    toast.success("Successfully logged out!");
    window.location.href = "/login";
  };

  const navDropdowns = [
    {
      name: "Events",
      items: [
        { label: "Wedding Celebration", href: "/events?type=wedding" },
        { label: "Birthday Parties", href: "/events?type=birthday" },
        { label: "Get Together", href: "/events?type=get-together" },
        { label: "Corporate Events", href: "/events?type=corporate-event" },
        { label: "Engagement & Anniversary", href: "/events?type=engagement" },
      ],
    },
    {
      name: "Services",
      items: [
        { label: "Photography & Video", href: "/services?cat=photography" },
        { label: "Stage & Floral Decoration", href: "/services?cat=decoration" },
        { label: "Catering & Buffets", href: "/services?cat=catering" },
        { label: "Sound & DJ Lighting", href: "/services?cat=sound" },
        { label: "Grand Venue Booking", href: "/services?cat=venue" },
        { label: "AI Photo Share Finder", href: "/guest" },
      ],
    },
    {
      name: "Packages",
      items: [
        { label: "Elegant Wedding (Popular)", href: "/packages#wedding" },
        { label: "Birthday Celebration", href: "/packages#birthday" },
        { label: "Corporate Meetup", href: "/packages#corporate" },
        { label: "AI Photo Storage Plans", href: "/packages#storage" },
      ],
    },
    {
      name: "Food & Catering",
      items: [
        { label: "Traditional Biryani & Kacchi", href: "/food?cat=biryani" },
        { label: "Meat & Gourmet Poultry", href: "/food?cat=meat" },
        { label: "Desserts & Traditional Sweets", href: "/food?cat=desserts" },
        { label: "Beverages & Drinks", href: "/food?cat=beverages" },
      ],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* 1. Left: Brand Logo */}
            <div className="flex items-center">
              <EventoraLogo size="md" />
            </div>

            {/* 2. Middle: Desktop Navigation Items */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700" ref={dropdownRef}>
              <Link
                href="/"
                className={`transition-colors hover:text-[#7C3AED] ${
                  pathname === "/" ? "text-[#7C3AED] font-bold" : ""
                }`}
              >
                Home
              </Link>

              {navDropdowns.map((menu) => (
                <div key={menu.name} className="relative group">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === menu.name ? null : menu.name)}
                    className="flex items-center gap-1 py-2 text-slate-700 hover:text-[#7C3AED] transition-colors focus:outline-none"
                  >
                    <span>{menu.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-[#7C3AED]" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute left-0 top-full pt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                    <div className="rounded-xl bg-white p-2 shadow-xl border border-slate-100 ring-1 ring-slate-900/5">
                      {menu.items.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#7C3AED] rounded-lg transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/about"
                className={`transition-colors hover:text-[#7C3AED] ${
                  pathname === "/about" ? "text-[#7C3AED] font-bold" : ""
                }`}
              >
                About
              </Link>
              <Link
                href="/guide"
                className={`transition-colors hover:text-[#7C3AED] ${
                  pathname === "/guide" ? "text-[#7C3AED] font-bold" : ""
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* 3. Right: Search & Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Icon Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-[#7C3AED] hover:bg-slate-100 transition-colors"
                title="Search Eventora"
              >
                <Search className="w-4 h-4" />
              </button>

              {token && user ? (
                /* Authenticated User Menu */
                <div className="flex items-center gap-3">
                  <Link
                    href={user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-[11px]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[90px] truncate">{user.name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Guest State */
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#7C3AED] transition-colors"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#7C3AED]/25 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-5 shadow-lg space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-800 hover:text-[#7C3AED] py-1"
            >
              Home
            </Link>
            {navDropdowns.map((menu) => (
              <div key={menu.name} className="space-y-1.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{menu.name}</div>
                <div className="pl-3 space-y-1 border-l-2 border-slate-100">
                  {menu.items.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm text-slate-600 hover:text-[#7C3AED] py-1"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-800 hover:text-[#7C3AED] py-1"
            >
              About
            </Link>
            <Link
              href="/guide"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-slate-800 hover:text-[#7C3AED] py-1"
            >
              Contact
            </Link>

            {token && user ? (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  href={user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-lg bg-[#7C3AED] text-white font-semibold text-sm"
                >
                  Go to {user.role === "SUPER_ADMIN" ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-center py-2 text-sm text-red-600 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg bg-[#7C3AED] text-white font-semibold text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search weddings, venues, photographers, catering..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 text-xs text-slate-500 bg-slate-50">
              Popular searches: <span className="text-[#7C3AED] font-medium cursor-pointer">Wedding Packages</span>,{" "}
              <span className="text-[#7C3AED] font-medium cursor-pointer">Kacchi Biryani</span>,{" "}
              <span className="text-[#7C3AED] font-medium cursor-pointer">AI Face Photo Finder</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
