"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(`登録エラー: ${error.message}`);
      setIsLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setMessage("確認メールを送信しました。メールを確認してください。");
      setIsLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      username,
      display_name: displayName,
    });

    if (profileError) {
      setMessage(`プロフィール作成エラー: ${profileError.message}`);
      setIsLoading(false);
      return;
    }

    setMessage("登録が完了しました。ログインページからログインしてください。");
    setIsLoading(false);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm text-gray-600">Register</p>
          <h1 className="text-3xl font-bold text-gray-900">新規登録</h1>
          <p className="mt-4 text-sm leading-7 text-gray-700">
            CreateLogで学習アウトプットを記録するためのアカウントを作成します。
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">
                表示名
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
                placeholder="例：末岡 哲"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-900">
                ユーザー名
              </label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                placeholder="例：sueoka"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
              <p className="mt-2 text-xs text-gray-500">
                公開プロフィールURLに使います。
              </p>
            </div>

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
                minLength={6}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
              <p className="mt-2 text-xs text-gray-500">
                6文字以上で入力してください。
              </p>
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
              {isLoading ? "登録中..." : "登録する"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/login" className="font-bold text-orange-600">
              ログイン
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}