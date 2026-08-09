"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/csrf-fetch";
import { useAuth } from "@/context/AuthContext";

export default function AnswerForm({ questionId }: { questionId: string }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "تعذر نشر الإجابة");
        return;
      }
      setBody("");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && !user) {
    return <p className="text-sm text-muted">يجب تسجيل الدخول للإجابة على هذا السؤال.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <textarea
        required
        minLength={10}
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="شارك إجابتك المبنية على خبرة حقيقية..."
        className="rounded-md border border-border px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-lg bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dim disabled:opacity-60"
      >
        {submitting ? "جارٍ النشر..." : "نشر الإجابة"}
      </button>
    </form>
  );
}
