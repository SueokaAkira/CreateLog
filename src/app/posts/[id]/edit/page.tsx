"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

type PostStatus = "public" | "private" | "draft";

type EditPost = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  concept: string | null;
  tools: string | null;
  category: string | null;
  status: PostStatus;
  copyright_confirmed: boolean;
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [concept, setConcept] = useState("");
  const [tools, setTools] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<PostStatus>("public");
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
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
        .from("posts")
        .select(
          "id, user_id, title, description, concept, tools, category, status, copyright_confirmed"
        )
        .eq("id", postId)
        .single();

      if (error || !data) {
        setMessage("投稿を取得できませんでした。");
        setIsLoading(false);
        return;
      }

      const post = data as EditPost;

      if (post.user_id !== user.id) {
        setMessage("この投稿を編集する権限がありません。");
        setIsLoading(false);
        return;
      }

      setTitle(post.title);
      setDescription(post.description ?? "");
      setConcept(post.concept ?? "");
      setTools(post.tools ?? "");
      setCategory(post.category ?? "");
      setStatus(post.status);
      setCopyrightConfirmed(post.copyright_confirmed);
      setIsLoading(false);
    };

    fetchPost();
  }, [postId, router]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!userId) {
      setMessage("ログイン情報を確認できませんでした。再度ログインしてください。");
      return;
    }

    if (!title.trim()) {
      setMessage("投稿タイトルを入力してください。");
      return;
    }

    if (!copyrightConfirmed) {
      setMessage("投稿前の確認事項にチェックしてください。");
      return;
    }

    setIsSaving(true);

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        description,
        concept,
        tools,
        category,
        status,
        copyright_confirmed: copyrightConfirmed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("user_id", userId);

    if (error) {
      setMessage(`更新エラー: ${error.message}`);
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
            <p className="text-sm text-gray-600">投稿を読み込み中...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (message && !title) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm text-red-600">{message}</p>
            <Link
              href="/mypage"
              className="mt-6 inline-block rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
            >
              マイページへ戻る
            </Link>
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
              <p className="mb-3 text-sm text-gray-600">Edit Post</p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                投稿を編集
              </h1>
              <p className="mt-4 text-sm leading-7 text-gray-700">
                投稿タイトル、説明文、制作意図、公開状態を編集できます。
              </p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  投稿タイトル
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  カテゴリ
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="例：バナー / ロゴ / LP / UI"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  説明文
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  制作意図
                </label>
                <textarea
                  rows={5}
                  value={concept}
                  onChange={(event) => setConcept(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  使用ツール
                </label>
                <input
                  type="text"
                  value={tools}
                  onChange={(event) => setTools(event.target.value)}
                  placeholder="例：Figma / Photoshop / Illustrator"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  公開設定
                </label>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as PostStatus)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                >
                  <option value="public">公開</option>
                  <option value="private">非公開</option>
                  <option value="draft">下書き</option>
                </select>
              </div>

              <label className="flex gap-3 rounded-2xl bg-[#f7f8f6] p-4 text-sm leading-7 text-gray-700">
                <input
                  type="checkbox"
                  checked={copyrightConfirmed}
                  onChange={(event) =>
                    setCopyrightConfirmed(event.target.checked)
                  }
                  className="mt-1"
                />
                <span>
                  他者の作品を無断転載していないこと、投稿内容に問題がないことを確認しました。
                </span>
              </label>

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
                  {isSaving ? "更新中..." : "変更を保存する"}
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