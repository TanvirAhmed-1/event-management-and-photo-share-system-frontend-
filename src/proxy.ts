import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Base64URL-safe JSON Web Token Decoder (Compatible with Next.js Edge and V8 Runtimes)
function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Define public routes
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isLandingPage = pathname === "/";
  const isGuestScannerPage = pathname.startsWith("/guest/");

  const isPublicRoute = isLoginPage || isRegisterPage || isLandingPage || isGuestScannerPage;

  // If trying to access private page without being authenticated
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and attempting to visit Auth pages (login, register)
  if (token && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Super Admin Route Protection: Only allow access if role in token is SUPER_ADMIN
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const decoded = decodeJwt(token);
    if (!decoded || decoded.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// Config matcher to intercept all pages except assets, static files, and standard next components
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export default proxy;
