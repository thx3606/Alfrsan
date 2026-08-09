"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/csrf-fetch";
import { useAuth } from "@/context/AuthContext";

export default function NewQuestionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/questions", {
        method: "POST",
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "تعذر إنشاء السؤال");
        return;
      }
      router.push(`/questions/${data.question.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16 text-center">
        <p className="text-muted">يجب تسجيل الدخول لطرح سؤال.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-2xl font-bold text-ink mb-6">اسأل سؤالاً</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink font-medium">عنوان السؤال</span>
          <input
            required
            minLength={8}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-ink font-medium">تفاصيل السؤال</span>
          <textarea
            required
            minLength={20}
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="rounded-md border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand text-white px-4 py-2.5 font-medium hover:bg-brand-dim disabled:opacity-60"
        >
          {submitting ? "جارٍ النشر..." : "نشر السؤال"}
        </button>
      </form>
    </div>
  );
}
