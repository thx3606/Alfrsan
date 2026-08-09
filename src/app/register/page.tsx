"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/csrf-fetch";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ displayName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "حدث خطأ غير متوقع");
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
      <h1 className="text-2xl font-bold text-ink mb-6">إنشاء حساب</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="الاسم" value={displayName} onChange={setDisplayName} minLength={2} />
        <Field label="البريد الإلكتروني" type="email" value={email} onChange={setEmail} />
        <Field
          label="كلمة المرور"
          type="password"
          value={password}
          onChange={setPassword}
          minLength={12}
          hint="12 حرفاً على الأقل، مع تنوع في الأحرف والأرقام والرموز."
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand text-white px-4 py-2.5 font-medium hover:bg-brand-dim disabled:opacity-60"
        >
          {submitting ? "جارٍ الإنشاء..." : "إنشاء حساب"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  minLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  minLength?: number;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-ink font-medium">{label}</span>
      <input
        required
        type={type}
        value={value}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}
