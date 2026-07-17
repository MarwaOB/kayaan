"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/admin/session", { credentials: "include" });
        setAuthed(res.ok);
      } catch {
        setAuthed(false);
      } finally {
        setChecking(false);
      }
    }

    verify();
  }, [isLoginPage]);

  useEffect(() => {
    if (!checking && !authed && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [checking, authed, isLoginPage, router]);

  if (checking || (!authed && !isLoginPage)) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-400">...جاري التحقق</div>;
  }

  return <>{children}</>;
}
