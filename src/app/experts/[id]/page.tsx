import { getExpertProfile } from "@/modules/experts/service";

export const dynamic = "force-dynamic";

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = await getExpertProfile(id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-xl border border-border bg-white p-6">
        <h1 className="text-2xl font-bold text-ink">{expert.user.displayName}</h1>
        <p className="mt-1 text-muted">{expert.headline}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-paper-dim px-3 py-1">
            سمعة معرفية {Math.round(expert.reputationScore)}
          </span>
          {expert.verificationLevel > 0 && (
            <span className="rounded-full bg-brand/10 text-brand px-3 py-1">
              تحقق مستوى {expert.verificationLevel}
            </span>
          )}
          {expert.yearsExperience != null && (
            <span className="rounded-full border border-border px-3 py-1 text-muted">
              {expert.yearsExperience} سنة خبرة
            </span>
          )}
        </div>

        {expert.user.bio && <p className="mt-4 text-ink">{expert.user.bio}</p>}

        {expert.topics.length > 0 && (
          <div className="mt-5">
            <h2 className="text-sm font-semibold text-ink mb-2">التخصصات</h2>
            <div className="flex flex-wrap gap-2">
              {expert.topics.map((t) => (
                <span
                  key={t.topicId}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                >
                  {t.topic.nameAr}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
