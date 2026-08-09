"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/csrf-fetch";
import { useAuth } from "@/context/AuthContext";

export default function OutcomeButton({
  answerId,
  questionAuthorId,
  alreadyResolved,
}: {
  answerId: string;
  questionAuthorId: string;
  alreadyResolved: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Only the person who asked the question can attest to the outcome —
  // enforced again server-side regardless of this client-side gate
  // (src/modules/reputation/service.ts recordOutcome()).
  if (!user || user.id !== questionAuthorId || alreadyResolved) return null;

  async function markResolved() {
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/answers/${answerId}/outcome`, {
        method: "POST",
        body: JSON.stringify({ resolved: true }),
      });
      if (res.ok) router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={markResolved}
      disabled={submitting}
      className="text-xs rounded-full border border-brand text-brand px-3 py-1 hover:bg-brand/10 disabled:opacity-60"
    >
      {submitting ? "..." : "هذا حلّ مشكلتي"}
    </button>
  );
}
