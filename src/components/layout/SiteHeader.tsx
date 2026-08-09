"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SiteHeader() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-b border-border bg-white/90 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-brand">خِبرة</span>
          <span className="text-xs text-muted tracking-wide">KHIBRA</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/questions" className="hover:text-brand">
            الأسئلة
          </Link>
          <Link href="/experts" className="hover:text-brand">
            الخبراء
          </Link>

          {loading ? null : user ? (
            <>
              <span className="text-muted">مرحباً، {user.displayName}</span>
              <button
                onClick={() => logout()}
                className="rounded-md border border-border px-3 py-1.5 hover:bg-paper-dim"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md border border-border px-3 py-1.5 hover:bg-paper-dim"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-brand text-white px-3 py-1.5 hover:bg-brand-dim"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
