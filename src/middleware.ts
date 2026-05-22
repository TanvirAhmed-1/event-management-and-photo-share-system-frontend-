import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
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

  return NextResponse.next();
}

// Config matcher to intercept all pages except assets, static files, and standard next components
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
