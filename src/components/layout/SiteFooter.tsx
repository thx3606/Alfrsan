export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-muted flex flex-col gap-2">
        <p className="text-ink font-medium">خِبرة | KHIBRA</p>
        <p>المعرفة من أهلها، والقيمة تثبتها النتيجة.</p>
        <p className="text-xs">
          هذا إصدار مبكر قيد التطوير. راجع SECURITY.md قبل الاعتماد على هذا الإصدار في بيئة إنتاج.
        </p>
      </div>
    </footer>
  );
}
