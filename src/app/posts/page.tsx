export const dynamic = "force-dynamic";

import Link from "next/link";
import { PostCard } from "@/components/features/posts/PostCard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/lib/supabase/client";

type PublicPost = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  tools: string | null;
  image_url: string | null;
  profiles:
    | {
        username: string;
        display_name: string;
      }[]
    | null;
};

export default async function PostsPage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      description,
      category,
      tools,
      image_url,
      profiles (
        username,
        display_name
      )
    `
    )
    .eq("status", "public")
    .order("created_at", { ascending: false });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f8f6] px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <section className="mb-12 rounded-3xl bg-white px-8 py-10 shadow-sm ring-1 ring-gray-100 md:px-12 md:py-14">
            <div className="grid gap-8 md:grid-cols-[1fr_280px] md:items-end">
              <div>
                <p className="mb-3 text-sm font-bold text-orange-500">
                  Posts
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  投稿一覧
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-gray-700">
                  公開された学習アウトプットを一覧で確認できます。
                  制作意図や使用ツールを見ながら、自分の学習にも活かしていきましょう。
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Link
                  href="/themes"
                  className="rounded-full bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
                >
                  課題を選ぶ
                </Link>

                <Link
                  href="/posts/new"
                  className="rounded-full border border-gray-200 bg-white px-5 py-3 text-center text-sm font-bold text-gray-900 transition hover:bg-gray-50"
                >
                  投稿を作成する
                </Link>
              </div>
            </div>
          </section>

          {error ? (
            <div className="rounded-3xl bg-white p-8 text-red-600 shadow-sm ring-1 ring-gray-100">
              データ取得エラー: {error.message}
            </div>
          ) : posts && posts.length > 0 ? (
            <section>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-orange-500">
                    Public Works
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                    みんなのアウトプット
                  </h2>
                </div>

                <p className="hidden text-sm text-gray-500 sm:block">
                  {posts.length}件の投稿
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {(posts as PublicPost[]).map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    description={post.description}
                    category={post.category}
                    tools={post.tools}
                    imageUrl={post.image_url}
                    displayName={post.profiles?.[0]?.display_name}
                    username={post.profiles?.[0]?.username}
                  />
                ))}
              </div>
            </section>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-xl font-bold text-orange-500">
                C
              </div>

              <p className="mt-6 font-bold text-gray-900">
                公開投稿はまだありません
              </p>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                最初の投稿を作成すると、ここに表示されます。
              </p>

              <Link
                href="/posts/new"
                className="mt-6 inline-block rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
              >
                投稿を作成する
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}