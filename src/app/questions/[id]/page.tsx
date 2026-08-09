import { getQuestionWithAnswers } from "@/modules/content/service";
import AnswerForm from "@/components/questions/AnswerForm";
import AnswerCard from "@/components/questions/AnswerCard";

export const dynamic = "force-dynamic";

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await getQuestionWithAnswers(id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <article className="rounded-xl border border-border bg-white p-6">
        <h1 className="text-xl font-bold text-ink">{question.title}</h1>
        <p className="mt-3 text-ink whitespace-pre-wrap">{question.body}</p>
        <div className="mt-4 text-xs text-muted">
          بواسطة {question.author.displayName}
          {question.topic && <> · {question.topic.nameAr}</>}
        </div>
      </article>

      <section className="mt-8">
        <h2 className="font-semibold text-ink mb-4">
          {question.answers.length} إجابة
        </h2>
        <div className="flex flex-col gap-4">
          {question.answers.map((answer) => (
            <AnswerCard
              key={answer.id}
              answer={answer}
              questionAuthorId={question.authorId}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold text-ink mb-4">أضف إجابة</h2>
        <AnswerForm questionId={question.id} />
      </section>
    </div>
  );
}
