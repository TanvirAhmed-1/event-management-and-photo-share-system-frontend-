"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/features/auth/authSlice";
import { removeTokenCookie } from "@/redux/server/storeCookies";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, Settings, User } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    await removeTokenCookie();
    toast.success("Successfully logged out!");
    window.location.href = "/login";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "User Guide", href: "/guide" },
    { name: "About Us", href: "/about" },
  ];

  const loggedInLinks = [
    { name: "Dashboard", href: "/dashboard" },
  ];

  if (user?.role === "SUPER_ADMIN") {
    loggedInLinks.push({ name: "Admin Panel", href: "/admin" });
    loggedInLinks.push({ name: "Packages", href: "/admin/packages" });
  }

  const isGuestScanner = pathname.startsWith("/guest/");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#060608]/92 backdrop-blur-xl shadow-lg shadow-black/20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-black font-heading tracking-wider uppercase text-gold-gradient group-hover:glow-gold-intense transition-all duration-300">
                SHAREEVENT<span className="text-white">PHOTO</span>
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-rose-gradient animate-pulse"></div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          {!isGuestScanner && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-all duration-200 hover:text-[#d4af37] ${
                    pathname === link.href ? "text-[#d4af37]" : "text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {token &&
                loggedInLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-all duration-200 hover:text-[#d4af37] ${
                      pathname === link.href ? "text-[#d4af37]" : "text-gray-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          )}

          {/* User Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className="text-[10px] font-medium tracking-widest text-[#d4af37] uppercase">
                    {user.role}
                  </span>
                </div>
                
                {/* Profile Circle */}
                <div className="w-10 h-10 rounded-full bg-gold-dark-gradient border border-[#d4af37]/35 flex items-center justify-center text-[#d4af37] font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-500/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 bg-red-950/10 transition-all duration-300 hover:scale-105"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              !isGuestScanner && (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-300 hover:text-[#d4af37] transition-all duration-200 whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="relative group px-5 sm:px-6 py-2.5 rounded-full overflow-hidden text-sm font-semibold tracking-wide text-black bg-gold-gradient transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-[#d4af37] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && !isGuestScanner && (
        <div className="md:hidden glass-panel border-t border-white/5 bg-[#060608]/95 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                pathname === link.href ? "bg-white/5 text-[#d4af37]" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {token &&
            loggedInLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                  pathname === link.href ? "bg-white/5 text-[#d4af37]" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

          {token && user ? (
            <div className="border-t border-white/10 pt-4 mt-4 space-y-4 px-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-dark-gradient border border-[#d4af37]/35 flex items-center justify-center text-[#d4af37] font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-[#d4af37]">{user.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="border-t border-white/10 pt-4 mt-4 grid grid-cols-2 gap-4 px-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center px-4 py-2.5 rounded-full border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center px-4 py-2.5 rounded-full bg-gold-gradient text-sm font-semibold text-black transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
