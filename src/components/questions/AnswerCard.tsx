import RatingWidget from "./RatingWidget";
import OutcomeButton from "./OutcomeButton";

interface AnswerCardProps {
  answer: {
    id: string;
    body: string;
    createdAt: Date;
    authorId: string;
    author: {
      displayName: string;
      expertProfile: { reputationScore: number; verificationLevel: number } | null;
    };
    outcome: { resolved: boolean } | null;
  };
  questionAuthorId: string;
}

export default function AnswerCard({ answer, questionAuthorId }: AnswerCardProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <p className="text-ink whitespace-pre-wrap">{answer.body}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-2">
          <span>{answer.author.displayName}</span>
          {answer.author.expertProfile && (
            <span className="rounded-full bg-paper-dim px-2 py-0.5">
              سمعة {Math.round(answer.author.expertProfile.reputationScore)}
              {answer.author.expertProfile.verificationLevel > 0 &&
                ` · تحقق مستوى ${answer.author.expertProfile.verificationLevel}`}
            </span>
          )}
        </div>
        {answer.outcome?.resolved && (
          <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5 font-medium">
            ✓ تم حل المشكلة
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <RatingWidget answerId={answer.id} answerAuthorId={answer.authorId} />
        <OutcomeButton
          answerId={answer.id}
          questionAuthorId={questionAuthorId}
          alreadyResolved={!!answer.outcome?.resolved}
        />
      </div>
    </div>
  );
}
