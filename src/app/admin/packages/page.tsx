"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPackagesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-400">
      Redirecting to Eventora Admin Suite...
    </div>
  );
}
