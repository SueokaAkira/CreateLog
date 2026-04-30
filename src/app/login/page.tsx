"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`ログインエラー: ${error.message}`);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.push("/posts/new");
    router.refresh();
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm text-gray-600">Login</p>
          <h1 className="text-3xl font-bold text-gray-900">ログイン</h1>
          <p className="mt-4 text-sm leading-7 text-gray-700">
            アカウントにログインして、学習アウトプットを投稿しましょう。
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            {message && (
              <p className="rounded-xl bg-[#f7f8f6] p-4 text-sm leading-7 text-gray-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {isLoading ? "ログイン中..." : "ログインする"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="font-bold text-orange-600">
              新規登録
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}