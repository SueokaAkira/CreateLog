"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  website_url: string | null;
};

export default function EditProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, bio, website_url")
        .eq("id", user.id)
        .single();

      if (error || !data) {
        setMessage("プロフィールを取得できませんでした。");
        setIsLoading(false);
        return;
      }

      const profile = data as Profile;

      setDisplayName(profile.display_name);
      setUsername(profile.username);
      setBio(profile.bio ?? "");
      setWebsiteUrl(profile.website_url ?? "");
      setIsLoading(false);
    };

    fetchProfile();
  }, [router]);

  const validateUsername = (value: string) => {
    return /^[a-zA-Z0-9_-]+$/.test(value);
  };

  const validateWebsiteUrl = (value: string) => {
    if (!value.trim()) return true;

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleUpdateProfile = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setMessage("");

    if (!userId) {
      setMessage("ログイン情報を確認できませんでした。再度ログインしてください。");
      return;
    }

    if (!displayName.trim()) {
      setMessage("表示名を入力してください。");
      return;
    }

    if (!username.trim()) {
      setMessage("ユーザー名を入力してください。");
      return;
    }

    if (!validateUsername(username)) {
      setMessage(
        "ユーザー名は半角英数字、ハイフン、アンダースコアのみ使用できます。"
      );
      return;
    }

    if (!validateWebsiteUrl(websiteUrl)) {
      setMessage("WebサイトURLは http:// または https:// から始まるURLにしてください。");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        username,
        bio: bio || null,
        website_url: websiteUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      if (error.code === "23505") {
        setMessage("このユーザー名はすでに使われています。別のユーザー名にしてください。");
      } else {
        setMessage(`更新エラー: ${error.message}`);
      }

      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    router.push("/mypage");
    router.refresh();
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-600">
              プロフィールを読み込み中...
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/mypage"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← マイページに戻る
          </Link>

          <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm md:p-12">
            <div className="mb-10">
              <p className="mb-3 text-sm text-gray-600">Edit Profile</p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                プロフィール編集
              </h1>
              <p className="mt-4 text-sm leading-7 text-gray-700">
                公開プロフィールに表示される名前、ユーザー名、自己紹介、WebサイトURLを編集できます。
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  表示名
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="例：末岡 哲"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
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
                  placeholder="例：sueoka"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
                <p className="mt-2 text-xs leading-6 text-gray-500">
                  公開プロフィールURLに使われます。半角英数字、ハイフン、アンダースコアのみ使用できます。
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  自己紹介
                </label>
                <textarea
                  rows={6}
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="学習中のこと、得意な制作物、ポートフォリオとして見せたい内容などを書いてください。"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  WebサイトURL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
                <p className="mt-2 text-xs leading-6 text-gray-500">
                  ポートフォリオサイト、SNS、制作実績ページなどを登録できます。
                </p>
              </div>

              {message && (
                <p className="rounded-xl bg-[#f7f8f6] p-4 text-sm leading-7 text-red-600">
                  {message}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                  {isSaving ? "保存中..." : "変更を保存する"}
                </button>

                <Link
                  href="/mypage"
                  className="rounded-md border border-gray-300 bg-white px-5 py-3 text-center text-sm font-bold text-gray-900 hover:bg-gray-50"
                >
                  キャンセル
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
