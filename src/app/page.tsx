import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="py-20 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-ink">
          ماذا تريد أن تعرف اليوم؟
        </h1>
        <p className="mt-4 text-muted max-w-xl mx-auto">
          اسأل، اكتشف خبيراً موثوقاً، وتعلم من تجارب حقيقية — القيمة هنا تُقاس
          بالمعرفة والأثر، لا بعدد المتابعين.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/questions/new"
            className="rounded-lg bg-brand text-white px-5 py-2.5 font-medium hover:bg-brand-dim"
          >
            اسأل سؤالاً
          </Link>
          <Link
            href="/experts"
            className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-paper-dim"
          >
            اكتشف خبيراً
          </Link>
          <Link
            href="/questions"
            className="rounded-lg border border-border px-5 py-2.5 font-medium hover:bg-paper-dim"
          >
            تصفح الأسئلة
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        <FeatureCard
          title="سمعة معرفية حقيقية"
          body="التقييم يعتمد على جودة الإجابة والنتيجة الفعلية، وليس عدد الإعجابات."
        />
        <FeatureCard
          title="تحقق متعدد المستويات"
          body="علامة التحقق لها معنى حقيقي: هوية، مؤهلات، وخبرة مُراجعة بشرياً."
        />
        <FeatureCard
          title="إثبات النتيجة"
          body="بعد استخدام إجابة، يمكنك تسجيل أنها حلّت مشكلتك فعلاً — وهذا يرفع قيمتها."
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border p-6 bg-white">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}
