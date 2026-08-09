"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/csrf-fetch";
import { useAuth } from "@/context/AuthContext";

const DIMENSIONS = [
  { key: "helpful", label: "مفيدة" },
  { key: "accurate", label: "دقيقة" },
  { key: "clear", label: "واضحة" },
  { key: "recommend", label: "أنصح بها" },
] as const;

type DimensionKey = (typeof DIMENSIONS)[number]["key"];

export default function RatingWidget({
  answerId,
  answerAuthorId,
}: {
  answerId: string;
  answerAuthorId: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<Record<DimensionKey, boolean>>({
    helpful: false,
    accurate: false,
    clear: false,
    recommend: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // The UI hides the control for the answer's own author, but this is a
  // convenience only — the server independently rejects self-rating
  // regardless of what the client sends (THREAT_MODEL.md §4.2).
  if (!user || user.id === answerAuthorId) return null;

  async function submit() {
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/answers/${answerId}/rating`, {
        method: "POST",
        body: JSON.stringify(selected),
      });
      if (res.ok) {
        setSubmitted(true);
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <span className="text-xs text-brand">شكراً على تقييمك</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {DIMENSIONS.map((dim) => (
        <button
          key={dim.key}
          type="button"
          onClick={() => setSelected((s) => ({ ...s, [dim.key]: !s[dim.key] }))}
          className={`rounded-full border px-2.5 py-1 ${
            selected[dim.key]
              ? "border-brand bg-brand/10 text-brand"
              : "border-border text-muted"
          }`}
        >
          {dim.label}
        </button>
      ))}
      <button
        type="button"
        onClick={submit}
        disabled={submitting}
        className="rounded-full bg-ink text-white px-3 py-1 disabled:opacity-60"
      >
        {submitting ? "..." : "إرسال التقييم"}
      </button>
    </div>
  );
}
