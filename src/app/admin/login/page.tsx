"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(mode === "login" ? "/api/admin/login" : "/api/admin/register", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
          confirmPassword,
        }),
        headers: { "Content-Type": "application/json" },
      });

      // Read the body as text first — a server crash (e.g. DB unreachable)
      // can return a 500 with an empty or non-JSON body, and res.json()
      // throws "Unexpected end of JSON input" on that instead of giving
      // us a usable error message.
      const text = await res.text();
      let data: { error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // body wasn't valid JSON — fall through to the generic message below
      }

      if (!res.ok) {
        setError(data.error || (mode === "login" ? "فشل تسجيل الدخول" : "فشل إنشاء الحساب"));
        return;
      }

      router.push("/admin");
    } catch {
      // network failure (server down, no connection, etc.)
      setError("تعذر الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3 rounded-xl border border-neutral-200 p-6 shadow-sm">
        <div className="mb-2 flex gap-2">
          <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-full px-3 py-2 text-sm font-bold ${mode === "login" ? "bg-kayaan-brown text-white" : "bg-neutral-100 text-neutral-700"}`}>
            تسجيل دخول
          </button>
          <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-full px-3 py-2 text-sm font-bold ${mode === "signup" ? "bg-kayaan-brown text-white" : "bg-neutral-100 text-neutral-700"}`}>
            إنشاء حساب
          </button>
        </div>
        <h1 className="mb-2 text-lg font-bold">{mode === "login" ? "تسجيل دخول المسؤول" : "إنشاء حساب مسؤول"}</h1>
        <input
          type="email"
          required
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
        />
        <input
          type="password"
          required
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
        />
        {mode === "signup" && (
          <input
            type="password"
            required
            placeholder="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm"
          />
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-full bg-kayaan-brown py-2.5 text-sm font-bold text-white disabled:opacity-60">
          {loading ? (mode === "login" ? "جاري تسجيل الدخول..." : "جاري إنشاء الحساب...") : mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب"}
        </button>
      </form>
    </div>
  );
}