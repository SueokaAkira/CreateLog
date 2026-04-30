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
  avatar_url: string | null;
  website_url: string | null;
};

type MyPost = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tools: string | null;
  image_url: string | null;
  status: "public" | "private" | "draft";
  created_at: string;
};

function getStatusLabel(status: MyPost["status"]) {
  if (status === "public") return "公開";
  if (status === "private") return "非公開";
  return "下書き";
}

function getStatusClassName(status: MyPost["status"]) {
  if (status === "public") {
    return "bg-green-50 text-green-700";
  }

  if (status === "private") {
    return "bg-gray-100 text-gray-700";
  }

  return "bg-orange-50 text-orange-700";
}

export default function MyPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPageData = async () => {
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

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, display_name, bio, avatar_url, website_url")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setMessage(`プロフィール取得エラー: ${profileError.message}`);
        setIsLoading(false);
        return;
      }

      const { data: postData, error: postsError } = await supabase
        .from("posts")
        .select(
          "id, title, description, category, tools, image_url, status, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (postsError) {
        setMessage(`投稿取得エラー: ${postsError.message}`);
        setIsLoading(false);
        return;
      }

      setProfile(profileData);
      setPosts((postData ?? []) as MyPost[]);
      setIsLoading(false);
    };

    fetchMyPageData();
  }, [router]);

    const handleDeletePost = async (postId: string) => {
    const isConfirmed = window.confirm(
        "この投稿を削除します。削除した投稿は元に戻せません。よろしいですか？"
    );

    if (!isConfirmed) {
        return;
    }

    setMessage("");
    setDeletingPostId(postId);

    const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

    if (error) {
        setMessage(`削除エラー: ${error.message}`);
        setDeletingPostId(null);
        return;
    }

    setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postId)
    );
    setDeletingPostId(null);
    };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="mb-3 text-sm text-gray-600">My Page</p>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              マイページ
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-700">
              投稿した作品や学習ログを管理するページです。公開・非公開・下書きの状態もここで確認できます。
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">読み込み中...</p>
            </div>
          ) : message ? (
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-sm text-red-600">{message}</p>
            </div>
          ) : profile ? (
            <div className="grid gap-8 md:grid-cols-[280px_1fr]">
              <aside className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-2xl font-bold text-orange-600">
                  {profile.display_name.slice(0, 1)}
                </div>

                <h2 className="mt-6 text-xl font-bold text-gray-900">
                  {profile.display_name}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  @{profile.username}
                </p>

                {profile.bio ? (
                  <p className="mt-5 text-sm leading-7 text-gray-700">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="mt-5 text-sm leading-7 text-gray-500">
                    自己紹介はまだ登録されていません。
                  </p>
                )}

                <div className="mt-6 space-y-3">
                <Link
                    href={`/users/${profile.username}`}
                    className="block rounded-md border border-gray-300 bg-white px-4 py-3 text-center text-sm font-bold text-gray-900 hover:bg-gray-50"
                >
                    公開プロフィールを見る
                </Link>

                <Link
                    href="/mypage/profile/edit"
                    className="block rounded-md border border-gray-300 bg-white px-4 py-3 text-center text-sm font-bold text-gray-900 hover:bg-gray-50"
                >
                    プロフィールを編集
                </Link>

                <Link
                    href="/posts/new"
                    className="block rounded-md bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-orange-600"
                >
                    投稿を作成する
                </Link>
                </div>
              </aside>

              <section className="space-y-6">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        自分の投稿
                      </h2>
                      <p className="mt-2 text-sm text-gray-600">
                        公開・非公開・下書きの投稿を管理できます。
                      </p>
                    </div>

                    <Link
                      href="/posts/new"
                      className="rounded-md bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white hover:bg-orange-600"
                    >
                      新しい投稿を作成
                    </Link>
                  </div>

                  {posts.length > 0 ? (
                    <div className="mt-8 grid gap-5">
                      {posts.map((post) => (
                        <article
                          key={post.id}
                          className="rounded-2xl border border-gray-100 p-5"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <div className="mb-3 flex flex-wrap gap-2">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClassName(
                                    post.status
                                  )}`}
                                >
                                  {getStatusLabel(post.status)}
                                </span>

                                {post.category && (
                                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                    {post.category}
                                  </span>
                                )}

                                {post.tools && (
                                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                                    {post.tools}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-lg font-bold text-gray-900">
                                {post.title}
                              </h3>

                              {post.description && (
                                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                                  {post.description}
                                </p>
                              )}
                            </div>

                            <div className="flex shrink-0 flex-wrap gap-3">
                            {post.status === "public" && (
                                <Link
                                href={`/posts/${post.id}`}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-900 hover:bg-gray-50"
                                >
                                表示
                                </Link>
                            )}

                            <Link
                                href={`/posts/${post.id}/edit`}
                                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
                            >
                                編集
                            </Link>

                            <button
                                type="button"
                                onClick={() => handleDeletePost(post.id)}
                                disabled={deletingPostId === post.id}
                                className="rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                                {deletingPostId === post.id ? "削除中..." : "削除"}
                            </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-8 rounded-2xl bg-[#f7f8f6] p-8 text-center">
                      <p className="font-bold text-gray-900">
                        まだ投稿がありません
                      </p>
                      <p className="mt-3 text-sm leading-7 text-gray-600">
                        課題を選んで、最初のアウトプットを記録してみましょう。
                      </p>
                      <Link
                        href="/themes"
                        className="mt-6 inline-block rounded-md bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
                      >
                        課題を選ぶ
                      </Link>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900">
                    次にできること
                  </h2>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Link
                      href="/themes"
                      className="rounded-2xl border border-gray-100 p-5 hover:bg-[#f7f8f6]"
                    >
                      <p className="text-sm font-bold text-gray-900">
                        課題を選ぶ
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        バナー、ロゴ、LPなどの課題から制作テーマを選びます。
                      </p>
                    </Link>

                    <Link
                      href="/posts"
                      className="rounded-2xl border border-gray-100 p-5 hover:bg-[#f7f8f6]"
                    >
                      <p className="text-sm font-bold text-gray-900">
                        みんなの投稿を見る
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        他のユーザーの公開投稿から、表現や考え方を参考にできます。
                      </p>
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}