import Link from "next/link";
import { listExperts } from "@/modules/experts/service";

export const dynamic = "force-dynamic";

export default async function ExpertsPage() {
  const experts = await listExperts({});

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink mb-6">الخبراء</h1>

      {experts.length === 0 && (
        <p className="text-muted">لا يوجد خبراء بعد.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {experts.map((expert) => (
          <li key={expert.id}>
            <Link
              href={`/experts/${expert.id}`}
              className="block rounded-xl border border-border bg-white p-5 hover:border-brand transition-colors"
            >
              <h2 className="font-semibold text-ink">{expert.user.displayName}</h2>
              <p className="mt-1 text-sm text-muted">{expert.headline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-paper-dim px-2 py-0.5">
                  سمعة {Math.round(expert.reputationScore)}
                </span>
                {expert.verificationLevel > 0 && (
                  <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5">
                    تحقق مستوى {expert.verificationLevel}
                  </span>
                )}
                {expert.topics.map((t) => (
                  <span key={t.topicId} className="rounded-full border border-border px-2 py-0.5 text-muted">
                    {t.topic.nameAr}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
