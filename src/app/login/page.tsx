"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/csrf-fetch";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [needsMfa, setNeedsMfa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, ...(totp ? { totp } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.code === "AUTH_003") {
          setNeedsMfa(true);
          setError("أدخل رمز التحقق بخطوتين");
        } else {
          // Deliberately the same generic message for "wrong password" and
          // "no such account" — no user enumeration (THREAT_MODEL.md §4.4).
          setError(data.error?.message ?? "بيانات الدخول غير صحيحة");
        }
        return;
      }
      await refresh();
      router.push("/");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold text-ink mb-6">تسجيل الدخول</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink font-medium">البريد الإلكتروني</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink font-medium">كلمة المرور</span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        {needsMfa && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-ink font-medium">رمز التحقق (6 أرقام)</span>
            <input
              required
              inputMode="numeric"
              pattern="\d{6}"
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              className="rounded-md border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
            />
          </label>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand text-white px-4 py-2.5 font-medium hover:bg-brand-dim disabled:opacity-60"
        >
          {submitting ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
