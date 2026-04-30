"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      setIsLoggedIn(Boolean(data.session));
      setIsChecking(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
      setIsChecking(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-gray-100 bg-[#f7f8f6]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          CreateLog
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-700 md:flex">
          <Link href="/themes" className="hover:text-gray-900">
            課題一覧
          </Link>
          <Link href="/posts" className="hover:text-gray-900">
            投稿一覧
          </Link>
          <Link href="/about" className="hover:text-gray-900">
            このサービスについて
          </Link>
          <Link href="/notes-about" className="hover:text-gray-900">
            ノートについて
          </Link>
          <Link href="/contact" className="hover:text-gray-900">
            お問合せ
          </Link>
        </nav>

        <div className="hidden items-center gap-4 text-sm md:flex">
          {isChecking ? (
            <span className="text-gray-400">確認中...</span>
          ) : isLoggedIn ? (
            <>
              <Link href="/mypage" className="text-gray-700 hover:text-gray-900">
                マイページ
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-gray-900">
                ログイン
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50"
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}