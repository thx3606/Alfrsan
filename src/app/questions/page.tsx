import Link from "next/link";
import { listQuestions } from "@/modules/content/service";

export const dynamic = "force-dynamic";

export default async function QuestionsPage() {
  const questions = await listQuestions({});

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">الأسئلة</h1>
        <Link
          href="/questions/new"
          className="rounded-lg bg-brand text-white px-4 py-2 text-sm font-medium hover:bg-brand-dim"
        >
          اسأل سؤالاً
        </Link>
      </div>

      {questions.length === 0 && (
        <p className="text-muted">لا توجد أسئلة بعد. كن أول من يسأل.</p>
      )}

      <ul className="flex flex-col gap-4">
        {questions.map((q) => (
          <li key={q.id}>
            <Link
              href={`/questions/${q.id}`}
              className="block rounded-xl border border-border p-5 bg-white hover:border-brand transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-ink">{q.title}</h2>
                <span className="shrink-0 text-xs text-muted">
                  {q._count.answers} إجابة
                </span>
              </div>
              <p className="mt-2 text-sm text-muted line-clamp-2">{q.body}</p>
              <div className="mt-3 text-xs text-muted">
                بواسطة {q.author.displayName}
                {q.topic && <> · {q.topic.nameAr}</>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
